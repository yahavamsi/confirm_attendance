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
                        res.render('index', {'id': id, 'name': guest_doc.name});
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
    const guest_count = req.body.guests;

    MongoClient.connect(mongo_url, function(err, client) {
        if (err) {
            console.log("Error on mongo connection: " + err.message);
            res.render('invalid_id'); //TODO: replace with error page
        } else {
            console.log("Connected correctly to server");

            const db = client.db('guests');

            // Insert a single document
            db.collection('guests').updateOne({"id": id}, {"$set": {"count": guest_count}}, function (err, guest_doc) {
                if (err) {
                    console.log("Error getting ID " + id + " message:" + err.message)
                } else {
                    if (guest_doc) {
                        // Found ID - OK!
                        console.log(guest_doc);
                        res.render('success');
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
