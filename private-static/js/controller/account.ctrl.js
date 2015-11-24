'use strict';
app.controller('accountController', function($scope,$rootScope, $state, validatorFactory,mainSvc) {
    var isPwdServerError = false;
    if (typeof $rootScope.pageError!= "undefined" 
        && $rootScope.pageError != null
        && typeof $rootScope.pageError.error != "undefined"
        && typeof $rootScope.pageError.errorType != "undefined"
        && $rootScope.pageError.error === "true"
        && $rootScope.pageError.errorType === "passwordError" ) {
        isPwdServerError = true
    }
    
   
    $scope.changePwdAction = {
		nPwd : "",
		oPwd : "",
		cPwd : "",
        isInalidPwd : false,
		isInalidMatch :false,
        isInalidPwd_Server : isPwdServerError,
        doValidation : function () {
            this.isInalidPwd = false;
			this.isInalidMatch = (this.nPwd == this.oPwd)? false :true;
        },
        onSubmitClick : function () {
            this.isInalidPwd_Server = false;
            this.doValidation();
            if (this.isInalidEmailId) {
                return;
            }
            var ref = this;
            mainSvc.changePassword(this.oPwd,this.nPwd).then(
                function (response) {
                    if (response.error == false) {
                        $state.go("pwdChanged");
                    } else {
                        ref.isInalidPwd_Server = true;
                    }
                },
                function (err) {
                    console.log("Error >>>", err); 
                }
            );
        }
    };
	
});