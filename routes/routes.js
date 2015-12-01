// Main routes for login authentication and signup
var adminTask = require('../controller/admin');
var User = require('../models/user');
var url  = require('url');
var AppRule = require('../config/apprule-engine');

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
						console.log("AAA",req.params.email );
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
	app.post('/auth/changepassword', AppRule.isLoggedIn, function (req, res) {
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

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // TOKEN LOGIN =========================
    // =====================================
    /*app.post('/loginfromtoken', passport.authenticate('bearer', {
        session: false,
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/loginfromtoken', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    */
    /*app.post('/loginfromtoken',function(req,res){
        console.log("HI");
    });*/

    /*app.get('/loginfromtoken', function(req, res) {
        // render the page and pass in any flash data if it exists
        //res.render('loginfromtoken.ejs', { message: req.flash('loginMessage') });
        res.render('loginfromtoken.ejs');
    });*/



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
    app.get('/profile', AppRule.isLoggedIn, function(req, res) {
        res.render('private/profile.ejs', {
            arRole : req.user.role // get the user out of session and pass to template
        });
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
        res.redirect('/');
        res.end();
    });

};
