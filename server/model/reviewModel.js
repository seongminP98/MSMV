const db = require('../lib/db');

const review = {
    save : (req) => {
        return new Promise((resolve, reject) => {
            db.query('insert into review(contents, commenter, rate, movieCd, movieTitle) values (?, ?, ?, ?, ?)',
            [req.body.contents, req.user.id, req.body.rate, req.body.movieCd, req.body.movieTitle],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findByMovieCd : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select * from review where movieCd = ?',
            [req.body.movieCd],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    findById : (id) => {
        return new Promise((resolve, reject) => {
            db.query('select * FROM review where id=?',
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

    update : (req) => {
        return new Promise((resolve, reject) => {
            db.query('update review set comments = ?, updated = ? WHERE id = ?',
            [req.body.contents, now(), req.body.id],
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
            db.query('delete from review where id = ?',
            [req.params.id],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    getMyReview : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select review.id as review_id, contents, created, updated, commenter, rate, movieCd, movieTitle from review left join users on user_id = review.commenter where review.commenter = ?',
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

    getPostReview : (req) => {
        return new Promise((resolve, reject) => {
            db.query('select review.id,contents, created, updated, rate, nickname, commenter from review left join users on review.commenter = users.id WHERE movieCd = ?',
            [req.params.movieCd],
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

module.exports = {review};