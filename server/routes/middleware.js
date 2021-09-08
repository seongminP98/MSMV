const db = require('../lib/db');

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

    await db.query('select authority from userGroup where group_id = ? and user_id = ?',
    [groupId, req.user.id],
    async(error, result) => {
        if(error){
            console.error(error);
            next(error);
        }
        if(result.length>0) {
            if(result[0].authority === 'ADMIN') {
                next();
            } else {
                res.status(403).send({code:403, result : '권한이 없습니다. 그룹장만 확인 가능합니다.'});
            }
        } else {
            res.status(403).send({code:403, result : '잘못된 접근. 그룹이 없거나 그룹에 속해있지 않습니다.'});
        }
    })
}

const isGroupMember = async(req, res, next) => {
    await db.query('select * from userGroup where group_id = ? and user_id = ?',
    [req.params.groupId, req.user.id],
    async(error, result) => {
        if(error){
            console.error(error);
            next(error);
        }
        if(result.length > 0) {
            next();
        } else {
            res.status(403).send({code:403, result : '잘못된 접근. 그룹이 없거나 그룹에 속해있지 않습니다.'});
        }
    })
}

module.exports = {isLoggedIn, isNotLoggedIn, isAdmin, isGroupMember}
