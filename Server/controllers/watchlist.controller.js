const pool = require("../config/db");

// req.user.id comes from the auth middleware, so everything is scoped to the logged-in user
// anything with ayncand await should use try and catch
const getWatchlist = async (req, res) => {
    try {
        //[rows] is destructed, original response for pool.query is [data, metadata]], so this grabs the first item and names it row
        const [rows] = await pool.query(
            "SELECT mal_id, title, image_url, status, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC",
            [req.user.id]
        );
        res.json({ data: rows });
    } catch (error) {
        console.error("Get watchlist error:", error.message);
        res.status(500).json({ error: "Failed to load watchlist" });
    }
};

const addToWatchlist = async (req, res) => {
    try {
        const { malId, title, imageUrl, status } = req.body;
        if (!malId) return res.status(400).json({ error: "malId is required" });

        // INSERT IGNORE so saving the same anime twice doesn't error
        await pool.query(
            "INSERT IGNORE INTO watchlist (user_id, mal_id, title, image_url, status) VALUES (?, ?, ?, ?, ?)",
            [req.user.id, malId, title || null, imageUrl || null, status || null]
        );
        res.status(201).json({ message: "Added to watchlist" });
    } catch (error) {
        console.error("Add watchlist error:", error.message);
        res.status(500).json({ error: "Failed to add to watchlist" });
    }
};

const removeFromWatchlist = async (req, res) => {
    try {
        const { malId } = req.params;
        await pool.query("DELETE FROM watchlist WHERE user_id = ? AND mal_id = ?", [
            req.user.id,
            malId,
        ]);
        //position matters in sql, this user_id = ? AND mal_id = ?" checks user and which anime making sure both conditions are true
        res.json({ message: "Removed from watchlist" });
    } catch (error) {
        console.error("Remove watchlist error:", error.message);
        res.status(500).json({ error: "Failed to remove from watchlist" });
    }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
