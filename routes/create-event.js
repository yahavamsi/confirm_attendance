/**
 *  Router for Create Event operations:
 *  1. GET for moving to Create Event page
 *  2. POST for creating new event
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

// Handle moving to Create Event page
router.get('/', function(req, res, next) {
    let sess = req.session;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                res.render('create_event', {
                    title: 'CloudTicket',
                    stage: config.stageInWebURL
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

// Handle new event creation request
router.post('/', function(req, res, next) {
    let sess = req.session;

    let event_params = {
        email: sess.email,
        title: req.body.title,
        location: req.body.location,
        human_date:  req.body.human_date,
        human_time: req.body.human_time,
        tickets: req.body.tickets
    };

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.createEvent(event_params, function(err, event) {
                    let eventCreated = true;
                    if (err || event.event_id === undefined) {
                        eventCreated = false;
                    }

                    res.redirect(config.stageInWebURL + '/myevents?eventCreated=' + eventCreated);
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