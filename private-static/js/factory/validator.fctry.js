'use strict';
app.factory('validatorFactory', function() {
	return {
		isValidEmailId : isValidEmailId,
		isValidPassword : isValidPassword
	}
	
	function isValidEmailId(strEmailId){
		console.log("isValidEmailId",strEmailId);
		var email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (email_pattern.test(strEmailId)){  
		    return (true)  
		}  
		return false
	}
	
	function isValidPassword(strPwd){
		if(typeof strPwd == typeof undefined) return false;
		strPwd = strPwd.trim();
		if(strPwd === "" || strPwd.lenght<4) return false;
		return true;
	}
});