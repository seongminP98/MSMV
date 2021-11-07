const db = require('../lib/db');

const usreMovie = {
    deleteByUserId : (req) => {
        return new Promise((resolve, reject) => {
            db.query('delete from usermovie where user_id = ?',
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

    save : (req, movie) => {
        return new Promise((resolve, reject) => {
            db.query('insert into usermovie(user_id, movieCd) values(?,?)',
            [req.user.id, movie],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findByUserId : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select * from usermovie where user_id = ?',
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

module.exports = {usreMovie};