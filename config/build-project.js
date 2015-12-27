'use strict';
var config 			= require('./config');
var fayeConf        = require('./faye-conf.js');
var os 				= require('os');
var spawn 			= require('child_process').spawn; 
var BuildProject  	= function(){};
BuildProject.prototype.buildNow = function(data,callback) {
		/*  arg data
			echo %giturl%
			echo %tempdirname%
			echo %batchfilename%
			echo %projectdirname%
			echo %outputfilepath%
			echo %dumpingbuildPath%
			*/
	var ls;
	if(os.type() === "Windows_NT"){
		ls = spawn('cmd.exe', ['/c', ''+config.batchfile.windows+' '+data.giturl+' '+data.tempdirname+' '+data.batchfilename+' '+data.projectdirname+' '+data.outputfilepath+' '+data.dumpingbuildPath+'']);
	}else if(os.type() === "OS X "){
		//ls = spawn('bash', ['buildbatch.sh']);
	}else{
		ls = spawn('bash', ['-c',''+config.batchfile.linux+' '+data.giturl+' '+data.tempdirname+' '+data.batchfilename+' '+data.projectdirname+' '+data.outputfilepath+' '+data.dumpingbuildPath+'']);
	}
	ls.stdout.on('data', function (data) {
		var str = data.toString('utf8');
		fayeConf.pulishMessage('/channel-1', { msg: {"mode":"stdout", "error":false,"data":str}});
		//callback({"mode":"stdout", "error":false,"data":str});
	});

	ls.stderr.on('data', function (data) {
	    fayeConf.pulishMessage('/channel-1', { msg: {"mode":"stderr", "error":true,"data":data.toString('utf8')}});
		//callback({"mode":"stderr", "error":true,"data":data.toString('utf8')});
	});
	
	ls.on('close', function (code) {
	    fayeConf.pulishMessage('/channel-1', { msg: {"mode":"close", "error":false,"data":code}});
	    callback({"mode":"close", "error":false,"data":code});
	})

	ls.on('exit', function (code) {
		fayeConf.pulishMessage('/channel-1', { msg: {"mode":"exit", "error":false,"data":code}});
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
module.exports = new BuildProject();