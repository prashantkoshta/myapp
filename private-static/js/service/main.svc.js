'use strict';
app.service('mainSvc', function($http,$q) {
    
	return {
		"changePassword" : changePassword
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
	
});