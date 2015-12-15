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
router.get('/', AppRule.validateToken, function(req, res, next) {
	next();
});

router.post('/', AppRule.validateToken,function(req, res, next) {
	next();
});

router.get('/getDetails', AppRule.validateToken,function(req, res, next) {
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

router.post('/saveBuildInfo', AppRule.validateToken, AppRule.canAccessService, function(req, res) {
	buildcontroller.onFileUpload(req, res, function(errorFlag,erroType,result){
			res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/publishBuildInfo', AppRule.validateToken, function(req, res) {
	buildcontroller.getBuildInfoForPublish(req,res,function(errorFlag,erroType,result){
		if(!errorFlag){
			AppGcm.pushNotification(result,function(result){
				res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
			});
		}else{
		    	res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});	
		}
	});
});

router.post('/buildProjectAndDeploy', AppRule.validateToken,function(req, res) {
	buildcontroller.buildProject(req, res,function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.get('/subscribe/:mobiletoken', AppRule.validateToken, function (req, res) {
	buildcontroller.subscribeForBuildInfo(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.get('/unsubscribe', AppRule.validateToken, function (req, res) {
	buildcontroller.unsubscribeForBuildInfo(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.get('/listOfProjects',AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.getProjectList(req.user, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/createProject', AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	req.body.created_user_id = req.user._id;
	req.body.created_userfullname = req.user.local.firstname + "  "+ req.user.local.lastname;
	projFactory.createProject(req.body,function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/deleteProject', AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.deleteProject(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/projectBuilds', AppRule.validateToken,function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.getBuildsByProjectId(req, res, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/addUserInProject', AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.addUserInProject(req.body, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});


router.post('/addBuildsInProject', AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.addBuildsInProject(req.body,function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});


router.post('/deleteBuild', AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.deleteBuild(req.body, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/usersList', AppRule.validateToken, function (req, res) {
	var projFactory = new ProjectFactory();
	projFactory.getListOfUsers(req.body, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

module.exports = router;
