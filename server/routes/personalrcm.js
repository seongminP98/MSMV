const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware');
const personalRcmController = require('../controller/personalRcmController')

router.post('/', middleware.isLoggedIn, personalRcmController.movieSave);
router.get('/', middleware.isLoggedIn, personalRcmController.getRecommendedMovies);
router.post('/usermovie', middleware.isLoggedIn, personalRcmController.userSelectedMovie);
router.get('/usermovies', middleware.isLoggedIn, personalRcmController.userRcmMovies);

module.exports = router;