const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

// Routers
const index = require('./routes/index');
const signup = require('./routes/signup');
const login = require('./routes/login');
const logout = require('./routes/logout');
const event = require('./routes/event');
const myevents = require('./routes/myevents');
const createEvent = require('./routes/create-event');
const buyTicket = require('./routes/buyticket');
const myTickets = require('./routes/mytickets');
const searchEvents = require('./routes/searchevents');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere',
                        saveUninitialized: true,
                        resave: true}));

// routes
app.use('/', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/events', event);
app.use('/myevents', myevents);
app.use('/createevent', createEvent);
app.use('/buyticket', buyTicket);
app.use('/mytickets', myTickets);
app.use('/searchEvents', searchEvents);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
