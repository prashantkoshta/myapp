'use strict';
app.controller('pendingapprovalController', function($scope,$rootScope, $state, mainSvc,ngTableParams) {
	$scope.tableConfigParam;
	$scope.messageData = ""
	$scope.projects = []
	//
	$scope.boolProjectApproval = true;
	
	function getPendingApprovalList(){
		 mainSvc.postCommon("/buildapp/gateway/getReqApprovalStatusList",{}).then(
            function (response) {
				 $scope.buildList= response.data;
				 if($scope.buildList.length === 0) $scope.boolProjectApproval = false;
				 $scope.tableConfigParam = new ngTableParams(
					{
						sorting: {projectname:"asc"}
					},
					{
						counts: [],
						paginationMaxBlocks:5,
						paginationMinBlocks:2,
						dataset: $scope.buildList
					}
				);
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	$scope.actAcceptReject = function(bool,item){
		var status = (bool === 1) ? "accept":"reject";
		mainSvc.postCommon("/buildapp/gateway/updateApprovalStatus",{"_id":item._id,"status" : status}).then(
            function (response) {
				if(!response.error) getPendingApprovalList();
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	if($state.current.name == "pendingapproval"){
		getPendingApprovalList();
	}
	
	
	
});
