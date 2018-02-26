/**
 *  Router for Login User operation
 *  Receives: user and password
 *  Returns: on success - Home page / on failure - login page with failure alert
 */

const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const config = require('../config');
const ApiCaller = require('../tools/data-api');

router.use(expressSession({secret:'somesecrettokenhere',
                            saveUninitialized: true,
                            resave: true}));

router.post('/', function(req, res, next) {

    let email = req.body.user;
    let password = req.body.password;
    let sess = req.session;

    ApiCaller.loginUser(email, password, function (err, response) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.redirect(config.stageInWebURL + '/?loginFailed=true');
        } else {
            if(response.sessiontoken) {
                sess.sessiontoken = response.sessiontoken;
                sess.email = email;
                res.redirect(config.stageInWebURL + '/');
            } else {
                res.redirect(config.stageInWebURL + '/?loginFailed=true');
            }
        }
    });
});

module.exports = router;
