/**
 *  Router for My Events / My Events History operations
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

// Handle moving to My Events page
router.get('/', function(req, res, next) {
    let sess = req.session;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.getMyEvents(sess.email, function(err, events) {
                    res.render('myevents', {
                        title: 'CloudTicket',
                        stage: config.stageInWebURL,
                        tableData: '{"data":' + events + '}',
                        eventCreated: req.query.eventCreated
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

// Handle moving to My Events History page
router.get('/history', function(req, res, next) {
    let sess = req.session;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.getMyEventsHistory(sess.email, function(err, events) {
                    res.render('myeventshistory', {
                        title: 'CloudTicket',
                        stage: config.stageInWebURL,
                        tableData: '{"data":' + events + '}',
                        eventCreated: req.query.eventCreated
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

// Handle request for specific Archived Event details (returns a CSV file to download)
router.get('/history/:eventid', function(req, res, next) {
    let sess = req.session;
    let id = req.params.eventid;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.getArchivedEventById(id, function(err, event) {
                    if (err) {
                        res.send("Error occurred while trying to get the archived file.");
                    } else {
                        res.set({"Content-Disposition":"attachment; filename=\"tickets.csv\""});
                        res.send(JSON.parse(event).data);
                    }
                });
            } else {
                sess.email = undefined;
                res.redirect(stageInWebURL + '/');
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

// Handle request for specific Event details
router.get('/:eventid', function(req, res, next) {
    let sess = req.session;
    let id = req.params.eventid;

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.getEventById(id, function(err, event) {
                    res.render('event', {
                        title: 'CloudTicket',
                        stage: config.stageInWebURL,
                        tableData: JSON.stringify(event),
                        id: event.id,
                        myevent: 'true'
                    });
                });
            } else {
                sess.email = undefined;
                res.redirect(stageInWebURL + '/');
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

// Handle request for Ticket valdation
router.post('/:eventid/validateticket', function(req, res, next) {
    let sess = req.session;

    console.log(req.body.event_id)
    console.log(req.body.ticket_id)

    let ticket_params = {
        event_id: req.body.event_id,
        ticket_id: req.body.ticket_id
    };

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.validateTicket(ticket_params, function(err, ticket) {
                    if (ticket) {
                        res.send(JSON.stringify(ticket))
                    } else {
                        res.send('{}')
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

// Handle request for marking Ticket as used
router.post('/:eventid/markticket', function(req, res, next) {
    let sess = req.session;

    console.log(req.body.event_id)
    console.log(req.body.ticket_id)

    let ticket_params = {
        event_id: req.body.event_id,
        ticket_id: req.body.ticket_id
    };

    if (sess.email) {
        sessionValidator.validate(sess.email, sess.sessiontoken, function (success) {
            if (success) {
                ApiCaller.markTicketUsed(ticket_params, function(err, mark) {
                    if (mark == true) {
                        res.send(mark)
                    } else {
                        res.send(false)
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