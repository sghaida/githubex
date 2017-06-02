var express           = require('express'),
    expressSession    = require('express-session'),
    path              = require('path'),
    favicon           = require('serve-favicon'),
    logger            = require('morgan'),
    mongo             = require('mongoose'),
    passport          = require('passport'),
    localStrategy     = require('passport-local'),
    passportMongo     = require('passport-local-mongoose'),
    cookieParser      = require('cookie-parser'),
    bodyParser        = require('body-parser'),
    flash             = require('connect-flash'),
    config            = require('./config'),
    User              = require('./models/user'),
    dbSeed            = require('./helpers/dbseed');

var index   = require('./routes/index'),
    auth    = require('./routes/auth');

var app = express();

mongo.connect(process.env.databaseURL || config.getDbUri());

/*When successfully connected*/
mongo.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + config.getDbUri());
});

/*If the connection throws an error*/
mongo.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

/*When the connection is disconnected*/
mongo.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

/*If the Node process ends, close the Mongoose connection*/
process.on('SIGINT', function() {
    mongo.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

/* create user */
dbSeed();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* define session */
app.use(expressSession({
    secret: config.getSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10800000, httpOnly: true} // 3h
}));

/* initialize passport */
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser (User.serializeUser());
passport.deserializeUser (User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.getSecret()));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

/* initialize locals*/
app.use(function (req, res, next) {
    //console.log(req.user);
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
