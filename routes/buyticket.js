/**
 *  Router for Buy Ticket operation
 *  Receives: event id in URI
 *  Returns: a success indicating page (with ticket ID)
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

// Handle ticket purchase request
router.get('/:event_id', function(req, res, next) {
    let sess = req.session;
    let event_id = req.params.event_id;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.buyTicket(sess.email, event_id, function(err, response) {
                    if (err) {
                        res.redirect(config.stageInWebURL + '/events/' + event_id + '?purchaseSuccessful=false');
                    } else {
                        if (response.ticket_id) {
                            ApiCaller.getEventById(event_id, function(err, event) {
                                res.render('event', {
                                    title: 'CloudTicket',
                                    stage: config.stageInWebURL,
                                    tableData: JSON.stringify(event),
                                    eventCreated: req.query.eventCreated,
                                    purchaseSuccessful: 'true',
                                    id: event.id,
                                    ticket_id: response.ticket_id
                                });
                            });

                        } else {
                            res.redirect(config.stageInWebURL + '/events/' + event_id + '?purchaseSuccessful=false&failureReason=' + response.errorMessage);
                        }
                    }
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