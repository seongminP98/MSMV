const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const bcrypt = require('bcrypt');
const middleware = require('./middleware');

router.post('/id', middleware.isNotLoggedIn, async(req,res,next)=> {//id중복확인
  await db.query(`SELECT user_id FROM users where user_id=?`, [req.body.id], (error, result) => {
    if (error) {
      next(error);
    }
    if (result.length === 0) {
      res.status(200).send({code: 200, message: '사용 가능한 아이디입니다.'})
    } else {
        res.status(400).send({code: 400, message: '이미 사용 중인 아이디입니다.'});
    }
  });
});

router.post('/nick', middleware.isNotLoggedIn, async function (req, res, next) {//nickname 중복확인
  await db.query(`SELECT user_id FROM users where nickname=?`, [req.body.nickname],(error, result) => {
    if (error) {
      next(error);
    }
    if (result.length === 0) {
        res.status(200).send({code: 200, message: '사용 가능한 닉네임입니다.'})
    } else {
        res.status(400).send({code: 400, message: '이미 사용 중인 닉네임입니다.'});
    }
  });
});

router.post('/', middleware.isNotLoggedIn, async function (req, res, next) {//회원가입
  let user;
  bcrypt.hash(req.body.password, 12, async (err, hash) => {
    await db.query(
      `INSERT INTO users(user_id,password,nickname) 
              VALUES(?,?,?);`,
      [req.body.id, hash, req.body.nickname],
      async (error, result) => {
        if (error) {
          next(error);
        }
        await db.query(`SELECT id from users where user_id=?;`,[req.body.id],async (error2,result2) => {
          if(error2){
            next(error2);
          }
        })
      }
    );
  });


  db.query(`SELECT * FROM users WHERE user_id=?`, [req.body.id],async (error, result) => {  //회원가입 성공 시 바로 로그인.
    if (error) {
      next(error);
    }
    let user = result[0];

    req.login(user, function (err) {
      return res.status(200).send({ code: 200, result: user });
    });
  });
});

module.exports = router;
