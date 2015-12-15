/**
 * New node file
 */
app.service("multipartFormSvc",["$http","$q","$rootScope",function($http,$q,$rootScope){
	this.post = function (uploadUrl,data){
		var fd = new FormData();
		for(var key in data){
				fd.append(key,data[key]);
		}
		/*$http.post(uploadUrl,fd,{
			transformRequest : angular.identity,
			headers : {"Content-Type" : undefined}
		});*/
		
		var defer = $q.defer();
		$http.post(uploadUrl,fd,{
			transformRequest : angular.identity,
			headers : {"Content-Type" : undefined,"token": $rootScope.token}
		}).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
}]);