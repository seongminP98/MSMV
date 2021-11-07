const db = require('../lib/db');

const weeklyMovie = {
    findLimitTen : (req) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM weeklymovie ORDER BY count DESC LIMIT 10',
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

module.exports = {weeklyMovie};