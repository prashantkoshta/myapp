'use strict';
app.controller('editTeamController', function($scope,$state,mainSvc,$stateParams,ngTableParams,$uibModal) {
	$scope.tableConfigParam;
	$scope.project;
	var projectid = $stateParams.projectid;
	
	if($stateParams.projectid === null) {
		$state.go("userview");
		return;
	}
	
	getProjectDetails(projectid);
	
	
	function getProjectDetails(projectid){
		 mainSvc.getCommon("buildapp/gateway/getProjectDetail/"+projectid,{}).then(
            function (response) {
				$scope.project = response.data;
				$scope.users = response.data.projectteam;
				$scope.tableConfigParam = new ngTableParams(
						{
							sorting: {fullname:"asc"}
						},
						{
							counts: [],
							paginationMaxBlocks:5,
							paginationMinBlocks:2,
							dataset: $scope.users
						}
					);
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
		var d = {
				"_id" :  $scope.editPrjFrm._id,
				"git" : {
				  "url" : $scope.editPrjFrm.git.url,
				  "username" : $scope.editPrjFrm.git.username,
				  "password" : $scope.editPrjFrm.git.password
				},
				"status" : "Active",
				"buildbatchfile" : $scope.editPrjFrm.buildbatchfile,
				"buildlocation" : $scope.editPrjFrm.buildlocation
				
			};
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
		if($scope.editPrjFrm.git.username.trim() === "" || $scope.editPrjFrm.git.password.trim() === "" || $scope.editPrjFrm.git.url.trim() === ""  
			|| $scope.editPrjFrm.buildbatchfile.trim() === "" || $scope.editPrjFrm.buildlocation.trim() === "" ){
			$scope.errorList.push({error:"",msg:"Field Should not be empty."});
			return false;
		}
    	return true;
	}
	
	$scope.openDeleteTeamMemPopup = function(user){
		 var size = "md";
		 var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'deleteTeamPopup.html',
		  controller: 'DelTeamModalInstanceCtrl',
		  size: size,
		  resolve: {
			_id: function () {
			  return $scope.editPrjFrm._id;
			},
			userid: function () {
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

app.controller('DelTeamModalInstanceCtrl', function ($scope, $uibModalInstance, _id, projectname,onSuccess, mainSvc,$rootScope) {
	
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
