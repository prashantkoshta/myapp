// load up the user model
var BuildInfo  = require('../models/buildinfo');

module.exports = (function() {
	
	function getBuildInfo(callback){
		BuildInfo.find(function(err, buildlist) {
			if(err){
                throw err;
			}
			if(!buildlist) {
			    return callback(false);  
			}
			return callback(true,buildlist);
		});
	}
	
	function saveBuildInfo(arBuild,callback){
		var objBuild = new BuildInfo({
			builddate : new Date(),
			buildname : "112",
			ostype : "112",
			appversion : "112",
			buildnum : "112",
			filename : "aa.apk",
			createdby : "112"
		});
		
		BuildInfo.save(arBuild,function(err) {
            if (err){
                throw err;
            }
            return callback(true);
        });
	}
	
	function delBuildInfo(arBuildObj,callback){
		
	}
	
	return({
		getBuildInfo : getBuildInfo,
		saveBuildInfo : saveBuildInfo,
		delBuildInfo : delBuildInfo
	});
})();