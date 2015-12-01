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
/* GET users listing. */
router.get('/',AppRule.isLoggedIn,function(req, res, next) {
	console.log("here...");
	next();
});

router.post('/',AppRule.isLoggedIn,function(req, res, next) {
	console.log("here...post");
	next();
});

router.get('/getDetails',AppRule.isLoggedIn,function(req, res, next) {
	buildcontroller.getBuildInfo(function(bool,buildList){
		if(bool){
			res.json({ 'error': false, 'errorType': "", "data": buildList });
		}else{
			res.json({ 'error': true, 'errorType': "", "data": null });
		}
	});
});

router.get('/downloadfile/:filename', AppRule.isLoggedIn,function (req, res) {
	console.log(req.params.filename);
	res.download(config.uploadFilePath+"/"+req.params.filename); 
});

router.post('/saveBuildInfo',AppRule.isLoggedIn, AppRule.canAccessService, function(req, res) {
	buildcontroller.onFileUpload(req, res, function(errorFlag,erroType,result){
			res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/deleteBuildInfo',AppRule.isLoggedIn,function(req, res) {
	buildcontroller.delBuildInfo(req, res, function(errorFlag,erroType,result){
			res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

module.exports = router;