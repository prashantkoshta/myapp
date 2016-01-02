'use strict';
var config 			= require('./config');
var fayeConf        = require('./faye-conf.js');
var os 				= require('os');
var spawn 			= require('child_process').spawn; 
var Batch 			= require('../models/batch');
var BuildProject  	= function(){};


BuildProject.prototype.buildNow = function(data,chanelName,callback) {
	/*  arg data
	echo %giturl%
	echo %tempdirname%
	echo %batchfilename%
	echo %projectdirname%
	echo %outputfilepath%
	echo %dumpingbuildPath%
	*/
	console.log(data.batchfilename);
	Batch.findOne({"batchfile":data.batchfilename},function(err,batch){
		if(err) throw err;
		if(!batch)return callback(true,"No Batch File Mapping Found.",null);
		buildProject.executeBatchFile(data,chanelName,batch.batchfile,function(data){
			callback(data);
		});
	});
	
}

BuildProject.prototype.executeBatchFile = function(data,chanelName,batchfile,callback) {
		/*  arg data
			echo %giturl%
			echo %tempdirname%
			echo %batchfilename%
			echo %projectdirname%
			echo %outputfilepath%
			echo %dumpingbuildPath%
			*/
	var argString = ' '+data.giturl+' '+data.tempdirname+' '+data.batchfilename+' '+data.projectdirname+' '+data.outputfilepath+' '+data.dumpingbuildPath+'';	
	var ls;
	var file;
	if(os.type() === "Windows_NT"){
		file = config.batchfile.windows+'/'+batchfile+'.bat'
		console.log(file);
		ls = spawn('cmd.exe', ['/c', ''+file+argString]);
	}else if(os.type() === "OS X "){
		//ls = spawn('bash', ['buildbatch.sh']);
	}else{
		file = config.batchfile.linux+'/'+batchfile;
		ls = spawn('bash', ['-c',''+file+argString]);
	}
	ls.stdout.on('data', function (data) {
		var str = data.toString('utf8');
		fayeConf.pulishMessage(chanelName, { msg: {"mode":"stdout", "error":false,"data":str}});
		//callback({"mode":"stdout", "error":false,"data":str});
	});

	ls.stderr.on('data', function (data) {
	    fayeConf.pulishMessage(chanelName, { msg: {"mode":"stderr", "error":true,"data":data.toString('utf8')}});
		//callback({"mode":"stderr", "error":true,"data":data.toString('utf8')});
	});
	
	ls.on('close', function (code) {
	    fayeConf.pulishMessage(chanelName, { msg: {"mode":"close", "error":false,"data":code}});
	    callback({"mode":"close", "error":false,"data":code});
	})

	ls.on('exit', function (code) {
		fayeConf.pulishMessage(chanelName, { msg: {"mode":"exit", "error":false,"data":code}});
	});
}

BuildProject.prototype.clearDumpBackup = function(folderName) {
	var ls;
	if(os.type() === "Windows_NT"){
		console.log('Called Me ',config.dumpcleanbatchfile.windows+' '+folderName+' '+config.buildDumpingLocation+'');
		ls = spawn('cmd.exe', ['/c', ''+config.dumpcleanbatchfile.windows+' '+folderName+' '+config.buildDumpingLocation+'']);
	}else if(os.type() === "OS X "){
		//ls = spawn('bash', ['buildbatch.sh']);
	}else{
		ls = spawn('bash', ['-c',''+config.dumpcleanbatchfile.linux+' '+folderName+' '+config.buildDumpingLocation+'']);
	}
}
var buildProject = new BuildProject();
module.exports = buildProject;