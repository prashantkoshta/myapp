// config/passport.js
var async            	= require('async');
// load all the things we need
var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User            = require('../models/user');
var indexcounter    = require('../models/indexcounter');

// load the auth variables
var configAuth = require('./config');
var genrateKey = require('./genratekey');
var errorMap = require('./errormap');



// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });





    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password,done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
	   if(configAuth.environment === "production"){
		   if(!req.validnocaptcha) { return done(null, false, req.flash = {'signupMessage': errorMap.getError("0001")});}
	   }
       User.findOne({'local.email' : email},{'local.email':1,'local.password':1,'local.hash':1,'local.firstname':1,'local.middlename':1,'local.lastname':1,'role':1}, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash= {'signupMessage': errorMap.getError("0002")});
            } else {

                // if there is no user with that email
                // create the user
            	var newUser = new User();
            	var hash = newUser.generateHash();
            	var encryptedPwd = newUser.generatePassword(hash,password);
                // set the user's local credentials
                newUser.local.email    = email;
				newUser.fullname = req.body.firstname+" "+req.body.middlename+" "+req.body.lastname;
                newUser.local.firstname = req.body.firstname;
                newUser.local.middlename = req.body.middlename;
                newUser.local.lastname = req.body.lastname;
                newUser.local.hash = hash;
                newUser.local.password = encryptedPwd;
                newUser.role = "user";
				
				
				async.waterfall([
					function(callback){
						var tid = genrateKey.genrateNewIndexId("userid",function(arg){
							callback(null,arg);
						});
					}
			    ],function(err,_id){
						newUser._id = _id;
						newUser.uinkey = 'uin_'+_id;
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
				});	

            }

        });

        });

    }));




    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email },{"auth_token":0}, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash = {'loginMessage': errorMap.getError("0003")}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                return done(null, false,req.flash = {'loginMessage': errorMap.getError("0004")}); // create the loginMessage and save it to session as flashdata
            }
			return done(null, user);
        });

    }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
   passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },
     // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
						 return done(null, user); // user found, return that user                    
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
					newUser.fullname =  newUser.facebook.name;
					//profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.role = "user";
					// save our user to the database
					async.waterfall([
						function(callback){
							var tid = genrateKey.genrateNewIndexId("userid",function(arg){
								callback(null,arg);
							});
						}
					],function(err,_id){
							newUser._id = _id;
							newUser.uinkey = 'uin_'+_id;
							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
					});
                   
                }

            });
        });

    }));


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
   passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {
            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
						return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;
					newUser.fullname = profile.displayName;
					newUser.role = "user";
                    // save our user into the database
                    async.waterfall([
						function(callback){
							var tid = genrateKey.genrateNewIndexId("userid",function(arg){
								callback(null,arg);
							});
						}
					],function(err,_id){
							newUser._id = _id;
							newUser.uinkey = 'uin_'+_id;
							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
					});
                }
            });

    });

    }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
						 // if a user is found, log them in
						return done(null, user);
                   
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email
					newUser.fullname = profile.displayName;
					newUser.role = "user";
                    // save the user
                    async.waterfall([
						function(callback){
							var tid = genrateKey.genrateNewIndexId("userid",function(arg){
								callback(null,arg);
							});
						}
					],function(err,_id){
							newUser._id = _id;
							newUser.uinkey = 'uin_'+_id;
							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
					});
                }
            });
        });

    }));



};
