const db = require('../lib/db');

const boxOffice = {
    orderByRank : () => {
        return new Promise((resolve, reject) => {
            db.query('select * from boxoffice order by movierank',
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    save : (movie) => {
        return new Promise((resolve, reject) => {
            let now = new Date();
            db.query('insert into boxoffice(movierank,name,movieCd,image,created) values(?,?,?,?,?)',
            [movie.rank*=1, movie.name, movie.movieCd, movie.image, now],
            (error, result) => {
                if(error) {
                    console.error(error);
                    reject(error);
                }
                resolve(result);
            })
        })
    },

    delete : () => {
        return new Promise((resolve, reject) => {
            let now = new Date();
            db.query('delete from boxoffice',
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

module.exports = {boxOffice};