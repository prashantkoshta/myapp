'use strict';
var fayeConf          = require('./faye-conf.js');
var spawn = require('child_process').spawn,ls; 
var BuildProject  = function(){
  
};

BuildProject.prototype.buildNow = function(callback) {

	if(ls!= undefined){
		//console.log(ls.id);
		process.kill(ls.pid);
	}
	//ls = spawn('cmd.exe', ['/c', 'buildbatch.bat']);
	ls = spawn('bash', ['buildbatch.sh']);
	ls.stdout.on('data', function (data) {
		//console.log('stdout: ' + data);
		fayeConf.pulishMessage('/channel-1', { msg: {"mode":"stdout", "error":false,"data":data.toString('utf8')}});
		callback({"mode":"stdout", "error":false,"data":data.toString('utf8')});
	});

	ls.stderr.on('data', function (data) {
		//console.log('stderr: ' + data);
	        fayeConf.pulishMessage('/channel-1', { msg: {"mode":"stderr", "error":true,"data":data.toString('utf8')}});
		callback({"mode":"stderr", "error":true,"data":data.toString('utf8')});
	});
	
	ls.on('close', function (code) {
		//console.log('close: ' + code);
		//console.log("C "+ls.id);
	        fayeConf.pulishMessage('/channel-1', { msg: {"mode":"close", "error":false,"data":code}});
		callback({"mode":"close", "error":false,"data":code});
	})

	ls.on('exit', function (code) {
		//console.log('exit: ' + code);
		//console.log("e "+ls.id);
		fayeConf.pulishMessage('/channel-1', { msg: {"mode":"exit", "error":false,"data":code}});
		callback({"mode":"exit", "error":false,"data":code});
	});
}
module.exports = new BuildProject();
