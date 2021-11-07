const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware');
const joinController = require('../controller/joinController');

router.post('/id', middleware.isNotLoggedIn, joinController.idConflictCheck);
router.post('/nick', middleware.isNotLoggedIn, joinController.nicknameConflictCheck);
router.post('/', middleware.isNotLoggedIn, joinController.join);

module.exports = router;
