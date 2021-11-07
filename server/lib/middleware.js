const db = require('./db');
const ottModel = require('../model/ottModel')
const statusCode = require('../config/statusCode');
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({code:401, result : '로그인이 필요합니다.'});
    }
};
  
const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({code:401, result : '로그인을 한 상태입니다.'});
    }
};

const isAdmin = async(req, res, next) => {
    let groupId = req.params.groupId
    if(req.params.groupId === undefined) {
        groupId = req.body.groupId;
    }
    let userGroup = await ottModel.ottGroup.findByIdAndUserId(req, groupId);
    if(userGroup.length > 0) {
        if(userGroup[0].authority === 'ADMIN') {
            next();
        } else {
            res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, result: '권한이 없습니다. 그룹장만 확인 가능합니다.'});
        }
    } else {
        res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, result: '잘못된 접근. 그룹이 없거나 그룹에 속해있지 않습니다.'});
    }
}

const isGroupMember = async(req, res, next) => {
    let userGroup = await ottModel.ottGroup.findByIdAndUserId(req, req.params.groupId);
    if(userGroup.length > 0) {
        next();
    } else {
        res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, result: '잘못된 접근. 그룹이 없거나 그룹에 속해있지 않습니다.'});
    }
}

module.exports = {isLoggedIn, isNotLoggedIn, isAdmin, isGroupMember}
