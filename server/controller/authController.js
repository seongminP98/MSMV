const statusCode = require('../config/statusCode');
const passport = require('passport');

const authController = {
    login : async(req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if(err){
                return next(err);
            }
            if(!user) {
                return req.session.save((err) => {
                    if(err) {
                        return next(err);
                    }
                    return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: info.message});
                })
            }
            req.login(user, (err) => {
                if(err) {
                    return next(err);
                }
                return req.session.save((err) => {
                    if(err) {
                        return next(err);
                    }
                    return res.status(statusCode.OK).send({code: statusCode.OK, result : user});
                })
            })
        })(req, res, next);
    },

    getLogin : async(req, res) => {
        if(req.user) {
            res.status(statusCode.OK).send({code: statusCode.OK, result: req.user});
        } else {
            res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: 'not login'});
        }
    },

    logout : async(req, res) => {
        req.logout();
        req.session.save(() => {
            res.status(statusCode.OK).send({code: statusCode.OK});
        })
    }
}

module.exports = authController;