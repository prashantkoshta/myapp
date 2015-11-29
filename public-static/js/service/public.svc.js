'use strict';
app.service('publicSvc', function($http,$q) {
    
	return {
		"onFrogotSubmit" : onFrogotSubmit
	}
	
	function onFrogotSubmit(email){
        var defer = $q.defer();
        var url = "/auth/forgot"+"/"+email;
		$http.get(url).success(function(response){
			defer.resolve(response);
		}).error(function(err){
			defer.reject(err);
		});
		return defer.promise;
	}
	
});