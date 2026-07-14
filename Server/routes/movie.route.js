const express = require("express");
const router = express.Router();
const { fetchAnimeDeets, fetchTopAnime, getAnimeById } = require("../controllers/movie.controller");


router.get("/animes", fetchAnimeDeets);
router.get("/animes/top", fetchTopAnime);   // must come before /animes/:id
router.get("/animes/:id", getAnimeById);


module.exports = router;