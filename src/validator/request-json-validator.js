'use strict';
var schemavalidator = require("./scheam-validator.js");
var AppJSONReqInputValidator = function(){ };
AppJSONReqInputValidator.prototype.projectBuilds = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("projectBuildsSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};
AppJSONReqInputValidator.prototype.createProject = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("createProjectSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};
AppJSONReqInputValidator.prototype.deleteBuilds = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("deleteBuildSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};
AppJSONReqInputValidator.prototype.userProjctRoleInfoSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("userProjctRoleInfoSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.changepasswordSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("changepasswordSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.publishBuildInfoSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("publishBuildInfoSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};


AppJSONReqInputValidator.prototype.editProjectSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("editProjectSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.saveAutoBuildSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("saveAutoBuildSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.projectAccessHistorySchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("projectAccessHistorySchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.statusUpdateSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("statusUpdateSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.deleteProjectSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("deleteProjectSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};

AppJSONReqInputValidator.prototype.updateProjectTeamMemberRoleSchema = function(req, res, next) {
	var results = schemavalidator.validateInputJSON("updateProjectTeamMemberRoleSchema",req.body);
	if(results.errors.length>0){
		res.json({ 'error': true, 'errorType': "Invalid Input", "data": results.errors});
	}else{
		next();
	}
};



module.exports = new AppJSONReqInputValidator();