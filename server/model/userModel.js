const db = require('../lib/db');

const user = {
    findById : (id) => {
        return new Promise((resolve, reject) => {
            db.query('select * from users where id=?',
            [id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findByUserId : (user_id) => {
        return new Promise((resolve, reject) => {
            db.query('select * from users where user_id=?',
            [user_id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findByNickname : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select * from users where nickname=?', 
            [req.body.nickname],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    save : (req, password) => {
        return new Promise((resolve, reject) => {
            db.query('insert into users(user_id,password,nickname) values(?,?,?)', 
            [req.body.id, password, req.body.nickname],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    loginInfo : (id) => {
        return new Promise((resolve, reject) => {
            db.query('select id, user_id, nickname from users where id=?', 
            [id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    updateNickname : (req) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET nickname = ? where id = ?', 
            [req.body.nickname, req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    updatePassword : (req, password) => {
        return new Promise((resolve, reject) => {
            db.query('update users set password = ? where id = ?', 
            [password, req.user.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    delete : (req) => {
        return new Promise((resolve, reject) => {
            db.query('delete from users WHERE id = ?', 
            [req.user.id],
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

module.exports = {user};