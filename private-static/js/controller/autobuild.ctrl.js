'use strict';
app.controller('autobuildController', function($scope,$rootScope, $state, mainSvc,svcFaye,$uibModal) {
    
	
	$scope.consoleLog = ""
	$scope.projects = []
    $scope.selectedProject;
	$scope.isBuildBtnDisabled = false;
	$scope.builddumpid = '';
	
       
	svcFaye.subscribe("/channel-1", function(message){
			var stramData = "";
			var str = ""+message.msg.data;
		    if(message.msg.mode === 'stderr'){
				if(str.trim() !== ""){
					stramData =  message.msg.mode+"##"+message.msg.error+" | "+str;
					$scope.consoleLog =  $scope.consoleLog + stramData;
				}
			}else{
				if(str.trim() !== ""){
					stramData =  message.msg.mode+">"+message.msg.error+" | "+str;
					$scope.consoleLog =  $scope.consoleLog + stramData;
				}
			}
			
			
	});
	
	$scope.pushData = function (){
		svcFaye.publish("/channel-1", {msg: "hello"})
	}
	
	$scope.doAutoBuild = function () {
		$scope.consoleLog = ""
		var data = {"projectname":$scope.selectedProject.projectname};
		mainSvc.postCommon("/buildapp/gateway/buildProjectAndDeploy",data).then(
            function (response) {
				$scope.builddumpid = response.data.builddumpid;
            },
            function (err) {
				$scope.builddumpid = null;
                console.log("Error >>>", err); 
            }
        );
	        
    };
  	
	function getProjectList(){
		 mainSvc.getCommon("/buildapp/gateway/listOfProjects",{}).then(
            function (response) {
            	 $scope.projects = response.data;
				 $scope.selectedProject = $scope.projects[0];
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	$scope.onProjectSelect = function(project){
		$scope.builddumpid = "";
		$scope.consoleLog = '';
	}
	
	if($state.current.name == "autobuild"){
		getProjectList();
	}
	
	$scope.editBuildInfo = function(user){
		if($scope.builddumpid === null || $scope.builddumpid === '' || $scope.builddumpid===undefined) return;
		var size = "lg";
		 var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'buildinfopopup.html',
		  controller: 'ModalBuildInfoInstanceCtrl',
		  size: size,
		  resolve: {
			builddumpid: function () {
			  return $scope.builddumpid;
			}
		  }
		});
	};
	
	
});


app.controller('ModalBuildInfoInstanceCtrl', function ($scope, $uibModalInstance, builddumpid, mainSvc) {
  
  $scope.buildForm = {
	  'name' : '',
	  'description' : '',
	  'appversion' : '',
	  'buildversion' : '',
	  'builddumpid' : builddumpid
  };
  
  $scope.save = function () {
	 var data = $scope.buildForm;
	 mainSvc.postCommon("/buildapp/gateway/saveAutoBuildDetails",data).then(
		function (response) {
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

