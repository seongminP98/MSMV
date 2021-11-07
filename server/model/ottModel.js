const db = require('../lib/db');

const ottGroup = {
    //그룹목록
    findAll : () => {
        return new Promise((resolve, reject)=>{
            db.query('select group_id, title, classification, max_member_num, o.created, total_money, div_money, count(user_id) current_count from usergroup left join ottGroup as o on usergroup.group_id = o.id group by group_id',
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    //class(플랫폼)로 그룹 검색
    findByClass : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select group_id, title, classification, max_member_num, o.created, total_money, div_money, count(user_id) current_count from usergroup left join ottGroup as o on usergroup.group_id = o.id group by group_id having classification = ?',
            [req.params.class],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    //사용자가 참여중인 그룹목록
    findAllParticipating : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select group_id, title, classification, max_member_num, o.created, total_money, div_money, count(user_id) current_count from usergroup left join ottGroup as o on usergroup.group_id = o.id group by group_id having group_id in (select group_id from usergroup where user_id = ?);',
            [req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    //그룹 만들기
    save : (req) => {
        return new Promise((resolve, reject) => {
            //그룹 생성
            db.query('insert into ottGroup(title,classification,max_member_num) values(?,?,?)',
            [req.body.title, req.body.classification, req.body.max_member_num],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result.insertId);
            })
        })
    },

    saveUserRelationOfAdmin : (req, groupId) =>{
        return new Promise((resolve, reject) => {
            db.query('insert into userGroup(group_id,user_id,authority,remittance) values(?,?,?,?)',
            [groupId, req.user.id, 'ADMIN',1],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findById : (groupId) => {
        return new Promise((resolve, reject) => {
            db.query('select * from ottGroup where id = ?',
            [groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findByIdAndUserId : (req, groupId) => {
        return new Promise((resolve, reject) => {
            db.query('select * from userGroup where group_id = ? and user_id = ?', 
            [groupId, req.user.id],
            (err,result) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            })
        })
    },

    findMaxMemberNumById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select max_member_num from ottGroup where id = ?',
            [req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error)
                    reject(error);
                }
                resolve(result[0].max_member_num);
            })
        })
    },

    findMemberCountById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select count(*) as count from usergroup where group_id = ?',
            [req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result[0].count);
            })
        })
    },

    saveUserRelationOfGeneralUser : (req) => {
        return new Promise((resolve, reject) => {
            db.query('insert into userGroup(group_id,user_id,authority) values(?,?,?)',
            [req.params.groupId, req.user.id, 'USER'],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result)
            })
        })
    },

    findMembersById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select distinct userGroup.user_id, nickname, authority, remittance from users join userGroup on users.id = userGroup.user_id where users.id in (select user_id from userGroup where group_id = ?) and group_id = ?',
            [req.params.groupId, req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findMasterById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select users.id as user_id, nickname, authority from usergroup join users on usergroup.user_id = users.id where group_id = ? and authority = ?',
            [req.params.groupId, 'ADMIN'],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findCommentById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select comment.id as id, commenter, group_id, contents, comment.created created, nickname from comment join users on comment.commenter = users.id where group_id = ?',
            [req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findByIdNotRemittance : (groupId) => {
        return new Promise((resolve, reject) => {
        db.query('select id, title, classification, notice, account, term, start_date, end_date, max_member_num, created, total_money, div_money from ottGroup where id = ?',
            [groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findAdminByGroupIdAndAuthority : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select user_id as admin from userGroup where group_id = ? and authority = ?',
            [req.body.groupId, 'ADMIN'],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result)
            })
        })
    },

    updateRemittanceById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('update userGroup set remittance = 1 where group_id = ? and user_id = ?',
            [req.body.groupId, req.body.user_id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    updateAll : (req, divMoney) => {
        return new Promise((resolve, reject) => {
            db.query('update ottGroup set title = ?, notice = ?, account = ?, ott_id = ?, ott_pwd = ?, term = ?, start_date = ?, end_date = ?, total_money = ?, div_money = ? where id = ?',
            [req.body.title, req.body.notice, req.body.account, req.body.ott_id, req.body.ott_pwd, req.body.term, req.body.start_date, req.body.end_date, req.body.money, divMoney ,req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    deleteById : (req) => {
        return new Promise((resolve, reject) => {
            query('delete from ottGroup where id = ?',
            [req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    deleteUserGroupById : (req) => {
        return new Promise((resolve, reject) => {
            query('delete from userGroup where group_id = ? and user_id = ?',
            [req.params.groupId, req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result)
            })
        })
    }


}

const remittanceCheck = {
    findByGroupIdAndUserId : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select * from remittanceCheck where group_id = ? and req_user_id = ?',
            [req.body.groupId, req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    save : (req, admin) => {
        return new Promise((resolve, reject) => {
            db.query('insert into remittanceCheck(group_id, req_user_id, master_id) values(?,?,?)',
            [req.body.groupId, req.user.id, admin],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findListOfUsersByGroupId : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select remittanceCheck.id as remittanceCheck_id, users.id as user_id, nickname, group_id from remittanceCheck join users on req_user_id = users.id where group_id = ?',
            [req.params.groupId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    deleteById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('delete from remittanceCheck where id = ?',
            [req.body.remittance_id],
            (error, result) => { 
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    deleteByGroupIdAndUserId : (req) => {
        return new Promise((resolve, reject) => {
            db.query('delete from remittanceCheck where group_id = ? and req_user_id = ?',
            [req.params.groupId, req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    }
}

const comment = {
    save : (req) => {
        return new Promise((resolve, reject) => {
            db.query('insert into comment(commenter, group_id, contents) values(?,?,?)',
            [req.user.id, req.params.groupId, req.body.contents],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findAllById : (id) => {
        return new Promise((resolve, reject) => {
            db.query('select * from comment where id = ?',
            [id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result.insertId);
            })
        })
    },

    findByIdAndCommenter : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select * from comment where id = ? and commenter = ?',
            [req.params.commentId, req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    deleteById : (req) => {
        return new Promise((resolve, reject) => {
            db.query('delete from comment where id = ?',
            [req.params.commentId],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    }
}

module.exports = {ottGroup, remittanceCheck, comment};