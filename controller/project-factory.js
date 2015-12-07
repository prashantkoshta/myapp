// load up the user model
var Projects = require('../models/projects');
var BuildInfo = require('../models/buildinfo');
var User = require('../models/user');
var mongoose = require('mongoose');
var ProjectFactory = function(){};

ProjectFactory.prototype.getProjectList = function(req,res,callback){
  		Projects.find({},{projectname:1},function(err, list) {
  			if(err){
                  throw err;
  			}
  			if(!list) {
  			    return callback(false,"",list);  
  			}
  			return callback(false,"",list);
  		}).sort({'projectname': 1});
};

ProjectFactory.prototype.createProject = function(req,res,callback){
	var newProjects = new Projects();
	var data = req.body
	newProjects.projectname = data.projectname;
	newProjects.git = data.git;
	newProjects.status = data.status;
	newProjects.buildbatchfile = data.buildbatchfile,
	newProjects.buildlocation = data.buildlocation,
	newProjects.users = [];//data.users;
	newProjects.builds = [];//data.builds;
	newProjects.save(function(err, obj) {
		console.log(err,obj);
		if(err){
			  throw err;
		}
		return callback(false,"",obj);
	});
};

ProjectFactory.prototype.deleteProject = function(req,res,callback){
	var data = req.body
	Projects.remove({"projectname":{$in:data.projectsname}},function(err, obj) {
		console.log(err,obj);
		if(err){
			  throw err;
		}
		return callback(true,"",obj);
	});
};


ProjectFactory.prototype.getBuildsByProjectId = function(req,res,callback){
	var data = req.body
	console.log(data.projectname);
	Projects.findOne({"projectname":data.projectname},function(err, proj) {
		if(err){
			  throw err;
		}
		BuildInfo.find({"_id":{$in:proj.builds}},function(er,builds){
			if(er){
				  throw er;
			}
			return callback(true,"",builds);
		}).sort({'buildate': 1});
	});
};

ProjectFactory.prototype.addUserInProject = function(req,res,callback){
	var data = req.body
	Projects.find({"projectname":data.projectname},function(err, proj) {
		if(err) throw err;		
		User.find({"local.email":{$in:data.users}},function(er,users){
			if(er) throw er;
			console.log(!users);
			if(!users){
				return callback(true,"No Record Found.",users);
			}
			var len = users.length;
			var result = [];
			for(var i=0;i<len;i++){
				Projects.update({"projectname":data.projectname, $push:{"users":users[i].id}},function(e,p){
					if(er) throw er;	
					result.push(p);
					if(result.length === len){
						return callback(false,"",p);
					}
				});
			}		
		});
	});
};

ProjectFactory.prototype.addBuildsInProject = function(req,res,callback){
	var data = req.body
	for(var j =0;j<data.builds.length;j++){
		data.builds[j] = mongoose.Types.ObjectId(data.builds[j]);
	}
	Projects.find({"projectname":data.projectname},function(err, proj) {
		if(err) throw err;		
		BuildInfo.find({"_id":{$in:data.builds}},{id:1},function(er,builds){
			if(er) throw er;
			
			if(!builds || builds.length === 0){
				return callback(true,"No Record Found.",builds);
			}
			var len = builds.length;
			var result = [];
			for(var i=0;i<len;i++){
				Projects.findOneAndUpdate({"projectname":data.projectname},{$addToSet:{"builds":builds[i].id}},{ upsert: true },function(e,p){
					if(er) throw er;
					result.push(p);
					if(result.length === len){
						return callback(false,"",p);
					}
				});
			}		
		});
	});
};


ProjectFactory.prototype.deleteBuild = function(req,res,callback){
	var data = req.body
	for(var j =0;j<data.builds.length;j++){
		data.builds[j] = mongoose.Types.ObjectId(data.builds[j]);
	}
	BuildInfo.find({"_id":{$in:data.builds}},{id:1},function(er,builds){
		if(er) throw er;
		Projects.findOneAndUpdate({"projectname":data.projectname},{$pull:{"builds":{$in:builds}}},function(err, obj) {
			if(err) throw err;
			BuildInfo.remove({"_id":{$in:builds}},function(er1,builds1){
				if(er1) throw er1;
				return callback(false,"",builds1);
			});
		});
	});
};





module.exports = ProjectFactory;