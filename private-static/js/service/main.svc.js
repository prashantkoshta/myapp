'use strict';
app.service('mainSvc', function($http,$q, $rootScope,$window) {
	
	
	function pushMessageData(){
		var defer = $q.defer();
        	var url = "/message";
        	var data = {message: 'Client 1:'};
		$http.post(url,data).success(function(response){
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
	
	function addBuildInProjectd(data){
		var defer = $q.defer();
        var url = "/buildapp/gateway/addBuildsInProject";
		$http.post(url,data).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function getBuildDetails(data){
		var defer = $q.defer();
        var url = "/buildapp/gateway/projectBuilds";
		$http.post(url,data).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function delBuild(data){
		var defer = $q.defer();
        var url = "/buildapp/gateway/deleteBuild";
		$http.post(url,data).success(function(response){
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
	
	/*
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
	*/	
	/*function getProjectList(){
		var defer = $q.defer();
        var url = "buildapp/gateway/listOfProjects";
		$http.get(url).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}*/
	
	function postCommon(url,data) {
		var defer = $q.defer();
		$http({"method": "post", "data":data, "url":url, headers: {"token": $rootScope.token}})
		.success(function(response,status, headers, config){
			if(response["auth-error"]) {
				var er = new Error();
				er.message = response;
				defer.reject(er);
				$window.location.href = "/";
			} else {
				defer.resolve(response);
				$rootScope.token = 	headers("token");
			}
		}).error(function(err,status){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function getCommon(url,data){
		var defer = $q.defer();
		$http({"method": "get", "data":data, "url":url, headers: {"token": $rootScope.token}})
		.success(function(response,status, headers, config){
			if(response["auth-error"]) {
				var er = new Error();
				er.message = response;
				defer.reject(er);
				$window.location.href = "/";
			} else {
				defer.resolve(response);
				$rootScope.token = 	headers("token");
			}
		}).error(function(err,status){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	return {
		//"changePassword" : changePassword,
		"getBuildDetails" : getBuildDetails,
		"delBuild" : delBuild,
		"saveBuildData" : saveBuildData,
		"publishBuildDetails" : publishBuildDetails,
		"autoBuildProject":autoBuildProject,
		"pushMessageData":pushMessageData,
		"addBuildInProjectd" : addBuildInProjectd,
		"postCommon" :postCommon,
		"getCommon" : getCommon
	};
	
});
