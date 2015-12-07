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
var ProjectFactory = require('../controller/project-factory');
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
	buildcontroller.getBuildInfoForPublish(id,function(errorFlag,erroType,result){
		if(!errorFlag){
			AppGcm.pushNotification(result,function(result){
				rres.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
			});
		}else{
		    	res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});	
		}
	});
});

router.post('/buildProjectAndDeploy',function(req, res) {
	buildcontroller.buildProject(req, res,function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.get('/subscribe:mobiletoken', function (req, res) {
	buildcontroller.subscribeForBuildInfo(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.get('/unsubscribe', function (req, res) {
	buildcontroller.unsubscribeForBuildInfo(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.get('/listOfProjects', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.getProjectList(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/createProject', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.createProject(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/deleteProject', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.deleteProject(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/projectBuilds', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.getBuildsByProjectId(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/addUserInProject', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.addUserInProject(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});


router.post('/addBuildsInProject', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.addBuildsInProject(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});


router.post('/deleteBuild', function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.deleteBuild(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

module.exports = router;
