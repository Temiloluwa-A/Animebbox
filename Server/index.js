const express = require("express")
const app = express()
const dotenv = require("dotenv")
const path = require("path")
const axios = require("axios")
const cors = require('cors')
dotenv.config()
// Auth is via JWT in the Authorization header (no cookies), so we don't need a
// credentialed, origin-restricted CORS setup — allow all origins.
app.use(cors());
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