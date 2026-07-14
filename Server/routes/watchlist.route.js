const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
} = require("../controllers/watchlist.controller");

// requireAuth guards every route in this file — you must be logged in.
router.get("/", requireAuth, getWatchlist);
router.post("/", requireAuth, addToWatchlist);
router.delete("/:malId", requireAuth, removeFromWatchlist);

module.exports = router;
