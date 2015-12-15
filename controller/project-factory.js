// load up the user model
var Projects = require('../models/projects');
var BuildInfo = require('../models/buildinfo');
var User = require('../models/user');
var mongoose = require('mongoose');
var async    = require('async');
var indexcounter    = require('../models/indexcounter');
var genrateKey = require('../config/genratekey');

var ProjectFactory = function(){};

ProjectFactory.prototype.getProjectList = function(data,done){
  		async.waterfall([
	    function(callback){
			User.findOne({"_id":data._id},{"projects":1},function(err, list) {
				if(err)throw err;
				if(!list) callback(new Error(true),"",list);
				callback(null,list.projects);
			});
		},
		function(arProjectid,callback){
			console.log(arProjectid);
			Projects.find({"_id":{$in:arProjectid}},{"_id":1,"projectname":1}, function(err1, projects) {
				if(err1) throw err1;
				callback(null,projects);
			});
		}
	],function(err,data){
		if(err) done(true,"Project already exist.",{});
		done(false,"",data);
	});
};


ProjectFactory.prototype.createProject = function(data,done){
	var newProjects = new Projects();
	newProjects.projectname = data.projectname;
	newProjects.git = data.git;
	newProjects.status = data.status;
	newProjects.buildbatchfile = data.buildbatchfile;
	newProjects.buildlocation = data.buildlocation;
	newProjects.created_user_id = data.created_user_id;
	newProjects.created_userfullname = data.created_userfullname;
	
	async.waterfall([
	    function(callback){
			Projects.findOne({"projectname":data.projectname},function(err, proj) {
				if(err) throw err;
				if(proj) return callback(new Error("true"),"Project already exist.",proj);
				callback(null,proj);
			});
		},
		function(arg,callback){
			var tid = genrateKey.genrateNewIndexId("projectid",function(arg){
				callback(null,arg);
			});
		},
		function(id,callback){
			newProjects._id = id;
			newProjects.save(function(err, obj) {
				if(err) throw err;
				callback(null,id);
			});
		},
		function(projectid,callback){
			User.findOneAndUpdate({"_id":data.created_user_id},{$addToSet:{"projects":projectid}},{ upsert: false },function(er1,users){
				if(er1) throw er1;
				if(!users) return callback(new Error(true),"No Project Found",users);
				callback(null,users);
			});
		}
	],function(err,data){
		if(err) done(true,"Project already exist.",{});
		done(false,"",data);
	});
	
	
	
	
	
};

ProjectFactory.prototype.deleteProject = function(req,res,callback){
	var data = req.body
	Projects.remove({"projectname":{$in:data.projectsname}},function(err, obj) {
		if(err) throw err;
		return callback(true,"",obj);
	});
};


ProjectFactory.prototype.getBuildsByProjectId = function(req,res,callback){
	var data = req.body
	Projects.findOne({"projectname":data.projectname},{projectname:1, builds:1},function(err, proj) {
		if(err) throw err;
		if(!proj)return callback(true,"No Project Found.",proj);
		return callback(false,"",proj);
	});
};

ProjectFactory.prototype.addUserInProject = function(data,callback){
	Projects.find({"projectname":{$in:data.projects}},{"_id":0,"projectname":1},function(err, proj) {
		if(err) throw err;	
		console.log(proj);		
		if(!proj) return callback(true,"No Project Record Found.",proj);
		var arProjs = [];
		for(var i=0;i<proj.length;i++){
			arProjs.push(proj[i]._id);
		}
		console.log(arProjs);
		User.findOneAndUpdate({"local.email":data.user},{$addToSet:{"projects":arProjs}},{ upsert: false },function(er,users){
			if(err) throw err;
			console.log(users);
			if(!users) return callback(true,"No Project Found",users);
			return callback(false,"",users);
		});
	});
};

ProjectFactory.prototype.addBuildsInProject = function(data,done){
	var obj = data.builds;
	
	async.waterfall([
	    function(callback){
			Projects.findOne({"projectname":data.projectname},function(err1,proj1){
				if(err1) throw err1;
				if(!proj1) callback(new Error(true),"No Project Found","");
				callback(null);
			});
		},
	    function(callback){
			genrateKey.genrateNewIndexId("buildid",function(arg){
				var arOfBuilds = []
				for(var i=0;i<1;i++){
					var objBuild = new BuildInfo();
					objBuild._id = arg
					objBuild.builddate = new Date();
					objBuild.buildname = obj[i].buildname;
					objBuild.ostype = obj[i].ostyle;
					objBuild.appversion = obj[i].appversion;
					objBuild.buildnum = obj[i].buildnum;
					objBuild.filename = obj[i].filename;//"aa.apk";
					objBuild.createdby = obj[i].createdby; //req.session["userid"];
					objBuild.description = obj[i].description;
					objBuild.build_user_id = obj[i].build_user_id;
					arOfBuilds.push(objBuild);
				}
				callback(null,arOfBuilds);
			});
		},
		function(arOfBuilds,callback){
			Projects.findOneAndUpdate({"projectname":data.projectname},{$addToSet:{"builds":{$each:arOfBuilds}}},{ upsert: false },function(err, proj) {
				if(err) throw err;
				if(!proj) callback(new Error(true),"No Project Found","");
				callback(null,proj);
			});
		}
	],function(err,data){
		if(err) return done(true,"Project already exist.",{});
		done(false,"",data);
	});
	
	
};

// TODO on Dec 10th 2015
ProjectFactory.prototype.deleteBuild = function(data,callback){
	// Query: 
	//db.projects.update({"_id":"projectid_6"},{$pull:{"builds" : {"_id": {$in:["buildid_4"]}}}},false,true);
	console.log(">>>>>",data.builds);
	Projects.findOneAndUpdate({"projectname":data.projectname},{$pull:{"builds":{"_id":{$in:data.builds}}}},{upsert:false,multi:true},function(err, obj) {
		if(err) throw err;
		callback(false,"",obj);
	});
};

/* 
*	Get All list of Users
*/
ProjectFactory.prototype.getListOfUsers = function(data,callback){
  		User.find({},{"local.firstname":1,"local.middlename":1,"local.lastname":1,"role":1,"projects":1},function(err, list) {
  			if(err)throw err;
  			if(!list)return callback(false,"",list);
  			return callback(false,"",list);
  		}).sort({'projectname': 1});
};
module.exports = ProjectFactory;