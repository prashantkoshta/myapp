// To server private static files.

// app/routes.js
//================================== routes for API ====================================

var express = require('express');
module.exports = (function() {
    'use strict';
    var api = express.Router();
    function isLoggedIn(req, res, next) {
	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();
	    // if they aren't redirect them to the home page
	   res.send('Do not have access of it.');
	   //res.end();
	}
    return api;
})();