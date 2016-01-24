'use strict';
app.controller('editProjectController', function($scope,$state,mainSvc,$stateParams,$uibModal) {
	var projectid = $stateParams.projectid;
	$scope.selectedRepo = "git";
	$scope.batchfiles;/* = [
		{"buildtype":"ant"},
		{"buildtype":"maven"},
		{"buildtype":"gradle"},
		{"buildtype":"grunt"}
	];*/
	$scope.editPrjFrm = {};
	if($stateParams.projectid === null) {
		$state.go("userview");
		return;
	}
	
	getBatchList();
	function getBatchList(){
		
		 mainSvc.getCommon("buildapp/gateway/getBatchList",{}).then(
            function (response) {
				if(!response.error){
					$scope.batchfiles = response.data;
					getProjectDetails(projectid);
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	function getProjectDetails(projectid){
		 mainSvc.getCommon("buildapp/gateway/getProjectDetail/"+projectid,{}).then(
            function (response) {
				if(!response.error){
					$scope.editPrjFrm = response.data;
					if(response.data.git !==undefined){
						$scope.selectedRepo = "git"
						if(response.data.git.username!==undefined && response.data.git.password!==undefined){
							$scope.editPrjFrm.git.credintial = true;
						}else{
							$scope.editPrjFrm.git.credintial = false;
						}
					}
					if(response.data.svn !==undefined){
						$scope.selectedRepo = "svn";
						if(response.data.svn.username!==undefined && response.data.svn.password!==undefined){
							$scope.editPrjFrm.svn.credintial = true;
						}else{
							$scope.editPrjFrm.svn.credintial = false;
						}
					}
					for(var i in $scope.batchfiles){
						if($scope.batchfiles[i].buildtype === response.data.buildtype){
							$scope.selectedBatchFile = $scope.batchfiles[i];
						}
					}
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
          
    
    //{error:"",msg:""}
    $scope.errorList = [];
	
	
	$scope.onSaveProjSetting =  function(event){
		var bool = doCrtFrmValiation();
		if(!bool){
			return;
		}
		var d;
		if($scope.selectedRepo === "git"){
			
			if($scope.editPrjFrm.git.credintial){
				d = {
					"_id" :  projectid,
					"git" : {
					  "url" : $scope.editPrjFrm.git.url,
					  "username" : $scope.editPrjFrm.git.username,
					  "password" : $scope.editPrjFrm.git.password
					},
					"status" : "Active",
					"buildbatchfile" : $scope.editPrjFrm.buildbatchfile,
					"buildlocation" : $scope.editPrjFrm.buildlocation,
					"buildtype" :  $scope.selectedBatchFile.buildtype
					
				};
			}else{
				d = {
					"_id" :  projectid,
					"git" : {
					  "url" : $scope.editPrjFrm.git.url
					},
					"status" : "Active",
					"buildbatchfile" : $scope.editPrjFrm.buildbatchfile,
					"buildlocation" : $scope.editPrjFrm.buildlocation,
					"buildtype" :  $scope.selectedBatchFile.buildtype
					
				};
			}
			
		}else{
			if($scope.editPrjFrm.svn.credintial){
				d = {
					"_id" :  projectid,
					"svn" : {
					  "url" : $scope.editPrjFrm.giturl,
					  "username" : $scope.editPrjFrm.svn.username,
					  "password" : $scope.editPrjFrm.svn.password
					},
					"status" : "Active",
					"buildbatchfile" : $scope.editPrjFrm.buildbatchfile,
					"buildlocation" : $scope.editPrjFrm.buildlocation,
					"buildtype" :  $scope.selectedBatchFile.buildtype
					
				};
			}else{
				d = {
					"_id" :  projectid,
					"svn" : {
					  "url" : $scope.editPrjFrm.svn.url
					},
					"status" : "Active",
					"buildbatchfile" : $scope.editPrjFrm.buildbatchfile,
					"buildlocation" : $scope.editPrjFrm.buildlocation,
					"buildtype" :  $scope.selectedBatchFile.buildtype
					
				};
			}
			
		}
        mainSvc.postCommon("buildapp/gateway/editProjectInfo",d).then(
            function (response) {
            	if(response.error === false){
					$state.go("userview");
				}else{
					$scope.errorList.push({error:"",msg:response.errorType});
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	function doCrtFrmValiation(){
		$scope.errorList = []
		if($scope.selectedRepo === "git"){
			if($scope.editPrjFrm.git.url.trim() === ""  
				|| $scope.editPrjFrm.buildbatchfile.trim() === "" || $scope.editPrjFrm.buildlocation.trim() === ""){
				$scope.errorList.push({error:"",msg:"Field Should not be empty."});
				return false;
			}
		}else if($scope.selectedRepo === "svn"){
			if($scope.editPrjFrm.svn.url.trim() === ""  
				|| $scope.editPrjFrm.buildbatchfile.trim() === "" || $scope.editPrjFrm.buildlocation.trim() === ""){
				$scope.errorList.push({error:"",msg:"Field Should not be empty."});
				return false;
			}
		}
    	return true;
	}
	
	$scope.openDeletePopup = function(user){
		 var size = "md";
		 var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'deleteProjectPopup.html',
		  controller: 'DelModalInstanceCtrl',
		  size: size,
		  resolve: {
			_id: function () {
			  return $scope.editPrjFrm._id;
			},
			projectname: function () {
			  return $scope.editPrjFrm.projectname;
			},
			onSuccess : function (){
				return function(){
					$state.go("userview");
				}
			}
			
		  }
		});
	};
	
	
	
});

app.controller('DelModalInstanceCtrl', function ($scope, $uibModalInstance, _id, projectname,onSuccess, mainSvc,$rootScope) {
	
  $scope.projectname = projectname;
  $scope.tprojectname = "";
  $scope.errorList = [];
 
  $scope.delete = function () {
	if( ($scope.tprojectname.trim() === "" ) || ($scope.projectname.trim() !==  $scope.tprojectname.trim())){
		$scope.errorList.push({error:"",msg:"Invalid Project name."});
		return;
	}
	$scope.errorList = [];
	var projects = [_id];
	mainSvc.postCommon("/buildapp/gateway/deleteProject",projects).then(
		function (response) {
			if(!response.error){
				$uibModalInstance.close();
				onSuccess();
			}else{
				$scope.errorList.push({error:"",msg:response.errorType});
			}
		},
		function (err) {
			console.log("Error >>>", err); 
		}
	);
  };
	
  $scope.onChange = function(){
	  $scope.errorList = [];
  }	  
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
});
