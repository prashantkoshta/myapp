'use strict';
app.controller('loginController', function($scope,$rootScope,validatorFactory,publicSvc) {
	var isValid = false;
	console.log($rootScope.loginError);
	$scope.loginAction = {
		email : "",
		password : "",
		// Falgs
		isInalidEmailId : false,
		isInvalidPassword : false,
		//server side error message
		
		isInalidEmailId_Password : $rootScope.loginError,
		
		
		submitLogin: function(event){
			this.isInalidEmailId_Password = false;
			this.doValidation();
			if(this.isInalidEmailId || this.isInvalidPassword){
				event.preventDefault();
			}
		},
		
		doValidation : function(){
			this.isInalidEmailId = !validatorFactory.isValidEmailId(this.email);
			this.isInvalidPassword = !validatorFactory.isValidPassword(this.password);
		}
		
		
	};
	
	
});