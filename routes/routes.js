// Main routes for login authentication and signup
var adminTask = require('../controller/admin');
var User = require('../models/user');
var url  = require('url');
var AppRule = require('../config/apprule-engine');
var jwt    = require('jsonwebtoken');
var config = require('../config/config');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('public/index.ejs'); // load the index.ejs file
    });
    
   
    
    app.get('/view/:*', function (req, res) {
        var name = req.params.name;
        res.render('public/' + req.params[0]);
    });
    
    app.get('/secureview/:*',AppRule.isLoggedIn,function (req, res) {
        var name = req.params.name;
        res.render('private/' + req.params[0]);
    });
    
    // =====================================
    // FORGOT Password =====================
    // =====================================
    app.get('/auth/forgot/:email', function (req, res) {
        // render the page and pas,s in any flash data if it exists
        //res.render('index.ejs', { message: { 'error': true, 'errorType': "loginError", "description": req.flash('loginMessage') } });
		adminTask.isEmailExist(req.params.email,function(a){
			if(!a){
				req.flash('forgotMessage',"No emailid found.")
				res.json({ 'error': true, 'errorType': "forgotError", "description": req.flash('forgotMessage')});
				return;
			}else{
				adminTask.resetPassword(req.params.email,req,function(b,user){
					if(b){
						res.json({ 'error': false, 'errorType': "", "description": "done" });
						return;
					}
				});
			}
		});
		        
    });
	
    // =====================================
    // Change Password =====================
    // =====================================
	app.post('/auth/changepassword', AppRule.validateToken, function (req, res) {
        // render the page and pas,s in any flash data if it exists
        //res.render('index.ejs', { message: { 'error': true, 'errorType': "loginError", "description": req.flash('loginMessage') } });
		adminTask.changePassword(req.session["userid"],req.body.oPwd,req.body.nPwd,function(a){
			if(!a){
				req.flash('passwordMessage',"Incorrect password.")
				res.json({ 'error': true, 'errorType': "passwordError", "description": req.flash('passwordMessage')});
				return;
			}else{
				res.json({ 'error': false, 'errorType': "", "description": "done" });
			}
		});
		        
    });
	
    
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('public/index.ejs', { message:{'error':true,'errorType':"loginError","description":req.flash('loginMessage')}});
    });

 	app.post('/login', function(req, res, next) {
	  passport.authenticate('local-login', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) {return res.redirect('/login'); }
		req.logIn(user, function(err) {
		  if (err) { return next(err); }
		  var token = AppRule.getNewToken(user,res);
		  res.setHeader("token", token);
		  res.render('private/profile.ejs', {arRole:user.role,"token":token});
		});
	  })(req, res, next);
	});

    

	

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('public/signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	
	  app.get('/profile', AppRule.validateToken, function(req, res) {
		res.render('private/profile.ejs', {arRole:user.role,"token":token});
      });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));


    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
   app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
    }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
		req.session.destroy();
        delete req.session;
        req.logout();
		var token = req.body.token || req.query.token || req.headers['token'];
		if (token) {
			jwt.verify(token,config.sessionSecret, function(err, decoded) {
			  if (err) {
				 if(err.name === "TokenExpiredError"){
					 var new_decoded = jwt.decode(token,{complete: true});
					 User.findOneAndUpdate({"_id":new_decoded.payload._id},{$set:{"lastlogouttime":new Date()}},{upsert:true},function(err,user){
						if(err) throw err;
						return res.json({ 'error': false, 'errorType': "", "data": ""});
					});
				 }
			  } else {
				var new_decoded = jwt.decode(token,{complete: true});
				 User.findOneAndUpdate({"_id":new_decoded.payload._id},{$set:{"lastlogouttime":new Date()}},{upsert:true},function(err,user){
					if(err) throw err;
					return res.json({ 'error': false, 'errorType': "", "data": ""});
				});
			  }
			});
		}		
        //res.redirect('/');
        //res.end();
    });
};
