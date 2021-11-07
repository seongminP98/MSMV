const passport = require('passport');
const local = require('./localStrategy');
const userModel = require('../model/userModel');

module.exports = () =>{
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
    passport.deserializeUser(async(id, done) => {
      let user = await userModel.user.findById(id);
      done(null, user[0]);
    });
    
    local();
}