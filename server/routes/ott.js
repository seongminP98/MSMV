const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware');
const ottController = require('../controller/ottController');

router.get('/', ottController.getGroupList);
router.get('/search/:class', ottController.searchGroupsByClass);
router.get('/mine', ottController.listOfParticipatingGroups);
router.post('/make', middleware.isLoggedIn, ottController.create);
router.get('/participation/:groupId', middleware.isLoggedIn, ottController.participation);
router.get('/:groupId', middleware.isGroupMember, middleware.isLoggedIn, ottController.getGroup);
router.post('/remittance', middleware.isLoggedIn, ottController.remittance);
router.get('/remittance/:groupId',middleware.isLoggedIn, middleware.isAdmin, ottController.getRemittanceList);
router.post('/remittance/complete',middleware.isLoggedIn, middleware.isLoggedIn, middleware.isAdmin, ottController.remittanceConfirm);
router.patch('/:groupId',middleware.isLoggedIn, middleware.isAdmin, ottController.modify);
router.delete('/:groupId',middleware.isLoggedIn, ottController.out);
router.post('/comment/:groupId',middleware.isLoggedIn, middleware.isGroupMember, ottController.writeComment);
router.delete('/comment/:commentId',middleware.isLoggedIn, ottController.removeComment);



module.exports = router;