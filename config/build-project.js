'use strict';
var fayeConf        = require('./faye-conf.js');
var os 				= require('os');
var spawn 			= require('child_process').spawn; 
var flagBuildDone 	= false;
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
	flagBuildDone = false;
	var ls;
	if(os.type() === "Windows_NT"){
		ls = spawn('cmd.exe', ['/c', 'buildbatch.bat '+data.giturl+' '+data.tempdirname+' '+data.batchfilename+' '+data.projectdirname+' '+data.outputfilepath+' '+data.dumpingbuildPath+'']);
	}else if(os.type() === "OS X "){
		//ls = spawn('bash', ['buildbatch.sh']);
	}else{
		ls = spawn('bash', ['-c','./testbatch '+data.giturl+' '+data.tempdirname+' '+data.batchfilename+' '+data.projectdirname+' '+data.outputfilepath+' '+data.dumpingbuildPath+'']);
		//ls = spawn('bash', ['buildbatch.sh']);
	}
	ls.stdout.on('data', function (data) {
		var str = data.toString('utf8');
		fayeConf.pulishMessage('/channel-1', { msg: {"mode":"stdout", "error":false,"data":str}});
		if(str.indexOf("SUCCESSFULLCOMPLETEDBUILDTOKEN") > -1){
			flagBuildDone = true;
		}
		callback({"mode":"stdout", "error":false,"data":str});
	});

	ls.stderr.on('data', function (data) {
	    fayeConf.pulishMessage('/channel-1', { msg: {"mode":"stderr", "error":true,"data":data.toString('utf8')}});
		callback({"mode":"stderr", "error":true,"data":data.toString('utf8')});
	});
	
	ls.on('close', function (code) {
	    fayeConf.pulishMessage('/channel-1', { msg: {"mode":"close", "error":false,"data":flagBuildDone}});
		if(flagBuildDone){
			callback({"mode":"close", "error":false,"data":flagBuildDone});
		}
	})

	ls.on('exit', function (code) {
		fayeConf.pulishMessage('/channel-1', { msg: {"mode":"exit", "error":false,"data":code}});
	});
}
module.exports = new BuildProject();