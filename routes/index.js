/**
 *  Router for Main Index Page
 *  Receives: Nothing (except some view flags)
 *  Returns: Home page
 */

const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const config = require('../config');

router.use(expressSession({secret:'somesecrettokenhere',
                           saveUninitialized: true,
                           resave: true}));


router.get('/:id', function(req, res, next) {
    id = req.params.id;
    // TODO: put here the code for verifying mongo id (legal guest)
    const MongoClient = require('mongodb').MongoClient;
    const url = process.env.MONGO_URL;

    // Database Name
    //const dbName = 'myproject';

    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, client) {
        if (err) {
            console.log("Error on mongo connection: " + err.message)
        } else {
            console.log("Connected correctly to server");

            const db = client.db('guests');

            // Insert a single document
            db.collection('guests').findOne({"id": id}, function (err, guest_doc) {
                if (err) {
                    console.log("Error getting ID " + id + " message:" + err.message)
                } else {
                    if (guest_doc) {
                        // Found ID - OK!
                        console.log(guest_doc)
                        res.render('index', {'id': id});
                    } else {
                        // ID not found - put a not found page
                        res.render('invalid_id');
                    }
                }

                client.close();
            });
        }
    });


});

router.post('/', function(req, res, next) {
    id = req.body.id;
    // TODO: put here the code for updating mongo with guest data
    res.render('index');
});



/*router.get('/', function(req, res, next) {
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

});*/

module.exports = router;
