// load up the user model
var path = require('path');
var fs = require('fs');
var config = require('../config/config');
var Projects = require('../models/projects');
var BuildInfo = require('../models/buildinfo');
var BuildDump = require('../models/builddump');
var ProjectTeamSchema = require('../models/projectteam');
var AccessHistory = require('../models/accesshistory');
var User = require('../models/user');
var Role = require('../models/role');
var async    = require('async');
var indexcounter    = require('../models/indexcounter');
var genrateKey = require('../config/genratekey');
var fsex = require('fs.extra');
var buildObj = require('../config/build-project');
var Batchs = require('../models/batch');
var ProjectFactory = function(){};
ProjectFactory.prototype.getProjectListByUserId = function(data,done){
	    if(data.role === "admin"){
			Projects.find({},{"_id":1,"projectname":1}, function(err1, projects) {
				if(err1) throw err1;
				done(false,"",projects);
			});
		}else{
			Projects.find({"projectteam":{$elemMatch:{"userid":data._id}}},{"_id":1,"projectname":1}, function(err1, projects) {
				if(err1) throw err1;
				done(false,"",projects);
			});
		}
  		/*async.waterfall([
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
	*/
};


ProjectFactory.prototype.createProject = function(data,done){
	console.log("Method: createProject",data);
	var newProjects = new Projects();
	newProjects.projectname = data.projectname;
	
	if(data.git !== null || data.git !==undefined){
		newProjects.git = data.git;
	}
	
	if(data.svn !== null || data.svn !==undefined){
		newProjects.svn = data.svn;
	}
	
	newProjects.status = data.status;
	newProjects.buildbatchfile = data.buildbatchfile;
	newProjects.buildlocation = data.buildlocation;
	newProjects.buildtype = data.buildtype;
	newProjects.created_user_id = data.created_user_id;
	newProjects.created_userfullname = data.created_userfullname;
	
	var member = new ProjectTeamSchema();
	member._id = data.created_user_id;
	member.userid = data.created_user_id;
	member.fullname = data.created_userfullname;
	member.allocationdate = new Date();
	member.projectrole = "projectadmin";
	member.active = 1;
	
	newProjects.projectteam = [];
	newProjects.projectteam.push(member);
	
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
		}
		/*,
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
		}*/
	],function(err,data){
		if(err) return done(err.message.error,err.message.errorType,err.message.data);
		return done(false,"",data);
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
			Projects.findOneAndUpdate({"projectname":data.projectname},{$addToSet:{"builds":{$each:arOfBuilds}}},{upsert: false },function(err, proj) {
				if(err) throw err;
				if(!proj) callback(new Error(true),"No Project Found","");
				callback(null,{_id: proj._id});
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
	// TODO 01/16 It is not working
		if(data.role === "admin"){
			Projects.find({},{"_id":1,"projectname":1,"projectteam":1},function(err, projects) {
				if(err)throw err;
				var results = [];
				for(var i in projects){
					var n  = projects[i].toJSON();
					n.editable = true;
					results.push(n); 
				}
				return callback(false,"",results);
			}).sort({'projectname': 1});
		}else{
			Projects.find({"projectteam":{$elemMatch:{"userid":data._id}}},{"_id":1,"projectname":1,"projectteam":1},function(err,projects){
				if(err)throw err;
				var results = [];
				for(var i in projects){
					var n  = projects[i].toJSON();
					n.editable = isEditable(projects[i],data._id);
					results.push(n); 
				}
				return callback(false,"",results);
			}).sort({'projectname': 1});
		}
};

function isEditable(projectDoc,userid){
	var isEdit = false;
	for(var i in projectDoc.projectteam){
		var o = projectDoc.projectteam[i];
		if(o.userid === userid && o.projectrole === "projectadmin") return true;
	}
	return false;
}

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
			// check file is present or not
			fs.stat(dmpBld.relativepath, function(er,stats){
				if(er) return callback(true,"No build file present.",null);
				if(stats.isFile()){
					new ProjectFactory().addBuildsInProject (arg,function(arg1,arg2,arg3){
						var savedFilePath = path.join(config.uploadFilePath,dmpBld.filename);
						fsex.copy(dmpBld.relativepath, savedFilePath, { replace: true }, function (errFile) {
								  if (errFile) throw errFile;
								  buildObj.clearDumpBackup(path.parse(dmpBld.clonefolder).name);
								  return callback(arg1,arg2,arg3);
						});
					});
				}else{
					return callback(true,"No build file present.",null);
				}
			});
		});
};

ProjectFactory.prototype.getAllRole = function(data,aUser,callback){
		if(aUser.role !== 'admin'){
			Role.find({role: { $ne: 'admin' }},{"_id":0,"role":1},function(err,roles){
				if(err)throw err;
				return callback(false,"",roles);
			}).sort({'role': 1});
		}else{
			Role.find({},{"_id":0,"role":1},function(err,roles){
				if(err)throw err;
				return callback(false,"",roles);
			}).sort({'role': 1});
		}
};

ProjectFactory.prototype.raiseProjectAccess = function(data,user,done){
		async.waterfall([
			function(callback){
				// Get project details
				Projects.findOne({"_id":data.projectid}, function(err, projlist) {
					if(err) throw err;	
					if(!projlist) return callback(true,"No Project Record Found.",null);
					callback(null,projlist)
					
				});
			},
			function(projlist,callback){
				// Check if already have access as a owner or approved.
				Projects.findOne({"_id":data.projectid, "projectteam":{$elemMatch:{"userid":user._id}}}, function(err, p) {
					if(err) throw err;
					if(p) return callback(true,"You already team member of this project.",null);
					callback(null,projlist)
				});
				/*	
					
				if(projlist.created_user_id === user._id) return callback(true,"You already owner of this project.",null); 
				callback(null,projlist)
				*/
			},
			function(projlist,callback){
				// Check is History already present.
				AccessHistory.findOne({"projectid":data.projectid,"requserid":user._id,"status":"pending"},{"projectid":1},function(err, list) {
					if(err)throw err;
					if(list) return callback(new Error(true),"You have already raised access for request.",null);
					callback(null,projlist);
				});
			},
			function(proj,callback){
				// Genarte Request key
				var tid = genrateKey.genrateNewIndexId("reqid",function(arg){
					callback(null,arg,proj);
				});
			},
			function(key,proj,callback){
				var  accessHistory= AccessHistory();
				accessHistory._id = key;
				accessHistory.projectid = proj._id;
				accessHistory.projectname = proj.projectname,
				accessHistory.active = 1;
				accessHistory.created_userfullname =  proj.created_userfullname;
				accessHistory.requserid = user._id;
				accessHistory.reqfullname = user.fullname;
				accessHistory.status = "pending";
				accessHistory.reqdate = new Date();
				accessHistory.save(function(err, obj) {
					if(err) throw err;
					callback(null,accessHistory._id);
				});
			}
		],function(err,data){
			if(err) return done(true,data,null);
			done(false,"",data);			
		});
	
		
};

ProjectFactory.prototype.getRequestHistory = function(user,done){
	AccessHistory.find({"requserid":user._id},{"_id":0,"requserid":0},function(err,history){
		if(err) throw err;
		done(false,"",history);
	}).sort({'reqdate': 1});
};

ProjectFactory.prototype.getReqApprovalStatusList = function(user,done){
		async.waterfall([
			function(callback){
				// Get projects by user id.
				Projects.find({"projectteam":{$elemMatch:{"userid":user._id}}},{'_id':1}, function(err,projlist) {
					if(err) throw err;	
					if(!projlist) return callback(new Error(true),"No Project found.",null);
					callback(null,projlist);
				});
			},
			function(projlist,callback){
				// Get Access History by project id.
				var arProjectId = []
				for(var i in projlist){
					console.log(">>>>>>>>>>",i);
					arProjectId.push(projlist[i]._id);
				}
				
				AccessHistory.find({"projectid":{$in:arProjectId},"status":"pending"},{"requserid":0},function(err,history){
					if(err) throw err;
					callback(null,history);
				})
			}
		],function(err,data){
			if(err) return done(true,data,null);
			done(false,"",data);			
		});
};

ProjectFactory.prototype.updateApprovalStatus = function(data,user,done){
	// TO DO...
	async.waterfall([
		function(callback){
			// Check request id  is it present.
			AccessHistory.findOne({"_id":data._id},function(err,history) {
				if(err) throw err;	
				if(!history) return callback(new Error(true),"No Request ID Found.",null);
				callback(null,history);
			});
		},
		function(history,callback){
			// Update status
			AccessHistory.findOneAndUpdate({"_id":data._id},{$set:{"status":data.status}},{multi:false},function(err,accessHistory){
				if(err) throw err;
				if(!accessHistory) return callback(new Error(true),"No Request id found",data._id);
				if(data.status === "reject"){
					callback(null,history,true);
				}else{
					callback(null,history,false);
				}
			});
		},
		function(history,boolAddProjectid,callback){
			// Add projecid in user projects
			if(boolAddProjectid) {
				callback(false,"","reject");
			}else{
				// Add projecid in porject
				var member = new ProjectTeamSchema();
				member._id = history.requserid;
				member.userid = history.requserid;
				member.fullname = history.reqfullname;
				member.allocationdate = new Date();
				member.projectrole = "user";
				member.active = 1; 
				Projects.findOneAndUpdate({"_id":history.projectid},{$addToSet:{"projectteam":member}},{upsert:true,multi:false},function(err,users){
					if(err) throw err;
					if(!users) return callback(new Error(true),"No User Found",null);
					callback(false,"","accept");
				});
				
				/*User.findOneAndUpdate({"_id":history.requserid},{$addToSet:{"projects":history.projectid}},{upsert:true,multi:false},function(err,users){
					if(err) throw err;
					if(!users) return callback(new Error(true),"No User Found",null);
					callback(false,"","accept");
				});*/
			}
		}
	],function(err,data){
		if(err) return done(true,data,null);
		done(false,"",data);			
	});
	
};

ProjectFactory.prototype.getProjectDetail = function(data,user,done){
	Projects.findOne({"_id":data.projectid,"projectteam":{$elemMatch:{"userid":user._id}}},{},function(err,project){
		if(err)throw err;
		done(false,"",project);
	}).sort({'projectname': 1});
};

ProjectFactory.prototype.editProjectInfo = function(data,user,done){
	async.waterfall([
		function(callback){
			Projects.findOne({"_id":data._id,"projectteam":{$elemMatch:{"userid":user._id,"projectrole" : "projectadmin"}}},{},function(err,project){
				if(err)throw err;
				if(!project) callback(new Error(true),"You are not Authenticated to update this project details.",null);
				callback();
			}).sort({'projectname': 1});
		},
		function(callback){
			var setObj;
			var unsetObj;
			console.log(data);
			console.log(data.git);
			if(data.git != null){
				setObj =  {"git":data.git,"buildtype":data.buildtype, "buildbatchfile" :data.buildbatchfile,"buildlocation":data.buildlocation,"status":data.status};
				unsetObj = {"svn":""};
			}else{
				setObj =  {"svn":data.svn,"buildtype":data.buildtype, "buildbatchfile" :data.buildbatchfile,"buildlocation":data.buildlocation,"status":data.status};
				unsetObj = {"git":""};
			}
			Projects.findOneAndUpdate({"_id":data._id,"projectteam":{$elemMatch:{"userid":user._id,"projectrole" : "projectadmin"}}},
			{$set : setObj,$unset:unsetObj},
			{upsert:true,multi:false},
			function(err,project){
				if(err)throw err;
				if(!project) callback(new Error(true),"Unable to update at this time.",null);
				callback(null,null);
			});
		}
	],function(err,data){
		if(err) return done(true,data,null);
		done(false,"",data);			
	});
};


ProjectFactory.prototype.deleteProject = function(data,user,done){
	Projects.remove({"_id": {$in:[data]},"projectteam":{$elemMatch:{"userid":user._id,"projectrole":"projectadmin"}}},function(err, obj) {
		if(err) throw err;
		return done(false,"",obj);
	});
};


//todo
ProjectFactory.prototype.updateProjectTeamMemberRole = function(data,user,done){
	async.waterfall([
		function(callback){
			Projects.findOne({"_id":data.projectid,"projectteam":{$elemMatch:{"userid":user._id,"projectrole" : "projectadmin"}}},{},function(err,project){
				if(err)throw err;
				if(!project) callback(new Error(true),"You are not Authenticated to update Team Details.",null);
				callback();
			}).sort({'projectname': 1});
		},
		function(callback){
			Projects.findOneAndUpdate({"_id":data.projectid,"projectteam":{$elemMatch:{"userid":data.userid}}},{"$set" : {"projectteam.$.projectrole" : data.projectrole}}
			,{ multi: false },function(err,project){
				if(err) throw err;
				callback(null,null);
			});
		}
	],function(err,data){
		if(err) return done(true,data,null);
		done(false,"",data);			
	});
};


ProjectFactory.prototype.deleteProjectTeamMember = function(data,user,done){
	async.waterfall([
		function(callback){
			Projects.findOne({"_id":data.projectid,"projectteam":{$elemMatch:{"userid":user._id,"projectrole" : "projectadmin"}}},{},function(err,project){
				if(err)throw err;
				if(!project) callback(new Error(true),"You are not Authenticated to update Team Details.",null);
				callback();
			}).sort({'projectname': 1});
		},
		function(callback){
			Projects.findOneAndUpdate({"_id": data.projectid},{$pull: {"projectteam":{"userid":data.userid,"projectrole":data.projectrole}}},
			{ multi: false },function(err, obj) {
				if(err) throw err;
				callback(null,obj);
			});
		}
	],function(err,data){
		if(err) return done(true,data,null);
		done(false,"",data);			
	});
	
};

ProjectFactory.prototype.getBatchList = function(user,done){
	Batchs.find({},{buildtype:1,desc:1},function(err,batchList){
		if(err)throw err;
		done(false,"",batchList);
	}).sort({'desc': 1});
};



module.exports = ProjectFactory;