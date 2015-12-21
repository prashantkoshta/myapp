'use strict';
app.controller('userviewController', function($scope,$rootScope,$state,mainSvc,ngTableParams,$uibModal) {
    
	$scope.tableConfigParam;
	$scope.users = [];
	$scope.projectList = [];
	$scope.roleList = [];

	function getUserList(){
		 mainSvc.postCommon("/buildapp/gateway/usersList",{}).then(
            function (response) {
            	 $scope.users = response.data;
				 $scope.tableConfigParam = new ngTableParams(
						{
							sorting: {firstname:"asc"}
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
		
		 mainSvc.getCommon("/buildapp/gateway/allListOfProjects",{}).then(
				function (response) {
					$scope.projectList = response.data;
				},
				function (err) {
					console.log("Error >>>", err); 
				}
		  );
		  
		   mainSvc.getCommon("/buildapp/gateway/allRole",{}).then(
				function (response) {
					$scope.roleList = [];
					for(var i in response.data){
						$scope.roleList.push(response.data[i].role);
					}
				},
				function (err) {
					console.log("Error >>>", err); 
				}
		  );
	}
	$scope.items = ['item1', 'item2', 'item3'];
	$scope.openEditInfo = function(user){
		console.log(">>>",user);
		var size = "lg";
		 var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'userDetails.html',
		  controller: 'ModalInstanceCtrl',
		  size: size,
		  resolve: {
			user: function () {
			  return angular.copy(user);
			},
			projectList: function () {
			  return angular.copy($scope.projectList);
			},
			roleList: function () {
			  return angular.copy($scope.roleList);
			}
			
		  }
		});
	};
	
	
	if($state.current.name == "userview"){
		getUserList();
	}
	
});


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, user, projectList, roleList,mainSvc) {

  $scope.user = user;
  $scope.projectList = projectList;
  $scope.roleList = roleList;
   
  $scope.save = function () {
	 var tempUser = angular.copy($scope.user);
	 var tempProjectList = [];
	 var tempRoleList = [];
	 for(var i in tempUser.projects){
		 tempProjectList.push(tempUser.projects[i]._id);
	 }
	 delete tempUser.local;
	 tempUser.projects = tempProjectList;
	 console.log(tempUser);
	 mainSvc.postCommon("/buildapp/gateway/updateProjectAndRoleInfoByUserId",tempUser).then(
		function (response) {
			 response.data;
			 $uibModalInstance.close();
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
