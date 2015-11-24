'use strict';
app.controller('loginController', function($scope,$rootScope, $state, validatorFactory,publicSvc) {
    var isLoginServerError = false;
    if (typeof $rootScope.pageError!= "undefined" 
        && $rootScope.pageError != null
        && typeof $rootScope.pageError.error != "undefined"
        && typeof $rootScope.pageError.errorType != "undefined"
        && $rootScope.pageError.error === "true"
        && $rootScope.pageError.errorType === "loginError" ) {
        isLoginServerError = true
    }
    
    var isForgotError = false;
    if (typeof $rootScope.pageError != "undefined" 
        && $rootScope.pageError != null 
        && typeof $rootScope.pageError.error != "undefined" 
        && typeof $rootScope.pageError.errorType != "undefined" 
        && $rootScope.pageError.error === "true" 
        && $rootScope.pageError.errorType === "forgotError") {
        isForgotError = true
    }
    
	$scope.loginAction = {
		email : "",
		password : "",
		// Falgs
		isInalidEmailId : false,
		isInvalidPassword : false,
		//server side error message
		
        isInalidEmailId_Password : isLoginServerError,
		
		
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
	

    $scope.forgotAction = {
        email : "",
        isInalidEmailId : false,
        isInalidEmailId_Server : isForgotError,
        submitLogin: function (event) {
            this.isInalidEmailId_Server = false;
            this.doValidation();
            if (this.isInalidEmailId) {
                event.preventDefault();
            }
        },
        doValidation : function () {
            this.isInalidEmailId = !validatorFactory.isValidEmailId(this.email);
        },
        onSubmitClick : function () {
            this.isInalidEmailId_Server = false;
            this.doValidation();
            if (this.isInalidEmailId) {
                return;
            }
            var ref = this;
            publicSvc.onFrogotSubmit(this.email).then(
                function (response) {
                    if (response.error == false) {
                        $state.go("sentpassword");
                    } else {
                        ref.isInalidEmailId_Server = true;
                    }
                },
                function (err) {
                    console.log("Error >>>", err); 
                }
            );
        }
    };
	
});