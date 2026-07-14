const axios = require("axios");
const pool = require("../config/db");

const JIKAN_BASE = "https://api.jikan.moe/v4";

// Jikan is flaky and rate-limited, so retry a few times before giving up
const jikanGet = async (url, params = {}) => {
    const RETRYABLE = [425, 429, 500, 502, 503, 504];
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            return await axios.get(url, { params, timeout: 8000 });
        } catch (err) {
            lastErr = err;
            const status = err.response?.status;
            console.log(err)
            const retryable =
                !status || RETRYABLE.includes(status) || err.code === "ECONNABORTED";
            if (!retryable) break;
            await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        }
    }
    throw lastErr;
};

// we sort here instead of asking Jikan (its order_by keeps timing out)
const sorters = {
    popularity: (a, b) => (a.popularity ?? Infinity) - (b.popularity ?? Infinity),
    rank: (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity),
    score: (a, b) => (b.score ?? 0) - (a.score ?? 0),
};

// dropdown value -> the status text Jikan puts on each anime (we filter locally)
const statusText = {
    completed: "Finished Airing",
    airing: "Currently Airing",
    upcoming: "Not yet aired",
};

const fetchAnimeDeets = async (req, res) => {
    const { title, sort, status } = req.query;
    const params = {};
    if (title && title.length >= 3) params.q = title;   // Jikan needs 3+ letters

    try {
        const response = await jikanGet(`${JIKAN_BASE}/anime`, params);
        const payload = response.data;
        let list = Array.isArray(payload.data) ? payload.data : [];

        // cache each title in the DB so we can still serve them if Jikan goes down
        // (same table + INSERT we already use in getAnimeById). Best-effort.
        for (const a of list) {
            pool.query(
                "INSERT IGNORE INTO anime_details (mal_id, title, image_url, status, rating, year, synopsis, trailer_url) VALUES (?,?,?,?,?,?,?,?)",
                [a.mal_id, a.title, a.images?.jpg?.image_url ?? null, a.status ?? null, a.rating ?? null, a.year ?? null, a.synopsis ?? null, a.trailer?.embed_url ?? null]
            ).catch(() => {});
        }

        // filter + sort the results ourselves so we don't rely on Jikan's
        // order_by/status (both need MyAnimeList, which is often down)
        if (status && statusText[status]) {
            list = list.filter((a) => a.status === statusText[status]);
        }
        if (sort && sorters[sort]) {
            list = [...list].sort(sorters[sort]);
        }

        payload.data = list;
        res.json(payload);
    } catch (error) {
        console.error("Error fetching anime:", error.message);

        // Jikan is down — serve what we've cached in the DB instead of erroring.
        try {
            const [rows] = await pool.query(
                "SELECT mal_id, title, image_url, status, rating, year, synopsis, trailer_url FROM anime_details LIMIT 50"
            );
            if (rows.length > 0) {
                // reshape flat DB rows back into the structure the frontend expects
                let list = rows.map((r) => ({
                    mal_id: r.mal_id,
                    title: r.title,
                    synopsis: r.synopsis,
                    status: r.status,
                    rating: r.rating,
                    year: r.year,
                    images: { jpg: { image_url: r.image_url, large_image_url: r.image_url } },
                    trailer: { embed_url: r.trailer_url },
                }));
                if (status && statusText[status]) {
                    list = list.filter((a) => a.status === statusText[status]);
                }
                return res.json({ data: list, stale: true });
            }
        } catch (dbErr) {
            console.error("DB fallback failed:", dbErr.message);
        }

        const code = error.response?.status || 502;
        res.status(code).json({ error: "Failed to fetch anime from Jikan. Please try again." });
    }
};

// The featured hero needs the genuinely most-popular titles. Jikan's
// /top/anime endpoint is purpose-built for that and is far more stable than
// order_by on the generic /anime endpoint.
const fetchTopAnime = async (req, res) => {
    try {
        const response = await jikanGet(`${JIKAN_BASE}/top/anime`, {
            filter: "bypopularity",
            limit: 25,
        });

        // the "Now Showing" fallback reads from the same table when /anime is down.
        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        for (const a of list) {
            pool.query(
                "INSERT IGNORE INTO anime_details (mal_id, title, image_url, status, rating, year, synopsis, trailer_url) VALUES (?,?,?,?,?,?,?,?)",
                [a.mal_id, a.title, a.images?.jpg?.image_url ?? null, a.status ?? null, a.rating ?? null, a.year ?? null, a.synopsis ?? null, a.trailer?.embed_url ?? null]
            ).catch(() => {});
        }

        res.json(response.data);
    } catch (error) {
        const status = error.response?.status || 502;
        console.error("Error fetching top anime:", error.message);
        res.status(status).json({ error: "Failed to fetch top anime from Jikan. Please try again." });
    }
};

const getAnimeById = async (req, res) => {
    const { id } = req.params;
    try {
        // serve from our cache if we've already stored this anime
        const [rows] = await pool.query(
            "SELECT mal_id, title, image_url, status, rating, year, synopsis, trailer_url FROM anime_details WHERE mal_id = ?",
            [id]
        );
        if (rows.length > 0) {
            // reshape the flat DB row into the same { data: {...} } / images.jpg
            // structure the frontend (and the Jikan branch below) return, so the
            // details page works identically whether we hit cache or Jikan.
            const r = rows[0];
            return res.json({
                data: {
                    mal_id: r.mal_id,
                    title: r.title,
                    synopsis: r.synopsis,
                    status: r.status,
                    rating: r.rating,
                    year: r.year,
                    images: { jpg: { image_url: r.image_url, large_image_url: r.image_url } },
                    trailer: { embed_url: r.trailer_url },
                },
            });
        }

        const response = await jikanGet(`${JIKAN_BASE}/anime/${id}`);
        const anime = response.data?.data;
        if (!anime) {
            return res.status(404).json({ error: "Anime not found." });
        }

        // pull out just the fields we cache (Jikan nests some of these)
        const details = {
            mal_id: anime.mal_id,
            title: anime.title,
            image_url: anime.images?.jpg?.image_url ?? null,
            status: anime.status ?? null,
            rating: anime.rating ?? null,
            year: anime.year ?? anime.aired?.prop?.from?.year ?? null,
            synopsis: anime.synopsis ?? null,
        };

        // caching is best-effort: a DB failure here shouldn't fail the request
        try {
            await pool.query(
                "INSERT IGNORE INTO anime_details (mal_id, title, image_url, status, rating, year, synopsis) VALUES (?,?,?,?,?,?,?)",
                [
                    details.mal_id,
                    details.title,
                    details.image_url,
                    details.status,
                    details.rating,
                    details.year,
                    details.synopsis,
                ]
            );
        } catch (cacheErr) {
            console.error("Failed to cache anime details:", cacheErr.message);
        }

        res.json(response.data);
    } catch (error) {
        // never try to send a response if one already went out
        if (res.headersSent) {
            console.error("Error after response sent for anime by id:", error.message);
            return;
        }
        const status = error.response?.status || 502;
        console.error("Error fetching anime by id:", error.message);
        res.status(status).json({ error: "Failed to fetch anime from Jikan. Please try again." });
    }
};

module.exports = {
    fetchAnimeDeets,
    fetchTopAnime,
    getAnimeById,
};
