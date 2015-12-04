// load up the user model
var path = require('path'); //used for file path
var fs = require('fs'); //File System - for file manipulation
var BuildInfo = require('../models/buildinfo');
var buildObj = require('../config/build-project');
var fayeConf = require('../config/faye-conf');
var config = require('../config/config');
var UPLOAD_FILE_SIZE = 1 * 1024 * 1024;
var ALLOWD_FILE_TYPE = ".zip,.txt,.apk,.ipa";

module.exports = (function() {

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
		objBuild.save(function(err) {
            if (err){
                throw err;
            }
            return callback(true);
        });
		console.log(objBuild.builddate);
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
			         	saveBuildInfo(fromData,function(bool){
			        		if(bool){
			        			//res.json({ 'error': false, 'errorType': "", "data": null });
			        			callback(false,"",null);
			        		}else{
			        			//res.json({ 'error': true, 'errorType': "", "data": null });
			        			callback(true,"",null);
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
	
	function buildProject(afromData,callback){
		buildObj.buildNow(function(arg){
			//fayeConf.pulishMessage('/channel-1', { msg: {"mode":"callback check", "error":false,"data":"I am done thanks."}});
			console.log("factory :",arg);
			console.log("XXBefor IF XX I am done");
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
				saveBuildInfo(fromData,function(bool){
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
	}

	
	return({
		getBuildInfo : getBuildInfo,
		saveBuildInfo : saveBuildInfo,
		delBuildInfo : delBuildInfo,
		getTimeStamp : getTimeStamp,
		onFileUpload : onFileUpload,
		buildProject : buildProject
	});
})();
