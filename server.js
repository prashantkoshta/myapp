// server.js

// set up ======================================================================
// get all the tools we need
var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8080;
var mongoose            = require('mongoose');
var passport            = require('passport');
var flash               = require('connect-flash');
var favicon             = require('serve-favicon');

var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var config          = require('./config/config.js');
var path            = require('path');
var privateRoutes   = require('./routes/privatestatic-routes');
var busboy 			= require('connect-busboy');
console.log(app.get('env'), config.url);
// configuration ===============================================================\
mongoose.connect(config.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

//upload file path 
config.uploadFilePath = path.join(__dirname, config.uploadDir); //__dirname+"/"+config.uploadDir;


// set up our express application
app.use(busboy());
app.use(express.static(path.join(__dirname, config.staticPrivateDir), {expires: new Date(Date.now() + 60 * 10000),maxAge: 60*10000 }));
app.use(express.static(path.join(__dirname, config.staticPublicDir), {expires: new Date(Date.now() + 60 * 10000),maxAge: 60*10000 }));
app.use(favicon(__dirname + '/'+ config.staticPublicDir + '/favicon.ico'));

// view engine
/*
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + config.viewsDir);
app.set('view engine', 'html');
*/
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({ limit: '1mb' })); // get information from html forms 
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-nocaptcha')({secret: config.recaptchasecretkey}));

app.set('views', __dirname + config.viewsDir);
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: config.sessionSecret, cookie: {expires: new Date(Date.now() + 60 * 10000),maxAge: 60*10000 } })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(function (req, res, next) {
    //console.log('Time:', Date.now());
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=600000');
    // res.header('Expires', '-1');
    //res.header('Pragma', 'no-cache');
    next();
});


// routes ======================================================================
app.use(config.staticPrivateContextPath, privateRoutes);
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use("/buildapp/gateway",require('./routes/build-routes.js'));
app.use("/admincontrol/gateway",require('./routes/adminroutes.js'))
// launch ======================================================================




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);
console.log('The magic happens on port ' + port);
