'use strict';
app.controller('createProjectController', function($scope,$state,mainSvc) {
	
	$scope.selectedRepo = "git";
	$scope.batchfiles;/* = [
		{"buildtype":"ant"},
		{"buildtype":"maven"},
		{"buildtype":"gradle"},
		{"buildtype":"grunt"}
	];
	*/
	getBatchList();
	function getBatchList(){
		 mainSvc.getCommon("buildapp/gateway/getBatchList",{}).then(
            function (response) {
				if(!response.error){
					$scope.batchfiles = response.data;
					$scope.selectedBatchFile = $scope.batchfiles[0];
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
    
    $scope.createPrjFrm = {
    		projectname : "",
    		git :{
				url :"",
				username : "",
				password: ""
			},
			svn : {
				url :"",
				username : "",
				password: ""
			},
			buildbatchfile : "",
			buildlocation: "",
			buildtype : ""
    };
    //{error:"",msg:""}
    $scope.errorList = [];
	
	
	$scope.onSubmitCreateProj =  function(event){
		console.log($scope.selectedRepo);
		var bool = doCrtFrmValiation();
		if(!bool){
			return;
		}
		var repo = {};
		var d;
		if($scope.selectedRepo === "git"){
			
			if($scope.createPrjFrm.git.credintial){
				d = {
					"projectname" :  $scope.createPrjFrm.projectname,
					"git" : {
					  "url" : $scope.createPrjFrm.git.url,
					  "username" : $scope.createPrjFrm.git.username,
					  "password" : $scope.createPrjFrm.git.password
					},
					"status" : "Active",
					"buildbatchfile" : $scope.createPrjFrm.buildbatchfile,
					"buildlocation" : $scope.createPrjFrm.buildlocation,
					"buildtype" : $scope.selectedBatchFile.buildtype
					
				};
			}else{
				d = {
					"projectname" :  $scope.createPrjFrm.projectname,
					"git" : {
					  "url" : $scope.createPrjFrm.git.url
					},
					"status" : "Active",
					"buildbatchfile" : $scope.createPrjFrm.buildbatchfile,
					"buildlocation" : $scope.createPrjFrm.buildlocation,
					"buildtype" : $scope.selectedBatchFile.buildtype
					
				};
			}
			
		}else{
			if($scope.createPrjFrm.svn.credintial){
				d = {
					"projectname" :  $scope.createPrjFrm.projectname,
					"svn" : {
					  "url" : $scope.createPrjFrm.giturl,
					  "username" : $scope.createPrjFrm.svn.username,
					  "password" : $scope.createPrjFrm.svn.password
					},
					"status" : "Active",
					"buildbatchfile" : $scope.createPrjFrm.buildbatchfile,
					"buildlocation" : $scope.createPrjFrm.buildlocation,
					"buildtype" : $scope.selectedBatchFile.buildtype
					
				};
			}else{
				d = {
					"projectname" :  $scope.createPrjFrm.projectname,
					"svn" : {
					  "url" : $scope.createPrjFrm.svn.url
					},
					"status" : "Active",
					"buildbatchfile" : $scope.createPrjFrm.buildbatchfile,
					"buildlocation" : $scope.createPrjFrm.buildlocation,
					"buildtype" : $scope.selectedBatchFile.buildtype
					
				};
			}
			
		}
		 
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
		$scope.errorList = [];
		if($scope.selectedRepo === "git"){
			if($scope.createPrjFrm.projectname.trim() === "" 
				|| $scope.createPrjFrm.git.url.trim() === ""  
				|| $scope.selectedBatchFile.buildtype.trim() === "" || $scope.createPrjFrm.buildlocation.trim() === "" 
				|| $scope.createPrjFrm.buildbatchfile.trim() === "" ){
				$scope.errorList.push({error:"",msg:"Field Should not be empty."});
				return false;
			}
		}else if($scope.selectedRepo === "svn"){
			if($scope.createPrjFrm.projectname.trim() === "" 
				|| $scope.createPrjFrm.svn.url.trim() === ""  
				|| $scope.selectedBatchFile.buildtype.trim() === "" || $scope.createPrjFrm.buildlocation.trim() === "" 
				|| $scope.createPrjFrm.buildbatchfile.trim() === "" ){
				$scope.errorList.push({error:"",msg:"Field Should not be empty."});
				return false;
			}
		}
		
		/*if($scope.createPrjFrm.projectname.trim() === "" || $scope.createPrjFrm.git.url.trim() === ""
			|| $scope.createPrjFrm.git.username.trim() === "" || $scope.createPrjFrm.git.password.trim() === "" 
			|| $scope.createPrjFrm.buildbatchfile.trim() === "" || $scope.createPrjFrm.buildlocation.trim() === "" ){
			$scope.errorList.push({error:"",msg:"Field Should not be empty."});
			return false;
		}*/
    	return true;
	}
	
	
	
});
