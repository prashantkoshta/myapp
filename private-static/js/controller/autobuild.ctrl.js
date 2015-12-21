'use strict';
app.controller('autobuildController', function($scope,$rootScope, $state, mainSvc,svcFaye) {
    
	
	$scope.messageData = ""
	$scope.projects = []
    $scope.selectedProject;
	$scope.isBuildBtnDisabled = false;
	
       
	svcFaye.subscribe("/channel-1", function(message){
			$scope.messageData =  $scope.messageData +"\n"+ message.msg.mode+">"+message.msg.error+" |  "+message.msg.data;
	});
	
	$scope.pushData = function (){
		svcFaye.publish("/channel-1", {msg: "hello"})
	}
	
	$scope.doAutoBuild = function () {
		var data = {"projectname":$scope.selectedProject.projectname};
		mainSvc.postCommon("/buildapp/gateway/buildProjectAndDeploy",data).then(
            function (response) {
            	 $scope.messageData =  $scope.messageData + "\n GREAT JOB";
            },
            function (err) {
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
		
	}
	
	if($state.current.name == "autobuild"){
		getProjectList();
	}
	
	
});