const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');

router.post('/', searchController.search);
router.get('/genre/:tg', searchController.searchGenre);


module.exports = router;