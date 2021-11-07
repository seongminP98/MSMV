const userModel = require('../model/userModel');
const statusCode = require('../config/statusCode');
const bcrypt = require('bcrypt');

const joinController = {
    idConflictCheck : async(req, res) => {
        try{
            let check = await userModel.user.findByUserId(req.body.id);
            if(check.length === 0) {
                res.status(statusCode.OK).send({code: statusCode.OK, message : '사용 가능한 아이디입니다.'});
            } else {
                res.status(statusCode.CONFLICT).send({code: statusCode.CONFLICT, message: '이미 사용 중인 아이디입니다.'});
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    nicknameConflictCheck : async(req, res) => {
        try{
            let check = await userModel.user.findByNickname(req);
            if(check.length === 0) {
                res.status(statusCode.OK).send({code: statusCode.OK, message : '사용 가능한 아이디입니다.'});
            } else {
                res.status(statusCode.CONFLICT).send({code: statusCode.CONFLICT, message: '이미 사용 중인 아이디입니다.'});
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    join : async(req, res) => {
        try{
            bcrypt.hash(req.body.password, 12, async(err, hash) => {
                if(err) {
                    console.error(err);
                    res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
                }
                await userModel.user.save(req, hash);
                let user = await userModel.user.findByUserId(req.body.id);
                res.status(statusCode.OK).send({code: statusCode.OK, result : user[0]});
            })
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    }
}

module.exports = joinController;