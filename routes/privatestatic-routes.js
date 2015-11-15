// To server private static files.

// app/routes.js
//================================== routes for API ====================================

var express = require('express');
module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.get('/test', isLoggedIn, function(req, res) {
        res.send('i am here');
    });


   /* api.get('/assets/:*', function (req, res) {
        var name = req.params.name;
		console.log(">>>>>>",req.params,name,req.params[0]);
        res.render('/' +req.params[0]);
    });
*/

    function isLoggedIn(req, res, next) {
	    console.log("isLoggedIn resources",req.isAuthenticated(), req.session);
	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();
	    // if they aren't redirect them to the home page
	   res.send('Do not have access of it.');
	   //res.end();
	}
    return api;
})();