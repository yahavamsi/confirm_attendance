/**
 *  Router for Main Index Page
 *  Receives: Nothing (except some view flags)
 *  Returns: Home page
 */

const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const config = require('../config');
const sessionValidator = require('../tools/session-validator');
const ApiCaller = require('../tools/data-api');

router.use(expressSession({secret:'somesecrettokenhere',
                           saveUninitialized: true,
                           resave: true}));


router.get('/', function(req, res, next) {
  let sess = req.session;

  if (sess.email) {
      sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
          if (success) {
              ApiCaller.getTodayEvents(function(err, events) {
                  res.render('home', {
                      title: 'CloudTicket',
                      stage: config.stageInWebURL,
                      tableData: '{"data":' + events + '}'
                  });
              });
          } else {
              sess.email = undefined;
              res.redirect(config.stageInWebURL + '/');
          }
      });

  } else {
      let loginFailedInQuery = req.query.loginFailed;
      let logoutSuccessfulInQuery = req.query.logoutSuccessful;
      res.render('login', { title: 'Express',
                            stage: config.stageInWebURL,
                            loginFailed: loginFailedInQuery,
                            logoutSuccessful: logoutSuccessfulInQuery});
  }

});

module.exports = router;
