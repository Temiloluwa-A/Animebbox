const express = require("express")
const app = express()
const dotenv = require("dotenv")
const path = require("path")
const axios = require("axios")
const cors = require('cors')
dotenv.config()
// Allowed browser origins. Compare without a trailing slash so a stray "/" in
// CLIENT_URL doesn't block every request. We never throw on a mismatch — that
// produces a confusing 500 with no CORS headers (the browser then just reports
// "CORS error"); instead we simply don't grant CORS to unknown origins.
const staticAllowed = [process.env.CLIENT_URL, "http://localhost:5173"]
    .filter(Boolean)
    .map((o) => o.replace(/\/$/, ""));
const isAllowedOrigin = (origin) => {
    const o = origin.replace(/\/$/, "");
    if (staticAllowed.includes(o)) return true;
    // allow our Render-hosted frontend(s) without hardcoding the exact subdomain
    if (/^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(o)) return true;
    return false;
};
app.use(cors({
    origin: (origin, cb) => {
        // no Origin header = non-browser client (curl, same-origin) — allow it
        if (!origin) return cb(null, true);
        return cb(null, isAllowedOrigin(origin));
    },
    credentials: true,
}));
app.use(express.json()) //allowws us to parse JSON bodies in requests in form of req.body

const MovieRoutes = require("./routes/movie.route")
const AuthRoutes = require("./routes/auth.route")
const WatchlistRoutes = require("./routes/watchlist.route")
app.use("/api/v1", MovieRoutes)
app.use("/api/v1/auth", AuthRoutes)
app.use("/api/v1/watchlist", WatchlistRoutes)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
}).on("error", (err) => {
    console.error("Server failed to start:", err);
});