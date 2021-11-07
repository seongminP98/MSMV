const db = require('../lib/db');

const movieCount = {
    findByMovieCd : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select * from moviecount WHERE movieCd = ?',
            [req.params.movieCd],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    save : (req) => {
        return new Promise((resolve, reject) => {
            db.query('insert into moviecount(movieCd, count) values (?, ?)',
            [req.params.movieCd, 1],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    update : (req, count) => {
        return new Promise((resolve, reject) => {
            db.query('update moviecount SET count = ? where movieCd = ?',
            [req.params.movieCd, count],
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

module.exports = {movieCount};