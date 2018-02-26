/**
 *  Router for Sign Up operation
 */

const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const config = require('../config');
const ApiCaller = require('../tools/data-api');

router.use(expressSession({secret:'somesecrettokenhere',
                            saveUninitialized: true,
                            resave: true}));

// Handle moving to Sign Up page
router.get('/', function(req, res, next) {
    res.render('signup', {
        title: 'CloudTicket',
        stage: config.stageInWebURL
    });
});

// Handle request for signing up new user (with username and password)
router.post('/', function(req, res, next) {

    let email = req.body.user;
    let password = req.body.password;

    ApiCaller.signupUser(email, password, function (err, response) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.render('signup', {
                title: 'CloudTickets',
                stage: config.stageInWebURL,
                signupFailed: true});
        } else {
            if (response === "OK") {
                res.render('login', {
                    title: 'CloudTickets',
                    stage: config.stageInWebURL,
                    signupSuccess: true});
            } else if (response.errorMessage === "User already exists!") {
                res.render('signup', {
                    title: 'CloudTickets',
                    stage: config.stageInWebURL,
                    userAlreadyExists: true});
            } else {
                res.render('signup', {
                    title: 'CloudTickets',
                    stage: config.stageInWebURL,
                    signupFailed: true});
            }
        }
    });
});

module.exports = router;
