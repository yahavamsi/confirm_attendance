/**
 *  Object in charge of validation users sessions
 */

const config = require('../config');
const ApiCaller = require('../tools/data-api');

const sessionValidator = {};

sessionValidator.validate = function(email, sessiontoken, callback) {

    ApiCaller.valideSession(email, sessiontoken, function (err, isValid) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(false);
        } else {
            callback(isValid);
        }
    });
};

module.exports = sessionValidator;