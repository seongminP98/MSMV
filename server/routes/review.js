const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware');
const reviewController = require('../controller/reviewController');

router.post('/',middleware.isLoggedIn, reviewController.write);
router.patch('/', middleware.isLoggedIn, reviewController.modify);
router.delete('/:id', middleware.isLoggedIn, reviewController.delete);


module.exports = router;