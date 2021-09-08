const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require('./middleware');

router.post('/login', middleware.isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        return res.status(400).send({ code: 400, error: info.message });
      });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).send({ code: 200, result: user });
      });
    });
  })(req, res, next);
});

router.get('/login', middleware.isLoggedIn, function (req, res, next) {
  if (req.user) {
    res.status(200).send({ code: 200, data: req.user });
  } else {
    res.status(400).send({ code: 400, error: 'not login' });
  }
});

router.get('/logout', middleware.isLoggedIn, function (req, res, next) {
  req.logout();
  req.session.save(function () {
    res.status(200).send({ code: 200 });
  });
});

module.exports = router;