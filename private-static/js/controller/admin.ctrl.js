'use strict';
var app = angular.module('adminMain',[]);
app.controller('adminController', function($scope, $rootScope,$http,$q) {	
	$scope.collection = ["a","b","CD"];
	//
	console.log("I am here");
	getTableList();
	
	function getTableList(){
		requestGet("/buildapp/gateway/getDetails",null).then(
            function (response) {
            	 console.log(response.data);
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	function requestGet(url,data){
		var defer = $q.defer();
        //var url = "/buildapp/gateway/saveBuildInfo";
		$http.get(url,data).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	function requestPost(url,data){
		var defer = $q.defer();
        //var url = "/buildapp/gateway/saveBuildInfo";
		$http.get(url,data).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	
	
});
