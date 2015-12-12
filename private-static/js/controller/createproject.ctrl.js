'use strict';
app.controller('createProjectController', function($scope,$state,mainSvc) {
          
    $scope.createPrjFrm = {
    		projectname : "",
    		giturl :"",
    		gitusername : "",
    		gitpassword: "",
			buildbatchfile : "",
			buildlocation: ""
    };
    //{error:"",msg:""}
    $scope.errorList = [];
	
	
	$scope.onSubmitCreateProj =  function(event){
		var bool = doCrtFrmValiation();
		if(!bool){
			return;
		}
		var d = {
				"projectname" :  $scope.createPrjFrm.projectname,
				"git" : {
				  "url" : $scope.createPrjFrm.giturl,
				  "username" : $scope.createPrjFrm.gitusername,
				  "password" : $scope.createPrjFrm.gitpassword
				},
				"status" : "Active",
				"buildbatchfile" : $scope.createPrjFrm.buildbatchfile,
				"buildlocation" : $scope.createPrjFrm.buildlocation
				
			};
        mainSvc.postCommon("buildapp/gateway/createProject",d).then(
            function (response) {
            	if(response.error === false){
					$state.go("home");
				}else{
					$scope.errorList.push({error:"",msg:"Project name already exist."});
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	function doCrtFrmValiation(){
		$scope.errorList = []
		if($scope.createPrjFrm.projectname.trim() === "" || $scope.createPrjFrm.giturl.trim() === ""
			|| $scope.createPrjFrm.gitusername.trim() === "" || $scope.createPrjFrm.gitpassword.trim() === "" 
			|| $scope.createPrjFrm.buildbatchfile.trim() === "" || $scope.createPrjFrm.buildlocation.trim() === "" ){
			$scope.errorList.push({error:"",msg:"Field Should not be empty."});
			return false;
		}
    	return true;
	}
	
	
	
});
