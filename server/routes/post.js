const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

router.get('/detail/:movieCd', postController.detail);
router.get('/boxOffice', postController.boxOffice);
router.get('/top10', postController.topTen)
router.get('/recommend/:movieCode', postController.recommendedMovies);

module.exports = router;


