/**
 *  Router for Main Index Page
 *  Receives: Nothing (except some view flags)
 *  Returns: Home page
 */

const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const config = require('../config');
const MongoClient = require('mongodb').MongoClient;

const mongo_url = process.env.MONGO_URL;

const CLOSING_DATE = Date.parse("June 8 2018 01:00");

router.use(expressSession({secret:'somesecrettokenhere',
                           saveUninitialized: true,
                           resave: true}));


router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    MongoClient.connect(mongo_url, function(err, client) {
        if (err) {
            console.log("Error on mongo connection: " + err.message)
        } else {
            console.log("Connected correctly to server");

            const db = client.db('guests');

            db.collection('guests').findOne({"id": id}, function (err, guest_doc) {
                if (err) {
                    console.log("Error getting ID " + id + " message:" + err.message)
                } else {
                    if (guest_doc) {
                        // Found ID - OK!
                        console.log(guest_doc);
                        if (Date.now() < CLOSING_DATE) {
                            res.render('index', {'id': id, 'message': guest_doc.message});
                        } else {
                            res.render('index_time_passed', {'id': id, 'message': guest_doc.message});
                        }

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
    const id = req.body.id;
    const message = req.body.guest_message;
    const set_details = {
        "adults": req.body.adults,
        "children": req.body.children,
        "veg": req.body.veg
    };

    MongoClient.connect(mongo_url, function(err, client) {
        if (err) {
            console.log("Error on mongo connection: " + err.message);
            res.render('invalid_id'); //TODO: replace with error page
        } else {
            console.log("Connected correctly to server");

            const db = client.db('guests');

            // Insert a single document
            db.collection('guests').updateOne({"id": id}, {"$set": set_details}, function (err, guest_doc) {
                if (err) {
                    console.log("Error getting ID " + id + " message:" + err.message)
                } else {
                    if (guest_doc) {
                        // Found ID - OK!
                        console.log(guest_doc);
                        res.render('success',
                            {
                                message: message,
                                adults: set_details.adults,
                                children: set_details.children,
                                veg: set_details.veg
                            });
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

module.exports = router;
