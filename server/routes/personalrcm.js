const express = require('express');
const router = express.Router();
const db = require('../lib/db');

router.post('/', async(req, res, next) => {
    let movieList = new Array();
    movieList = req.body.movieList;

    if(movieList.length > 5) {
        return res.status(400).send({code:400, result : "5개 이하로 선택해주세요."});
    }

    await db.query(`DELETE from usermovie where user_id = ?`,
    [req.user.id], (error, result) => {
        if(error) {
            console.error('db error');
            next(error);
        }
    })

    for(let i=0; i<movieList.length; i++) {
        await db.query(`INSERT INTO usermovie(user_id, movieCd) VALUES(?,?)`,
        [req.user.id, movieList[i]],
        (error, result) => {
            if(error) {
                console.error('db error');
                next(error);
            }
        })
    }
    res.status(200).send({code:200, result : "저장되었습니다."})

    
})
module.exports = router;