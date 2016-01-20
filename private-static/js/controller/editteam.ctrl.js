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
 	
	$scope.openDeleteTeamMemPopup = function(user){
		var size = "md";
		 var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'openDeleteTeamMemPopup.html',
		  controller: 'DelTeamModalInstanceCtrl',
		  size: size,
		  resolve: {
			user: function () {
			  return user;
			},
			onSuccess : function (){
				return function(){
					getProjectDetails(projectid);
				}
			},
			projectid : function(){
				return projectid;
			},
			project : function(){
				return $scope.project;
			}
			
		  }
		});
	};
	
	$scope.openEditTeamMemPopup = function(user){
		 var size = "md";
		 var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'editTeamPopup.html',
		  controller: 'EditTeamModalInstanceCtrl',
		  size: size,
		  resolve: {
			user: function () {
			  return user;
			},
			onSuccess : function (){
				return function(){
					getProjectDetails(projectid);
				}
			},
			projectid : function(){
				return projectid;
			}
			
		  }
		});
		
	};
	
	
	
});


app.controller('DelTeamModalInstanceCtrl', function ($scope, $uibModalInstance, user, onSuccess,projectid,project,mainSvc,$rootScope) {
	
  $scope.user = user;
  $scope.errorList = [];
  $scope.project = project;
  
 
 
 
  $scope.delete = function () {
	$scope.errorList = [];
	var obj = {
		projectid:projectid,
		userid:user.userid,
		projectrole : user.projectrole,
		action: "delete"
	};
	
	mainSvc.postCommon("/buildapp/gateway/updateProjectTeamMemberRole",obj).then(
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
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
});



app.controller('EditTeamModalInstanceCtrl', function ($scope, $uibModalInstance, user, onSuccess,projectid,mainSvc,$rootScope) {
	
  $scope.user = user;
  $scope.errorList = [];
  
  $scope.teamrole = [
	{"projectrole" : "projectadmin"},
	{"projectrole" : "user"}
  ];
  
  
  $scope.selected = null;
  
  function getSetDefaultValue(){
	   for(var i in $scope.teamrole){
		  if($scope.teamrole[i].projectrole === user.projectrole){
			  $scope.selected = $scope.teamrole[i];
			  return;
		  }
	  }
  }
 
 
  $scope.update = function () {
	$scope.errorList = [];
	
	var obj = {
		projectid:projectid,
		userid:user.userid,
		projectrole : $scope.selected.projectrole,
		action: "update"
	};
	
	mainSvc.postCommon("/buildapp/gateway/updateProjectTeamMemberRole",obj).then(
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

	
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  getSetDefaultValue();

});
