'use strict';
app.service('mainSvc', function($http,$q) {
	
	
	function pushMessageData(){
		var defer = $q.defer();
        	var url = "/message";
        	var data = {message: 'Client 1:'};
		$http.post(url,).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
		/*var url = 'http://localhost:8123/message';
				
    		        var message = {message: 'Client 1: ' + $chat.val()};
    		        var dataType = 'json';
    		        $.ajax({
    		            type: 'POST',
    		            url: url,
    		            data: message,
    		            dataType: dataType,
    		        });
    		        $chat.val('');*/
	
	function autoBuildProject(){
		var defer = $q.defer();
        	var url = "/buildapp/gateway/buildProjectAndDeploy";
		$http.get(url).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function publishBuildDetails(){
		var defer = $q.defer();
        	var url = "/buildapp/gateway/publishBuildInfo";
		$http.get(url).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function getBuildDetails(){
		var defer = $q.defer();
        var url = "/buildapp/gateway/getDetails";
		$http.get(url).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function delBuild(ar){
		var defer = $q.defer();
        var url = "/buildapp/gateway/deleteBuildInfo";
		$http.post(url,ar).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function saveBuildData(data){
		var defer = $q.defer();
        var url = "/buildapp/gateway/saveBuildInfo";
		$http.post(url,data).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function changePassword(oPwd,nPwd){
        var defer = $q.defer();
		//auth/changepassword/:opwd/:npwd
        var url = "/auth/changepassword";
		$http.post(url,{"oPwd":oPwd,"nPwd":nPwd}).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	return {
		"changePassword" : changePassword,
		"getBuildDetails" : getBuildDetails,
		"delBuild" : delBuild,
		"saveBuildData" : saveBuildData,
		"publishBuildDetails" : publishBuildDetails,
		"autoBuildProject":autoBuildProject,
		"pushMessageData":pushMessageData
	};
	
});
