// load up the user model
var Projects = require('../models/projects');
var BuildInfo = require('../models/buildinfo');
var User = require('../models/user');
var mongoose = require('mongoose');
var ProjectFactory = function(){};

ProjectFactory.prototype.getProjectList = function(data,callback){
  		User.findOne({"_id":mongoose.Types.ObjectId(data._id)},function(err, list) {
  			if(err)throw err;
  			if(!list)return callback(false,"",list);
			// Patch
			var ar = [];
			for(var i=0;i<list.projects.length;i++){
				ar.push({"projectname":list.projects[i]});
			}
  			return callback(false,"",ar);
  		});
};


ProjectFactory.prototype.createProject = function(data,callback){
	var newProjects = new Projects();
	newProjects.projectname = data.projectname;
	newProjects.git = data.git;
	newProjects.status = data.status;
	newProjects.buildbatchfile = data.buildbatchfile;
	newProjects.buildlocation = data.buildlocation;
	newProjects.created_user_id = data.created_user_id;
	newProjects.created_userfullname = data.created_userfullname;
	Projects.findOne({"projectname":data.projectname},function(err, proj) {
		if(err) throw err;
		if(proj) return callback(true,"Project already exist.",proj);
		
		newProjects.save(function(err, obj) {
			if(err){
				  throw err;
			}
			return callback(false,"",obj);
		});
		
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
			arProjs.push(proj[i].projectname);
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

ProjectFactory.prototype.addBuildsInProject = function(data,callback){
	var obj = data.builds;
	var arOfBuilds = []
	for(var i=0;i<obj.length;i++){
		var objBuild = new BuildInfo();
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
		
	Projects.findOneAndUpdate({"projectname":data.projectname},{$pushAll:{"builds":arOfBuilds}},{ upsert: false },function(err, proj) {
		if(err) throw err;
		if(!proj) return callback(true,"No Project Found",proj);
		return callback(false,"",proj);
	});	
};

// TODO on Dec 10th 2015
ProjectFactory.prototype.deleteBuild = function(req,res,callback){
	var data = req.body
	var result = [];
	for(var j =0;j<data.builds.length;j++){
		data.builds[j] = mongoose.Types.ObjectId(data.builds[j]);
		Projects.findOneAndUpdate({"projectname":data.projectname},{$pull:{"builds":{_id:data.builds[j]}}},function(err, obj) {
			if(err) throw err;
			result.push(obj);
			if(result.length == data.builds.length){
				return callback(false,"",result);
			}
			
		});
	}
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