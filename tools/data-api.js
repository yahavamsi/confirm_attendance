/**
 *  Object in charge of API calls to Logic/Data (API) Server
 */

const request = require('request');
const config = require('../config');
const ApiCaller = {};

const API_KEY = "Ldd4PJkaxI48qqbG56PKd4DkOg3itKHQ33dMYQWy";

// General GET request provider
function getRequest(uri, callback){
    let params = {
        url: config.dataApiURL + config.stageInApiURL + uri,
        headers: {
            'x-api-key': API_KEY
        }
    };

    request(params, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(null, JSON.parse(body));
        } else {
            console.log("error requesting api");
            callback(error, null);
        }
    });
}

// General POST request provider
function postRequest(uri, req_body, callback){
    let params = {
        url: config.dataApiURL + config.stageInApiURL + uri,
        headers: {
            'x-api-key': API_KEY
        },
        body: JSON.stringify(req_body)
    };

    request.post(params, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(null, JSON.parse(body));
        } else {
            console.log("error requesting api");
            callback(error, null);
        }
    });
}


// API caller object methods

// Get all event in DB (not in current use)
ApiCaller.getEvents = function(callback) {
    getRequest('/events', callback);
};

// Get all of today's event (used in the Home Page view)
ApiCaller.getTodayEvents = function(callback) {
    getRequest('/todayevents', callback);
};

// Get specific event's details
ApiCaller.getEventById = function(id, callback) {
    getRequest('/events/' + id, callback);
};

// Get specific archived event's CSV file
ApiCaller.getArchivedEventById = function(id, callback) {
    postRequest('/myevents/history/' + id, {}, callback);
};

// Sign up new user
ApiCaller.signupUser = function(email, password, callback) {
    let req_body = {
        "email": email,
        "password": password
    };
    postRequest('/signup', req_body, callback);
};

// Login user
ApiCaller.loginUser = function(email, password, callback) {
    let req_body = {"email": email,
                "password": password};
    postRequest('/login', req_body, callback);
};

// Validate user's session
ApiCaller.valideSession = function(email, sessiontoken, callback) {
    let req_body = {"email": email,
                "sessiontoken": sessiontoken};
    postRequest('/validate', req_body, callback);
};

// Get specific user's events list
ApiCaller.getMyEvents = function(email, callback) {
    let req_body = {"email": email};
    postRequest('/myevents', req_body, callback);
};

// Get specific user's archived events list
ApiCaller.getMyEventsHistory = function(email, callback) {
    let req_body = {"email": email};
    postRequest('/myevents/history', req_body, callback);
};

// Create new event for user
ApiCaller.createEvent = function(event_params, callback) {
    let req_body = event_params;
    postRequest('/createevent', req_body, callback);
};

// Buy ticket to specific event
ApiCaller.buyTicket = function(email, event_id, callback) {
    let req_body = {"email": email};
    postRequest('/buyticket/' + event_id, req_body, callback);
};

// Get a list of the user's purchased tickets
ApiCaller.getMyTickets = function(email, callback) {
    let req_body = {"user": email};
    postRequest('/mytickets', req_body, callback);
};

// Validate a ticket to event
ApiCaller.validateTicket = function(ticket_params, callback) {
    let req_body = ticket_params;
    postRequest('/validateticket', req_body, callback);
};

// Mark a ticket as used
ApiCaller.markTicketUsed = function(ticket_params, callback) {
    let req_body = ticket_params;
    postRequest('/markticket', req_body, callback);
};

// Search for events with specific parameters
ApiCaller.searchEvents = function(title, location, human_date, callback) {
    let req_body = {
        "title": title,
        "location": location,
        "human_date": human_date
    };
    postRequest('/searchevents', req_body, callback);
};

module.exports = ApiCaller;