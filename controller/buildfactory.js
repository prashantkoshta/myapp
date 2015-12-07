// load up the user model
var path = require('path'); //used for file path
var fs = require('fs'); //File System - for file manipulation
var BuildInfo = require('../models/buildinfo');
var buildObj = require('../config/build-project');
var fayeConf = require('../config/faye-conf');
var config = require('../config/config');
var User = require('../models/user');
var Projects = require('../models/projects');
var mongoose = require('mongoose');
var UPLOAD_FILE_SIZE = 1 * 1024 * 1024;
var ALLOWD_FILE_TYPE = ".zip,.txt,.apk,.ipa";

module.exports = (function() {
	function getBuildInfoForPublish(req,res,callback){
		var data = req.body;
		for(var j =0;j<data.builds.length;j++){
			data.builds[j] = mongoose.Types.ObjectId(data.builds[j]);
		}
		Projects.findOne({"projectname":data.projectname},function(e,proj){
			if(e) throw e;
			if(!proj) {
			    return callback(false,"",null);  
			}
			
			BuildInfo.findOne({"_id":data.builds[0]}, function(err, obj) {
				if(err) throw err;
				
				if(!obj) {
				    return callback(false,"",null);  
				}
				
				var data = {
					"ProjectName" : proj.projectname,
					"Title" : obj.buildname,
					"CreatedBy" : obj.createdby,
					"URL" : config.baseURLPath + "/downloadfile/:"+obj.filename,
					"APP_V " : obj.appversion,
					"BNO" : buildnum 
				};
				return callback(true,"",data);
			});
		})
		
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
		var objBuild = new BuildInfo();
		objBuild.builddate = new Date();
		objBuild.buildname = obj.name;
		objBuild.ostype = obj.ostyle;
		objBuild.appversion = obj.appversion;
		objBuild.buildnum = obj.buildversion;
		objBuild.filename = obj.filename;//"aa.apk";
		objBuild.createdby = obj.createdby; //req.session["userid"];
		objBuild.description = obj.description;
		objBuild.save(function(err,build) {
            if (err){
                throw err;
            }		
            return callback(true,build);
        });
		
	}
	
	function onFileUpload(req,res,callback){
		var fstream;
	    req.pipe(req.busboy);
	    var fromData = {};   
	    req.busboy.on('file', function (fieldname, file, filename) {
	    	var ext = filename.substring(filename.lastIndexOf("."),filename.length);
	    	console.log(ext,filename);
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
			         	console.log("return 1....");
			    		fromData["ostype"] = ext.substring(1,ext.length);
			    		fromData["filename"] = newFileName;
			    		fromData["createdby"] = req.user.local.firstname + "  "+ req.user.local.lastname;
						console.log("fromData:",fromData);
			         	saveBuildInfo(fromData,function(bool,data){
			        		if(bool){
			        			//res.json({ 'error': false, 'errorType': "", "data": null });
			        			callback(false,"",data);
			        		}else{
			        			//res.json({ 'error': true, 'errorType': "", "data": null });
			        			callback(true,"",data);
			        		}
			        	});
		        	}else{
		        		fs.unlink(config.uploadFilePath+"/"+newFileName, function(err) {
		        			if(err){
		                        throw err;
		        			}
	        			   console.log("File deleted successfully!", newFileName);
	        			});
		        		//res.json({ 'error': true, 'errorType': "fileSizeError", "data": null });
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
	
	function buildProject(req, res ,callback){
		var jsonData = req.body;
		Projects.findOne({"projectname" :jsonData.projectname},function(err,proj){
			if(err)throw err;
			if(!proj) {
			    return callback(true,"No Project Found",null);  
			}
			
			var batchParamData = {
				"giturl" : proj.git.url,
				"tempdirname" : proj._id+getTimeStamp(),
				"batchfilename" : proj.buildbatchfile,
				"projectdirname" : proj.git.url.substring(proj.git.url.lastIndexOf("/")+1,proj.git.url.length),
				"outputfilepath" : proj.buildlocation
			}
			/*
			echo %giturl%
			echo %tempdirname%
			echo %batchfilename%
			echo %projectdirname%
			echo %outputfilepath%
			*/
			console.log(batchParamData);
			
				buildObj.buildNow(batchParamData, function(arg){
				//fayeConf.pulishMessage('/channel-1', { msg: {"mode":"callback check", "error":false,"data":"I am done thanks."}});
				//console.log("factory :",arg);
				//console.log("XXBefor IF XX I am done");
				if(arg.mode === "close" && arg.data === true){
					console.log("XXXX I am done");
					var fromData = new Object();
					fromData.builddate = new Date();
					fromData.buildname = "auto uplodaed test";
					fromData.ostype = ".zip";
					fromData.appversion = "av";
					fromData.buildnum = "bv";
					fromData.filename = "autoupload"+getTimeStamp()+".apk";
					fromData.createdby = "test"; //req.session["userid"];
					fromData.description = "Test test";
					saveBuildInfo(fromData,function(bool,data){
							if(bool){
								//res.json({ 'error': false, 'errorType': "", "data": null });
								console.log("Added");
								callback(false,"",null);
							}else{
								//res.json({ 'error': true, 'errorType': "", "data": null });
								callback(true,"",null);
							}
						});
				}
			});
			
			
			
			
			
			
		});
		
		
		
		
	}
	
	function subscribeForBuildInfo(req,res,callback){
		//	callback(true,"fileSizeError",nul
		var email = req.user.local.email;
		var mtoken = req.params.mobiletoken;
		User.findOne({'local.email' : email },function(err, buildlist) {
			if(err){
                		throw err;
			}
			if(!buildlist) {
			    return callback(false,"Invalid",null);  
			}
			/*User.update({"local.email": email}, {"$set": { "mobiletoken" : mtoken},{ upsert: false},function (err, result) {
				if (err)
					throw err;
				return callback(true,"Done",null);  
			});*/
			return callback(false,"",null);
		});
	}
	
	function unsubscribeForBuildInfo(req,res,callback){
		var email = req.user.local.email;
		var mtoken = req.params.mobiletoken;
		User.findOne({'local.email' : email },function(err, buildlist) {
			if(err){
                		throw err;
			}
			if(!buildlist) {
			    return callback(false,"Invalid",null);  
			}
		
			/*User.update({"local.email": email}, {"$set": { "mobiletoken" : null}, { upsert: false},function (err, result) {
				if (err)
					throw err;
				return callback(true,"Done",null);  
			});*/
			
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
