/**
 *  Router for Log User Out operation
 *  Receives: Nothing
 *  Returns: Terminates current session
 */

const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const config = require('../config');

router.use(expressSession({secret:'somesecrettokenhere',
                           saveUninitialized: true,
                           resave: true}));

router.get('/', function(req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect(config.stageInWebURL + '/?logoutSuccessful=true');
        }
    });
});

module.exports = router;
