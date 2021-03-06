// Main routes for login authentication and signup
var adminTask = require('../controller/admin');
var User = require('../models/user');
var url  = require('url');
var AppRule = require('../config/apprule-engine');
var jwt    = require('jsonwebtoken');
var config = require('../config/config');
var ReqJsonValidator = require('../src/validator/request-json-validator');
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
    
    app.get('/secureview/:*', function (req, res) {
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
				req.flash = {'forgotMessage':"No emailid found."};
				res.json({ 'error': true, 'errorType': "forgotError", "description": req.flash.forgotMessage});
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
	app.post('/auth/changepassword', AppRule.validateToken, ReqJsonValidator.changepasswordSchema, function (req, res) {
        // render the page and pas,s in any flash data if it exists
        //res.render('index.ejs', { message: { 'error': true, 'errorType': "loginError", "description": req.flash('loginMessage') } });
		adminTask.changePassword(req.user._id,req.body.oPwd,req.body.nPwd,function(a){
			if(!a){
				req.flash = {'passwordMessage':"Incorrect password."}
				res.json({ 'error': true, 'errorType': "passwordError", "description": req.flash.passwordMessage});
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
    /*app.get('/login', function(req, res) {
		console.log("#############",req.flash);
        res.render('public/index.ejs', { message:{'error':true,'errorType':"loginError","description":req.flash('loginMessage')}});
    });
	*/
 	app.post('/login', function(req, res, next) {
	  passport.authenticate('local-login',function(err, user, info){
			if (err) { return next(err); }
			if (!user) {
				//return res.redirect('/login'); 
				return  res.render('public/index.ejs', {message:{'error':true,'errorType':"loginError","description":req.flash.loginMessage}});
			}
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
			  updateLoginInfo(req,user);
			  var token = AppRule.getNewToken(user,res);
			  res.setHeader("token", token);
			  res.redirect('/profile?token='+token);
				});
		})(req, res, next);
	});

    

	

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
		res.render('public/signup.ejs', { message: {}});
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    // process the signup form
   /* app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	*/
	
	
	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup',function(err, user, info){
				if (err) { return next(err); }
				if (!user) {return  res.render('public/signup.ejs', {message:req.flash.signupMessage});}
				req.logIn(user, function(err) {
				  if (err) { return next(err); }
				  res.render('public/signup-done.ejs');
				});
			})(req, res, next);
	});

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	
	  app.get('/profile', AppRule.validateTokenBeforeOnPage, function(req, res) {
		 res.render('private/profile.ejs', {"fullname" :req.user.fullname ,"role":req.user.role,"token":res._headers.token,uinkey:req.user.uinkey,"signby":getLoginBy(req.user)});
      });
	  
	  app.get('/isAuthenticated', AppRule.validateToken, function(req, res) {
			res.send();
      });
	  
	  function isEmpty(obj) {
		  var i = !Object.keys(obj).length > 0;
		  return i
	  }
	  
	  function getLoginBy(aUsr){
		  var signfrom;
		  if((aUsr.facebook !== undefined) && isEmpty(aUsr.facebook)){
			   signfrom = "facebook"
		  }else if((aUsr.google !== undefined) && isEmpty(aUsr.google)){
			   signfrom = "google"
		  }else if((aUsr.twitter !== undefined) && isEmpty(aUsr.twitter)){
			   signfrom = "twitter"
		  }else{
			  signfrom = "local"
		  }
		 return signfrom;
	  }
	  
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',function(req, res, next) {
	  passport.authenticate('facebook',function(err, user, info){
			if (err) { return next(err); }
			if (!user) {return res.redirect('/login'); }
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
			  updateLoginInfo(req,user);
			  var token = AppRule.getNewToken(user,res);
			  res.setHeader("token", token);
			  res.redirect('/profile?token='+token);
			});
		})(req, res, next);
	});


function updateLoginInfo(req,user){
	console.log(">>>>>>>>");
	User.findOneAndUpdate({"_id":user._id},{$set:{"sessioninfo.islogin":1,'sessioninfo.useragent':req.headers['user-agent'],'sessioninfo.ip':req.headers['x-forwarded-for'] || req.connection.remoteAddress}},{upsert:true},function(er1,obj){
						if(er1) throw er1;
	});
}	


    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
   app.get('/auth/twitter', passport.authenticate('twitter'));

   app.get('/auth/twitter/callback',function(req, res, next) {
	  passport.authenticate('twitter',function(err, user, info){
			if (err) { return next(err); }
			if (!user) {return res.redirect('/login'); }
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
			  updateLoginInfo(req,user);
			  var token = AppRule.getNewToken(user,res);
			  res.setHeader("token", token);
			  res.redirect('/profile?token='+token);
				});
		})(req, res, next);
	});
	
	

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',function(req, res, next) {
	  passport.authenticate('google',function(err, user, info){
			if (err) { return next(err); }
			if (!user) {return res.redirect('/login'); }
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
			  updateLoginInfo(req,user);
			  var token = AppRule.getNewToken(user,res);
			  res.setHeader("token", token);
			  res.redirect('/profile?token='+token);
				});
		})(req, res, next);
	});

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
		var token = req.headers['token'] || req.body.token || req.query.token;
		if (token) {
			jwt.verify(token,config.sessionSecret, function(err, decoded) {
			  if (err) {
				 if(err.name === "TokenExpiredError"){
					 var new_decoded = jwt.decode(token,{complete: true});
					 User.findOneAndUpdate({"_id":new_decoded.payload._id},{$set:{"lastlogouttime":new Date(),"sessioninfo.islogin":0}},{upsert:true},function(err,user){
						if(err) throw err;
						//return res.json({ 'error': false, 'errorType': "", "data": ""});
						return res.redirect('/');
					});
				 }
			  } else {
				var new_decoded = jwt.decode(token,{complete: true});
				 User.findOneAndUpdate({"_id":new_decoded.payload._id},{$set:{"lastlogouttime":new Date(),"sessioninfo.islogin":0}},{upsert:true},function(err,user){
					if(err) throw err;
					//return res.json({ 'error': false, 'errorType': "", "data": ""});
					return res.redirect('/');
				});
			  }
			});
		}		
    });
};
