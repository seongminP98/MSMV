const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const bcrypt = require('bcrypt');
const middleware = require('../lib/middleware');
const mypageController = require('../controller/mypageController');

router.patch('/nickname', middleware.isLoggedIn, mypageController.changeNickname);
router.patch('/password', middleware.isLoggedIn, mypageController.changePassword);
router.post('/withdraw', middleware.isLoggedIn, mypageController.withdraw);
router.get('/myReview', middleware.isLoggedIn, mypageController.myReview);

module.exports = router;