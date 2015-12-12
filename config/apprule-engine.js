/**
 * Error Code for application
 */
'use strict';
var config = require('./config');
var jwt    = require('jsonwebtoken');
var User   = require('../models/user');
var AppRule = function(){ };

AppRule.prototype.canAccessService = function(req, res, next) {
	var arRole = req.user.role;
	var access = true;
	if((arRole.indexOf("user") > -1 || arRole.indexOf("admin") >-1) && req.url === "/saveBuildInfo"){
		access = true;
	}
    if (access)
        return next();
    res.render('error');
    res.end();
}

AppRule.prototype.canAccessServiceOnlyAdmin = function(req, res, next) {
	var arRole = req.user.role;
	var access = true;
	if((arRole.indexOf("user") > -1 || arRole.indexOf("admin") >-1) && req.url === "/buildProjectAndDeploy"){
		access = false;
	}
    if (access)
        return next();
    res.render('error');
    res.end();
}

AppRule.prototype.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
    res.end();
}

AppRule.prototype.getNewToken = function(user,res){
	 var token = jwt.sign(user,config.sessionSecret,{expiresIn:1});
	 User.findOneAndUpdate({"_id":user._id},{"auth_token":token},function(err, obj) {
		if(err) throw err;
	 });	
	 return token;
}

AppRule.prototype.validateToken = function (req, res, next){
	var token = req.body.token || req.query.token || req.headers['token'];
	//console.log("QUERY>>>>>>>",token); 
		 if (token) {
			// verifies secret and checks exp
			
			jwt.verify(token,config.sessionSecret, function(err, decoded) {      
			  if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			  } else {
				// if everything is good, save to request for use in other routes
				req.user = decoded; 
				return next();
			  }
			});

		  } else {
			
/*	*/			
			// if there is no token
			// return an error
			return res.status(403).send({ 
				success: false, 
				message: 'No token provided.' 
			});
		
		  }
}

module.exports = new AppRule();