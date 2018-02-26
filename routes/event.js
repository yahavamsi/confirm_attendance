/**
 *  Router for Event operation
 *  Receives: event id in URI
 *  Returns: a page with the event's details
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


router.get('/:eventid', function(req, res, next) {
    let sess = req.session;
    let id = req.params.eventid;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.getEventById(id, function(err, event) {
                    let purchaseSuccessful = req.query.purchaseSuccessful;
                    let failureReason = req.query.failureReason;
                    res.render('event', {
                        title: 'CloudTicket',
                        stage: config.stageInWebURL,
                        tableData: JSON.stringify(event),
                        id: event.id,
                        purchaseSuccessful: purchaseSuccessful,
                        failureReason: failureReason
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
