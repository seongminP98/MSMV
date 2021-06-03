const db = require('../lib/db');
const passport = require('passport');
const local = require('./localStrategy');

module.exports = () =>{
    passport.serializeUser(function (user, done) {
      console.log('sericalizeUser',user);
        done(null, user.id);
      });
    
      passport.deserializeUser(function (id, done) {
        console.log('deserializeUser',id);
        db.query('SELECT id, user_id, nickname FROM users WHERE id=?', [id], function (err, result) {
          if (err) {
            throw err;
          }
          done(null, result[0]);
        });
      });
    
      local();
}