const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const middleware = require('./middleware');

router.get('/', async(req, res, next) => { //그룹 목록
    await db.query('select group_id, title, classification, max_member_num, o.created, total_money, div_money, count(user_id) current_count from usergroup left join ottGroup as o on usergroup.group_id = o.id group by group_id',
    (error, result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        
        res.status(200).send({code:200, result : result})
    })
})

router.get('/search/:class', async(req, res, next) => { //그룹 클래스로 검색 (어떤 ott서비스인지) 
    await db.query('select group_id, title, classification, max_member_num, o.created, total_money, div_money, count(user_id) current_count from usergroup left join ottGroup as o on usergroup.group_id = o.id group by group_id having classification = ?',
    [req.params.class],
    (error, result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        
        res.status(200).send({code:200, result : result})
    })
})

router.get('/mine', middleware.isLoggedIn, async(req, res, next) => { //내가 참여 중인 그룹 목록.
    await db.query('select group_id, title, classification, max_member_num, o.created, total_money, div_money, count(user_id) current_count from usergroup left join ottGroup as o on usergroup.group_id = o.id group by group_id having group_id in (select group_id from usergroup where user_id = ?);',
    [req.user.id],
    (error, result) => {
        if(error) {
            console.error('db error');
            next(error);
        }
        res.status(200).send({code:200, result : result})
    })

})

router.post('/make', middleware.isLoggedIn, async(req, res, next) => { //그룹 만들기
    await db.query('insert into ottGroup(title,classification,max_member_num) values(?,?,?)',
    [req.body.title, req.body.classification, req.body.max_member_num],
    async(error, result) => {
        if(error) {
            console.error('sql1 error');
            next(error);
        }
        
        await db.query('select id from ottGroup where id=?',
        [result.insertId],
        async(error2, result2) => {
            if(error2) {
                console.error('sql2 error');
                next(error2);
            }

            await db.query('insert into userGroup(group_id,user_id,authority,remittance) values(?,?,?,?)',
            [result2[0].id, req.user.id, 'ADMIN',1],
            async(error3, result3) => {
                if(error3) {
                    console.error('sql3 error');
                    next(error3);
                }

                await db.query('select * from ottGroup where id = ?',
                [result.insertId],
                (error4, result4) => {
                    if(error4) {
                        console.error('sql4 error');
                        next(error4);
                    }
                    res.status(200).send({code:200, result : result4});
                })

            })
        })
        
    })

})

router.get('/participation/:groupId', middleware.isLoggedIn, async(req, res, next) => { //그룹 참여하기
    await db.query('select * from userGroup where group_id = ? and user_id = ?', 
    [req.params.groupId, req.user.id],
    async(error,result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        if(result.length>0){
            res.status(200).send({code:200-1, result : '이미 참여 중 입니다.'});
        }
        else{
            await db.query('select max_member_num from ottGroup where id = ?',
            [req.params.groupId],
            async(error2, result2) => {
                if(error2) {
                    console.error(error2)
                    next(error2);
                }
                await db.query('select count(*) as count from usergroup where group_id = ?',
                [req.params.groupId],
                async(error3, result3) => {
                    if(error3) {
                        console.error(error3);
                        next(error3);
                    }
                    if(result2[0].max_member_num <= result3[0].count) {
                        res.status(200).send({code:200-2, result : '자리가 없어 입장할 수 없습니다.'})
                    } else{
                        await db.query('insert into userGroup(group_id,user_id,authority) values(?,?,?)',
                        [req.params.groupId, req.user.id, 'USER'],
                        async (error4, result4) => {
                            if(error4) {
                                console.error(error4);
                                next(error4);
                            }

                            await db.query('select * from ottGroup where id = ?',
                            [req.params.groupId],
                            (error5, result5) => {
                                if(error5) {
                                    console.error(error5);
                                    next(error5)
                                }
                                res.status(200).send({code:200, result : result5[0]});
                            })
                        })
                    }
                })
            })
        }
    })
})

router.get('/:groupId', middleware.isGroupMember,middleware.isLoggedIn,  async(req, res, next) => { //그룹 디테일
    await db.query('select remittance from userGroup where user_id = ? and group_id = ?',
        [req.user.id ,req.params.groupId],
        async(error2, result2) => {
            if(error2) {
                console.error(error2);
                next(error2);
            }
            if(result2[0].remittance === 1) { //송금 확인 된 유저
                await db.query('select * from ottGroup where id = ?',
                [req.params.groupId],
                async(error3, result3) => {
                    if(error3) {
                        console.error(error3);
                        next(error3);
                    }
                    await db.query('select distinct userGroup.user_id, nickname, authority, remittance from users join userGroup on users.id = userGroup.user_id where users.id in (select user_id from userGroup where group_id = ?) and group_id = ?',
                    [req.params.groupId, req.params.groupId],
                    async(error4, result4) => {
                        if(error4) {
                            console.error(error4);
                            next(error4);
                        }
                        result3[0].members = result4;
                        await db.query('select users.id as user_id, nickname, authority from usergroup join users on usergroup.user_id = users.id where group_id = ? and authority = ?',
                        [req.params.groupId, 'ADMIN'],
                        async(error5, result5) => {
                            if(error5) {
                                console.error(error5);
                                next(error5);
                            }
                            result3[0].ADMIN = result5;
                            await db.query('select comment.id as id, commenter, group_id, contents, comment.created created, nickname from comment join users on comment.commenter = users.id where group_id = ?',
                            [req.params.groupId],
                            (error6, result6) => {
                                if(error6) {
                                    console.error(error6);
                                    next(error6);
                                }
                                result3[0].comments = result6;
                                res.status(200).send({code:200, result : result3[0]});
                            })
                        })
                        
                    })
                })
            } else {
                await db.query('select id, title, classification, notice, account, term, start_date, end_date, max_member_num, created, total_money, div_money from ottGroup where id = ?',
                [req.params.groupId],
                async(error3, result3) => {
                    if(error3) {
                        console.error(error3);
                        next(error3);
                    }
                    await db.query('select distinct userGroup.user_id, nickname, authority, remittance from users join userGroup on users.id = userGroup.user_id where users.id in (select user_id from userGroup where group_id = ?) and group_id = ?',
                    [req.params.groupId, req.params.groupId],
                    async(error4, result4) => {
                        if(error4) {
                            console.error(error4);
                            next(error4);
                        }
                        result3[0].members = result4;
                        await db.query('select users.id as user_id, nickname, authority from usergroup join users on usergroup.user_id = users.id where group_id = ? and authority = ?',
                        [req.params.groupId, 'ADMIN'],
                        async(error5, result5) => {
                            if(error5) {
                                console.error(error5);
                                next(error5);
                            }
                            result3[0].ADMIN = result5;
                            await db.query('select comment.id as id, commenter, group_id, contents, comment.created created, nickname from comment join users on comment.commenter = users.id where group_id = ?',
                            [req.params.groupId],
                            (error6, result6) => {
                                if(error6) {
                                    console.error(error6);
                                    next(error6);
                                }
                                result3[0].comments = result6;
                                res.status(200).send({code:200, result : result3[0]});
                            })
                        })
                    })
                })
            }
        })
})

router.post('/remittance', middleware.isLoggedIn, async(req, res, next) => { //그룹 멤버가 그룹장한테 송금했다는 확인 요청 보내기.
    await db.query('select remittance, authority from userGroup where user_id = ? and group_id =?',
    [req.user.id, req.body.groupId],
    async(error, result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        if(result.length === 0){
            res.status(403).send({code:403, result : '이용할 수 없습니다.'}); //그룹에 속해있지 않음.
        } else if(result[0].authority === 'ADMIN') {
            res.status(403).send({code:403, result : '그룹장은 이용할 수 없습니다.'}); //그룹장이 요청
        } else if(result[0].remittance === 1) {
            res.status(400).send({code:400, result : '이미 송금 확인이 완료된 상태입니다.'}); //이미 송금요청 완료된 사람이 요청.
        } else {
            await db.query('select * from remittanceCheck where group_id = ? and req_user_id = ?',
            [req.body.groupId, req.user.id],
            async(error2, result2) => {
                if(error2) {
                    console.error(error2);
                    next(error2);
                }
                if(result2.length > 0) {
                    res.status(200).send({code:200, result : '이미 확인 요청을 보냈습니다.'});
                }
                else{
                    await db.query('select user_id as master from userGroup where group_id = ? and authority = ?',
                    [req.body.groupId, 'ADMIN'],
                    async(error3, result3) => {
                        if(error3) {
                            console.error(error3);
                            next(error3);
                        }
                        await db.query('insert into remittanceCheck(group_id, req_user_id, master_id) values(?,?,?)',
                        [req.body.groupId, req.user.id, result3[0].master],
                        (error4, result4) => {
                            if(error4) {
                                console.error(error4);
                                next(error4);
                            }
                            res.status(200).send({code:200, result : '송금했다는 요청을 보냈습니다.'});
                        })
                    })
                }
            })
            
        }
    })
})

router.get('/remittance/:groupId',middleware.isLoggedIn, middleware.isAdmin, async(req, res, next) => { //그룹장이 송금완료 했다는 요청 확인.
    await db.query('select remittanceCheck.id as remittanceCheck_id, users.id as user_id, nickname, group_id from remittanceCheck join users on req_user_id = users.id where group_id = ?',
    [req.params.groupId],
    (error2, result2) => {
        if(error2) {
            console.error(error2);
            next(error2);
        }
        res.status(200).send({code:200, result : result2});
    })
})

router.post('/remittance/complete',middleware.isLoggedIn, middleware.isLoggedIn, middleware.isAdmin, async(req, res, next) => { //해당 유저의 송금완료 요청 확인.
    await db.query('update userGroup set remittance = 1 where group_id = ? and user_id = ?',
    [req.body.groupId, req.body.user_id],
    async(error2, result2) => {
        if(error2) {
            console.error(error2);
            next(error2);
        }

        await db.query('delete from remittanceCheck where id = ?',
        [req.body.remittance_id],
        (error3, result3) => { 

            if(error3) {
                console.error(error3);
                next(error3);
            }
            res.status(200).send({code:200, result : '확인되었습니다.'});
        })
    })
})


router.patch('/:groupId',middleware.isLoggedIn, middleware.isAdmin, async(req, res, next) => { //그룹 내용수정(공지 등). 그룹장만 가능.
    if(req.body.title === undefined) {
        return res.status(400).send({code:400, result : '제목을 입력해주세요'})
    }
    await db.query('select max_member_num from ottGroup where id = ?',
    [req.params.groupId],
    async(error2, result2) => {
        if(error2) {
            console.error(error2);
            next(error2);
        }
        let divMoney = Math.ceil(req.body.money/result2[0].max_member_num);
        if(req.body.money === undefined || result2[0].max_member_num === null) {
            console.log('non');
            divMoney = null;
        }
        await db.query('update ottGroup set title = ?, notice = ?, account = ?, ott_id = ?, ott_pwd = ?, term = ?, start_date = ?, end_date = ?, total_money = ?, div_money = ? where id = ?',
        [req.body.title, req.body.notice, req.body.account, req.body.ott_id, req.body.ott_pwd, req.body.term, req.body.start_date, req.body.end_date, req.body.money,divMoney ,req.params.groupId],
        (error3, result3) => {
            if(error3) {
                console.error(error3);
                next(error3);
            }
            res.status(200).send({code:200, result : '수정되었습니다.'})
        })
    })
})

router.delete('/:groupId',middleware.isLoggedIn, async(req, res, next) => { //그룹 나가기. 그룹장은 삭제하기 가능.
    await db.query('select * from userGroup where group_id = ? and user_id = ?',
    [req.params.groupId, req.user.id],
    async(error, result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        if(result.length > 0) {
            if(result[0].authority === 'ADMIN') {
                await db.query('delete from ottGroup where id = ?',
                [req.params.groupId],
                (error3, result3) => {
                    if(error3) {
                        console.error(error3);
                        next(error3);
                    }
                    res.status(200).send({code:200, result : '그룹에서 나갔습니다.'})
                })
            } else {
                await db.query('delete from userGroup where group_id = ? and user_id = ?',
                [req.params.groupId, req.user.id],
                async(error2, result2) => {
                    if(error2) {
                        console.error(error2);
                        next(error2);
                    }
                    await db.query('delete from remittanceCheck where group_id = ? and req_user_id = ?',
                    [req.params.groupId, req.user.id],
                    (error3, result3) => {
                        if(error3) {
                            console.error(error3);
                            next(error3);
                        }
                        res.status(200).send({code:200, result : '그룹에서 나갔습니다.'})
                    })
                })
            }
        } else {
            res.status(403).send({code:403, result : '잘못된 접근. 그룹이 없거나 그룹에 속해있지 않습니다.'})
        }
    })
})

router.post('/comment/:groupId',middleware.isLoggedIn, async (req, res, next) => {
    await db.query('select * from userGroup where group_id = ? and user_id = ?',
    [req.params.groupId, req.user.id],
    async(error, result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        if(result.length > 0) {
            await db.query('insert into comment(commenter, group_id, contents) values(?,?,?)',
            [req.user.id, req.params.groupId, req.body.contents],
            async(error2, result2) => {
                if(error2) {
                    console.error(error2);
                    next(error2);
                }
                await db.query('select * from comment where id = ?',
                [result2.insertId],
                (error3, result3) => {
                    if(error3) {
                        console.error(error3);
                        next(error3);
                    }
                    res.status(200).send({code:200, result : result3})
                })
            })
        } else {
            res.status(403).send({code:403, result : '잘못된 접근. 그룹이 없거나 그룹에 속해있지 않습니다.'})
        }
    })
})

router.delete('/comment/:commentId',middleware.isLoggedIn, async(req, res, next) => {
    await db.query('select * from comment where id = ? and commenter = ?',
    [req.params.commentId, req.user.id],
    async(error, result) => {
        if(error) {
            console.error(error);
            next(error);
        }
        if(result.length > 0) {
            await db.query('delete from comment where id = ?',
            [req.params.commentId],
            async(error2, result2) => {
                if(error2) {
                    console.error(error2);
                    next(error2);
                }
                res.status(200).send({code:200, result : '삭제되었습니다.'})
            })
        } else {
            res.status(403).send({code:403, result : '내가 작성한 댓글이 아닙니다.'})
        }
    })
})



module.exports = router;