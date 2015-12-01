/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var buildcontroller  = require('../controller/buildfactory');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path'); //used for file path
var fs = require('fs'); //File System - for file manipulation
var config = require('../config/config');
var AppRule = require('../config/apprule-engine');
var adminpanelfactory  = require('../controller/admincontrolpanel');

/* GET users listing. */

router.get('/admindashboard', AppRule.isLoggedIn, AppRule.canAccessServiceOnlyAdmin, function(req, res) {
	adminpanelfactory.getCollectionList(req,res,function(a,b){});
	res.render('private/admindashboard.ejs',{
		arRole : req.user.role // get the user out of session and pass to template
	});
});
module.exports = router;