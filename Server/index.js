const express = require("express")
const app = express()
const dotenv = require("dotenv")
const path = require("path")
const axios = require("axios")
const cors = require('cors')
dotenv.config()
// allow the deployed client + local dev; compare without a trailing slash so a
// stray "/" in CLIENT_URL doesn't cause the browser to block every request.
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"]
    .filter(Boolean)
    .map((o) => o.replace(/\/$/, ""));
app.use(cors({
    origin: (origin, cb) => {
        // no Origin header = non-browser client (curl, same-origin) — allow it
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin.replace(/\/$/, ""))) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
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