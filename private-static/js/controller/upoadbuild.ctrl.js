'use strict';
app.controller('uploadbuildController', function($scope,$rootScope, $state,validatorFactory,mainSvc,multipartFormSvc) {
    var isPwdServerError = false;
	
	$scope.tableConfigParam;
	$scope.messageData = ""
	$scope.projects = []
    $scope.selectedProject;
	
	
    if (typeof $rootScope.pageError!== "undefined" 
        && $rootScope.pageError !== null
        && typeof $rootScope.pageError.error !== "undefined"
        && typeof $rootScope.pageError.errorType !== "undefined"
        && $rootScope.pageError.error === "true"
        && $rootScope.pageError.errorType === "passwordError" ) {
        isPwdServerError = true;
    }
	
	
	
	
    
    $scope.onCheckedAll = function(event){
    	var bool = event.currentTarget.checked;
    	angular.forEach($scope.buildList, function(value, key) {
    		  value["selected"] = bool
    	});
    }
     
    $scope.uploadForm = {
    		name : "",
    		description :"",
    		file : "",
    		appversion: "",
    		buildversion:"",
			projectname : ""
    };
    //{error:"",msg:""}
    $scope.uploadFormErrorList = [];
	
	$scope.submitUploadform = function(event){
		var bool = doBuildFormValiation();
		if(!bool){
			event.preventDefault();
			return;
		}
		//multipartFormSvc.post('/buildapp/gateway/saveBuildInfo',$scope.uploadForm);
		multipartFormSvc.post('/buildapp/gateway/saveBuildInfo',$scope.uploadForm).then(
	            function (response) {
	            	if(response.error === false){
						addBuildsInProject(response.data);
	            		$state.go("home");
	            	}else{
	            		$scope.uploadFormErrorList.push({error:"",msg:"File size / File Type not allowed."});
	            	}
	            },
	            function (err) {
	                console.log("Error >>>", err); 
	            }
	        );
	}
	
	function addBuildsInProject(data){
		var d = {"projectname" : $scope.selectedProject.projectname,"builds":[data._id]};
        mainSvc.addBuildInProjectd(d).then(
            function (response) {
            	if(response.error === false){
					$state.go("home");
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	function doBuildFormValiation(){
		$scope.uploadFormErrorList = []
		if($scope.uploadForm.name.trim() === "" || $scope.uploadForm.description.trim() === ""
			|| $scope.uploadForm.appversion.trim() === "" || $scope.uploadForm.buildversion.trim() === "" 
			|| $scope.uploadForm.file === undefined || $scope.uploadForm.file === null || $scope.uploadForm.file === "" 
			|| $scope.uploadForm.projectname === undefined || $scope.uploadForm.projectname === ""){
			$scope.uploadFormErrorList.push({error:"",msg:"Field Should not be empty."});
			return false;
		}
		var UPLOAD_FILE_SIZE = 1 * 1024 * 1024;
		var ALLOWD_FILE_TYPE = ".zip,.txt,.apk,.ipa";
		var filename = $scope.uploadForm.file.name;
		var ext = filename.substring(filename.lastIndexOf("."),filename.length);
    	console.log(ext,filename);
    	if(ALLOWD_FILE_TYPE.indexOf(ext.toLowerCase()) == -1){
    		$scope.uploadFormErrorList.push({error:"",msg:"Only file "+ALLOWD_FILE_TYPE+" allowed to upload."});
    		return false;
		}
    	if($scope.uploadForm.file.size > UPLOAD_FILE_SIZE){
    		$scope.uploadFormErrorList.push({error:"",msg:"File size not allowed."});
    		return false;
		}
    	return true;
	}
	
	if($state.current.name == "upload"){
		getProjectList();
	}

	
	function getProjectList(){
		 mainSvc.getProjectList().then(
            function (response) {
            	 $scope.projects = response.data;
				 //$scope.selectedProject = $scope.projects[0];
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	$scope.onProjectSelect = function(project){
		$scope.uploadForm.projectname = $scope.selectedProject.projectname;
	}
	
	
});
