// load up the user model
var path = require('path');
var config = require('../config/config');
var Projects = require('../models/projects');
var BuildInfo = require('../models/buildinfo');
var BuildDump = require('../models/builddump');
var User = require('../models/user');
var Role = require('../models/role');
var async    = require('async');
var indexcounter    = require('../models/indexcounter');
var genrateKey = require('../config/genratekey');
var fsex = require('fs.extra');
var buildObj = require('../config/build-project');
var ProjectFactory = function(){};
ProjectFactory.prototype.getProjectListByUserId = function(data,done){
  		async.waterfall([
	    function(callback){
			User.findOne({"_id":data._id},{"projects":1},function(err, list) {
				if(err)throw err;
				if(!list) callback(new Error(true),"",list);
				callback(null,list.projects);
			});
		},
		function(arProjectid,callback){
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
			Projects.findOne({"projectname":data.projectname},{projectname:1},function(err, proj) {
				if(err) throw err;
				if(proj) {
					var e = new Error();
					e.message = {'error':true,'errorType': "Project already exist.", "data": proj};
					return callback(e);
				}
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
			User.findOneAndUpdate({"_id":data.created_user_id},{$addToSet : {"projects": { $each:[projectid]}}},{upsert:true,multi:false},function(er1,users){
				if(er1) throw er1;
				if(!users){ 
					var e = new Error();
					e.message = {'errorType': "No Project Found", "data":projectid};
					return callback(e);
				}
				callback(null,projectid);
			});
		}
	],function(err,data){
		if(err) return done(err.message.error,err.message.errorType,err.message.data);
		return done(false,"",data);
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
		if(!proj) return callback(true,"No Project Record Found.",proj);
		var arProjs = [];
		for(var i=0;i<proj.length;i++){
			arProjs.push(proj[i]._id);
		}
		User.findOneAndUpdate({"_id":data._id},{$addToSet:{"projects":arProjs}},{ upsert: false },function(er,users){
			if(err) throw err;
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
	Projects.findOneAndUpdate({"projectname":data.projectname},{$pull:{"builds":{"_id":{$in:data.builds}}}},{upsert:false,multi:true},function(err, obj) {
		if(err) throw err;
		callback(false,"",obj);
	});
};

function getProjectInfo(arProjects,index,count, userObj, callback){
	Projects.find({"_id":{$in:arProjects}},{"_id":1,"projectname":1},function(err,projects){
		if(err)throw err;
		return callback(index,count,userObj,projects);
	}).sort({'projectname': 1});
}

/* 
*	Get All list of Users
*/
ProjectFactory.prototype.getListOfUsers = function(data,callback){
  		User.find({},{"fullname":1,"role":1,"projects":1},function(err, list) {
  			if(err)throw err;
  			if(!list)return callback(false,"",list);
			var result = [];
			var len = list.length;
			for(var i in list){
				getProjectInfo(list[i].projects,i,len,list[i].toJSON(),function(index,cnt,uobj,projects){
					uobj.projects = projects;
					result.push(uobj);
					//console.log(result.length,cnt);
					if(result.length === cnt){
						//console.log(result);
						return callback(false,"",result);
					}
				});
			}
  		}).sort({'projectname': 1});
};

ProjectFactory.prototype.getAllProjectList = function(data,callback){
		Projects.find({},{"_id":1,"projectname":1},function(err,projects){
			if(err)throw err;
			return callback(false,"",projects);
		}).sort({'projectname': 1});
};

ProjectFactory.prototype.updateProjectAndRoleInfoByUserId = function(data,callback){
	Projects.find({"_id":{$in:data.projects}},{"_id":1,"projectname":1},function(err, proj) {
		if(err) throw err;	
		if(!proj) return callback(true,"No Project Record Found.",proj);
		var arProjs = [];
		for(var i=0;i<proj.length;i++){
			arProjs.push(proj[i]._id);
		}
		//,$addToSet:{"role":data.role}
		//db.users.update({"_id":"userid_38"},{$set:{projects:["projectid_6","projectid_4"],role:["user"]}});
		User.findOneAndUpdate({"_id":data._id},{$set:{"projects":data.projects,"role":data.role}},{upsert:true,multi:false},function(er,users){
			if(err) throw err;
			if(!users) return callback(true,"No User Found",users);
			return callback(false,"",users);
		});
	});
};

ProjectFactory.prototype.getAllRole = function(data,callback){
		Role.find({},{"_id":0,"role":1},function(err,roles){
			if(err)throw err;
			return callback(false,"",roles);
		}).sort({'role': 1});
};
// Not tested yet
ProjectFactory.prototype.editProjectInfo = function(data,callback){
		Projects.findOneAndUpdate({"_id":data._id},{$set:{'buildlocation':data.buildlocation,'buildbatchfile':data.buildbatchfile,'status':data.status,'git.url':data.git.url,'git.username':data.git.username,'git.password':data.git.password}},function(err,project){
			if(err)throw err;
			if(!project) return callback(true,"No Project Found.",project);
			return callback(false,"",data._id);
		});
};

ProjectFactory.prototype.saveAutoBuildDetails = function(data,user,callback){
		BuildDump.findOne({"_id":data.builddumpid},function(er1,dmpBld){
			if(er1) throw er1;
			if(!dmpBld) return callback(true,"No build present.",null);
			var arg =  {
				"projectname" : dmpBld.projectname,
				"builds":[
					{
						"buildname" : data.name,
						"appversion" : data.appversion,
						"buildnum" : data.buildversion,
						"filename" : dmpBld.filename,
						"createdby" : user.fullname,
						"description" : data.description,
						"build_user_id": user._id,
						"build_userfullname": user.fullname
					}
				]
			};
			new ProjectFactory().addBuildsInProject (arg,function(arg1,arg2,arg3){
				var savedFilePath = path.join(config.uploadFilePath,dmpBld.filename);
				fsex.copy(dmpBld.relativepath, savedFilePath, { replace: true }, function (errFile) {
						  if (errFile) throw errFile;
						  buildObj.clearDumpBackup(path.parse(dmpBld.clonefolder).name);
						  return callback(arg1,arg2,arg3);
				});
			});
		});
};
module.exports = ProjectFactory;