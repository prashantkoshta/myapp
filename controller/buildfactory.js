// load up the user model
var path = require('path');
var fs = require('fs'); //File System - for file manipulation
var BuildInfo = require('../models/buildinfo');
var buildObj = require('../config/build-project');
var fayeConf = require('../config/faye-conf');
var config = require('../config/config');
var User = require('../models/user');
var BuildDump = require('../models/builddump');
var Projects = require('../models/projects');
var mongoose = require('mongoose');
var UPLOAD_FILE_SIZE = 1 * 1024 * 1024;
var ALLOWD_FILE_TYPE = ".zip,.txt,.apk,.ipa,.war";
var ProjectFactory = require('../controller/project-factory');
var async    = require('async');
var genrateKey = require('../config/genratekey');
module.exports = (function() {
	
	function getBuildInfoForPublish(req,res,done){
		var data = req.body;
		async.waterfall([
			function(callback){
				// Query
				// db.projects.findOne({"_id" : "projectid_6"},{"builds":{$elemMatch:{"_id" :{$in:["buildid_8"]}}},"projectname":1});
				Projects.findOne({"projectname":data.projectname},{"builds":{$elemMatch:{"_id" :{$in:data.builds}}},"projectname":1},function(e,proj){
					if(e) throw e;
					if(!proj) callback(new Error(true),"", proj);
					if(!proj.builds) return(false,"",proj);
					var obj = proj.builds[0];
					var msgData = {
						"_id" : proj._id,
						"ProjectName" : proj.projectname,
						"Title" : obj.buildname,
						"CreatedBy" : obj.createdby,
						"URL" : config.baseURLPath + "/buildapp/gateway/downloadfile/"+obj.filename,
						"APP_V " : obj.appversion,
						"BNO" : obj.buildnum 
					};
					return callback(null,msgData,proj);
				});
			},
			function(msgData,projObj,callback){
				User.find({"projects" : {$in:[projObj._id]}},{mobiletoken:1,_id:0}, function(err1, tokens) {
					if(err1) throw err1;
					var arMobileTokens = [];
					for(var i =0;i<tokens.length;i++){
						arMobileTokens.push(tokens[i].mobiletoken);
					}
					callback(null,{"msgObj":msgData,"senders":arMobileTokens});
				});
			}
		],function(err,data){
			if(err) done(true,"",{});
			done(false,"",data);
		});
		
	}
	
	function getBuildInfo(callback){
		BuildInfo.find(function(err, buildlist) {
			if(err){
                throw err;
			}
			if(!buildlist) {
			    return callback(false,null);  
			}
			return callback(true,buildlist);
		}).sort({'builddate': -1});
	}
	
	function addBuildDetails (arBuild,callback){
		
	}
	
	function getTimeStamp(){
		var d = new Date();
		var seq = d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate()+""+d.getHours()+(d.getMinutes()+1)+""+d.getSeconds()+""+d.getMilliseconds();
	    return seq;
	}
	
	function saveBuildInfo(obj,callback){
		var data = {
			"projectname" : obj.projectname,
			"builds":[
				{
					"buildname" : obj.name,
					"appversion" : obj.appversion,
					"buildnum" : obj.buildversion,
					"filename" : obj.filename,
					"createdby" : obj.createdby,
					"description" : obj.description,
					"build_user_id": obj.build_user_id,
					"build_userfullname": obj.build_userfullname
				}
			]
		};
		var projFactory = new ProjectFactory();
		projFactory.addBuildsInProject(data,function(errorFlag,erroType,result){
			return callback(true,result);
		});		
	}
	
	function onFileUpload(req,res,callback){
		var fstream;
	    req.pipe(req.busboy);
	    var fromData = {};   
	    req.busboy.on('file', function (fieldname, file, filename) {
	    	var ext = filename.substring(filename.lastIndexOf("."),filename.length);
	    	var isDel = false; 
	    	if(ALLOWD_FILE_TYPE.indexOf(ext.toLowerCase())> -1){
	    		 var fileSufix = getTimeStamp();
	    		 var newFileName = filename.substring(0,filename.lastIndexOf("."));
	    		 newFileName= newFileName+"_"+fileSufix+ext.toLowerCase();
				 fstream = fs.createWriteStream(config.uploadFilePath+"/"+newFileName);
		         file.pipe(fstream);
		         file.on('data', function() {
			         if(!isDel && fstream.bytesWritten < UPLOAD_FILE_SIZE){
			        	 // load
			         }else{
			        	 isDel = true;
			        	 fstream = null;
			         }
	            });
		       
		         file.on('end', function() {
		        	 // to do
		         });
		         
		         fstream.on('finish', function (e) {
		        	if(!isDel){
			    		fromData["ostype"] = ext.substring(1,ext.length);
			    		fromData["filename"] = newFileName;
			    		fromData["createdby"] = req.user.fullname;
						fromData["build_user_id"] = req.user.id;
						fromData["build_userfullname"] = req.user.fullname;
			         	saveBuildInfo(fromData,function(bool,data){
			        		if(bool){
			        			callback(false,"",data);
			        		}else{
			        			callback(true,"",data);
			        		}
			        	});
		        	}else{
		        		fs.unlink(config.uploadFilePath+"/"+newFileName, function(err) {
		        			if(err){
		                        throw err;
		        			}
	        			});
		        		callback(true,"fileSizeError",null);
		        	}
		         });
	    	}else{
	    		//res.json({ 'error': true, 'errorType': "fileTypeError", "data": null });
	    		callback(true,"fileTypeError",null);
	    	}
	    });
	    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
	        fromData[fieldname] = val;
	    });
	}
	
	function delBuildInfo(req, res, callback){
		var ar = req.body;
		for(var key in ar) {
			BuildInfo.remove({"_id":ar[key]._id},function(err, buildlist) {
				if(err){
	                throw err;
				}
			});
	    }
		return callback(true,"",null);
	}
	
	function getRepoUrl(proj){
		var repourl= "";
		// https://github.com/username/repository.git
		// For GIT https://username:password@github.com/username/repository.git
		//console.log(proj.git, proj.svn,proj.git.length,proj.svn.length,proj.svn.url,proj.git.url);
		if(proj.git!== undefined && proj.git!== null && proj.git.url !== undefined && proj.git.url !== null){
			var git = proj.git;
			var arGituri = git.url.split("//");
			if(git.username!== undefined && git.username!== null && git.password!== undefined && git.password!== null){
				repourl = arGituri[0]+"//"+git.username+":"+git.password+"@"+arGituri[1];
			}else{
				repourl = git.url;
			}
		}else if(proj.svn!== undefined && proj.svn!== null && proj.svn.url !== undefined && proj.svn.url !== null){
			// For SVN
			//svn checkout svn://github.com/prashantkoshta/Test1.git --username XXXX --password YYYY
			var svn = proj.svn;
			if(svn.username!== undefined  && svn.username!== null && svn.password!== undefined && svn.password!== null){
				repourl = svn.url+" --username "+svn.username+" --password "+svn.password;
			}else{
				repourl = svn.url;
			}
		}
		
		//console.log("repourl :"+repourl);
		return repourl;
	}
	
	function getProNameFromRepoUrl(proj){
		var p;
		if(proj.git!== undefined && proj.git!== null && proj.git.url !== undefined && proj.git.url !== null){
			p = path.parse(proj.git.url);	
		}else if(proj.svn!== undefined && proj.svn!== null && proj.svn.url !== undefined && proj.svn.url !== null){
			p = path.parse(proj.svn.url);
		}
		//console.log(p.name);
		return p.name;
	}
	
	function buildProject(req, res ,callback){
		var jsonData = req.body;
		Projects.findOne({"projectname" :jsonData.projectname},function(err,proj){
			if(err)throw err;
			if(!proj) return callback(true,"No Project Found",null);  
			
				
			var batchParamData = {
				"url" : getRepoUrl(proj),
				"tempdirname" : proj._id+getTimeStamp(),
				"buildtype" : proj.buildtype,
				"batchfilename" : proj.buildbatchfile,
				"projectdirname" : getProNameFromRepoUrl(proj),
				"outputfilepath" : proj.buildlocation,
				"dumpingbuildPath" : config.buildDumpingLocation,
				"repotype" : "git"
			}
			callback(false,"",{});
			/*
			echo %giturl%
			echo %tempdirname%
			echo %batchfilename%
			echo %projectdirname%
			echo %outputfilepath%
			*/
				var chanelName = "/"+req.user.uinkey;
				
				buildObj.buildNow(batchParamData, chanelName, function(arg){
				//fayeConf.pulishMessage('/channel-1', { msg: {"mode":"callback check", "error":false,"data":"I am done thanks."}});
				if(arg.mode === "close"){
					if(arg.data === 0){
						var buildDump = new BuildDump();
						buildDump.build_user_id = req.user._id,
						buildDump.isSave = 1;
						buildDump.relativepath = path.join(batchParamData.dumpingbuildPath,batchParamData.tempdirname,batchParamData.projectdirname,batchParamData.outputfilepath);
						buildDump.clonefolder = path.join(batchParamData.dumpingbuildPath,batchParamData.tempdirname);
						buildDump.projectid = proj._id;
						buildDump.projectname  = proj.projectname;
						var pObj = path.parse(buildDump.relativepath);
						buildDump.filename = batchParamData.tempdirname+pObj.ext;
						genrateKey.genrateNewIndexId("builddumpid",function(arg){
							buildDump._id = arg;
							buildDump.save(function(er1, obj) {
								if(er1) throw er1;
								fayeConf.pulishMessage(chanelName, { msg: {"mode":"completed", "error":false,"data":{'builddumpid':buildDump._id}}});
								//callback(false,"",{'builddumpid':buildDump._id});
							});
						});						
					}else{
						//callback(true,"",null);
						fayeConf.pulishMessage(chanelName, { msg: {"mode":"fail", "error":false,"data":null}});
					}
					
				}
			});
			
			
			
			
			
			
		});
		
		
		
		
	}
	
	function subscribeForBuildInfo(req,res,callback){
		var _id = req.user._id;
		var mtoken = req.params.mobiletoken;
		User.findOneAndUpdate({'_id': _id},{"mobiletoken":mtoken},{upsert:true},function(err, buildlist) {
			if(err) throw err;
			return callback(false,"",null);
		});
	}
	
	function unsubscribeForBuildInfo(req,res,callback){
		var _id = req.user._id;
		User.findOneAndUpdate({'_id': _id},{"mobiletoken":null},{upsert:true},function(err, buildlist) {
			if(err) throw err;
			return callback(false,"",null);
		});
	}
	

	
	return({
		getBuildInfo : getBuildInfo,
		saveBuildInfo : saveBuildInfo,
		delBuildInfo : delBuildInfo,
		getTimeStamp : getTimeStamp,
		onFileUpload : onFileUpload,
		buildProject : buildProject,
		subscribeForBuildInfo : subscribeForBuildInfo,
		unsubscribeForBuildInfo : unsubscribeForBuildInfo,
		getBuildInfoForPublish :getBuildInfoForPublish
	});
})();
