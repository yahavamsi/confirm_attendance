/**
 *  Router for Search Event operations
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


// Handle moving to Search Event page
router.get('/', function(req, res, next) {
    let sess = req.session;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                    res.render('searchevents', {
                        title: 'CloudTicket',
                        stage: config.stageInWebURL,
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

// Handle request for search with some parameters (title, location and/or date)
router.get('/events', function(req, res, next) {
    let sess = req.session;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                let title = req.query.title;
                let location = req.query.location;
                let human_date = req.query.human_date;

                ApiCaller.searchEvents(title, location, human_date , function(err, events) {
                    let errMessage = undefined;
                    if (err || events.errorMessage) {
                        errMessage = (events.errorMessage) ? events.errorMessage : "Error";
                    }
                    res.render('searchevents', {
                        title: 'CloudTicket',
                        errorMessage: errMessage,
                        tableData: (errMessage) ? '' : '{"data":' + events + '}',
                        stage: config.stageInWebURL,
                        events: true
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