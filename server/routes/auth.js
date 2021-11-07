const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware');
const authController = require('../controller/authController');

router.post('/login', middleware.isNotLoggedIn, authController.login);
router.get('/login', middleware.isLoggedIn, authController.getLogin);
router.get('/logout', middleware.isLoggedIn, authController.logout);

module.exports = router;