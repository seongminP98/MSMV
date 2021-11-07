const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async(username, password, done) => {
        try{
          let result = await userModel.user.findByUserId(username);
          if (result[0]) {
            bcrypt.compare(password, result[0].password, function (err, check) {
              if (check) {
                return done(null, result[0]);
              } else {
                return done(null, false, { message: '비밀번호가 올바르지 않습니다.' });
              }
            });
          } else {
            return done(null, false, { message: '아이디가 올바르지 않습니다.' });
          }
        } catch (err){
          return done(err);
        }
      }
    )
  );
};