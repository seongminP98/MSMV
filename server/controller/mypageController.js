const userModel = require('../model/userModel');
const reviewModel = require('../model/reviewModel');
const statusCode = require('../config/statusCode');
const bcrypt = require('bcrypt');

const mypageController = {
    changeNickname : async(req, res) => {
        try{
            let alreay = await userModel.user.findByNickname(req);
            if(alreay.length > 0) {
                res.status(statusCode.OK).send({code: statusCode.OK, message: '이미 사용 중인 닉네임입니다.'});
            } else {
                await userModel.user.updateNickname(req);
                res.status(statusCode.OK).send({code: statusCode.OK, message: '닉네임 변경이 완료되었습니다.'});
            }

        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    changePassword : async(req, res) => {
        try{
            if(req.body.oldPassword === req.body.newPassword) {
                return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: '기존 비밀번호와 일치합니다.'});
            }
            let hash = await userModel.user.findById(req.user.id)
            if(await bcrypt.compare(req.body.oldPassword, hash[0].password)) {
                bcrypt.hash(req.body.newPassword, 12, async(err, hash) => {
                    if(err) {
                        console.error(err);
                    }
                    await userModel.user.updatePassword(req, hash);
                    res.status(statusCode.OK).send({code: statusCode.OK, message: '비밀번호가 성공적으로 변경되었습니다.'});
                })
            } else {
                res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: '비밀번호가 일치하지 않습니다.'});
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    withdraw : async(req, res) => {
        try{
            let hash = await userModel.user.findById(req.user.id);
            if(await bcrypt.compare(req.body.pw, hash[0].password)) {
                await userModel.user.delete(req);
                req.logout();
                req.session.save(() => {
                    res.status(statusCode.OK).send({code: statusCode.OK, message: '회원 탈퇴가 완료되었습니다.'});
                })
            } else {
                res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: '비밀번호가 일치하지 않습니다.'});
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    myReview : async(req, res) => {
        try {
            res.status(statusCode.OK).send({code: statusCode.OK, result : await reviewModel.review.getMyReview(req)})
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    }
}

module.exports = mypageController;