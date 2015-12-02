/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var buildcontroller  = require('../controller/buildfactory');
var config = require('../config/config');
var AppRule = require('../config/apprule-engine');
var AppGcm = require('../config/app-gcm');
var buildProject = require('../config/build-project');
/* GET users listing. */
router.get('/',AppRule.isLoggedIn,function(req, res, next) {
	next();
});

router.post('/',AppRule.isLoggedIn,function(req, res, next) {
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

router.get('/publishBuildInfo',AppRule.isLoggedIn, function(req, res) {
	AppGcm.pushNotification(function(result){
		res.json({"data": result});
	});
});

router.get('/buildProjectAndDeploy', AppRule.isLoggedIn , function(req, res) {
	res.json({ 'error': true, 'errorType': "", "data": null});
	buildProject.buildNow(function(arg){
		console.log(arg);
	});
});

module.exports = router;
