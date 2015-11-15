'use strict';
app.factory('publicSvc', function($http,$q) {

	return {
		"onLogin" : onLogin
	}
	
	function onLogin(username,password){
		var defer = $q.defer();
		$http.get(url,data).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
	
});