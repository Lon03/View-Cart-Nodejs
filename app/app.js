/****************************************************
 *                   Module
 ***************************************************/
const express = require('express');
const join = require('path').join;
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

/****************************************************
 *                  middleware
 ****************************************************/
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const validator = require('express-validator');

/****************************************************
 *                  additional
 ****************************************************/
const app = express();
require('./helper/passport');

/****************************************************
 *                  routes
 ****************************************************/
const routes = require('./routes/users/route');

/****************************************************
 *                  Connect to DB
 ****************************************************/
const dbConfig = require('./database/db.json');
mongoose.connect(dbConfig.url);
mongoose.connection.once('connected', function () {
    console.log("Connected to database " + dbConfig.url)
});


// view engine setup
app.set('views', join(__dirname, '../views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'ssssdsd'
    , resave: false
    , saveUninitialized: false
    , store: new MongoStore({mongooseConnection: mongoose.connection})
    , cookie: {maxAge: 60 * 60 * 24 * 7}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(join(__dirname, '../public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
})
app.use('/', routes);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/****************************************************
 *                 error handlers
 ****************************************************/

/**
 * development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * production error handler
 * no stacktraces leaked to user
 */
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
