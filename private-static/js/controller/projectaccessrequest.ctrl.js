'use strict';
app.controller('projectaccessrequestController', function($scope,$rootScope, $state, mainSvc,ngTableParams) {
	$scope.tableConfigParam;
	$scope.messageData = ""
	$scope.projects = []
	$scope.projectid = "";
	$scope.errorList = [];
	
	function getRequestHistoryList(){
        mainSvc.postCommon("/buildapp/gateway/getRequestHistory",{}).then(
            function (response) {
            	 $scope.buildList= response.data;
				 $scope.tableConfigParam = new ngTableParams(
						{
							sorting: {reqdate:"desc"}
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
    
  
   
 	
	$scope.onAccessSubmit = function(event){
		$scope.errorList = [];
		if($scope.projectid.trim() === ""){
			$scope.errorList.push({"msg":"Invalid Project Id."});
			return;
		}
		 mainSvc.postCommon("/buildapp/gateway/raiseProjectAccess",{"projectid":$scope.projectid}).then(
            function (response) {
				if(!response.error)	{
					getRequestHistoryList();
				}else{
					$scope.errorList.push({"msg":response.errorType});
				}
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	$scope.onChange = function(){
		$scope.errorList = [];
	}

	
	if($state.current.name == "projectaccessrequest"){
		getRequestHistoryList();
	}
	
	
	
});

/* Filter for file type */
app.filter("getStatus", function(){
	return function(status){
		var s = status;
		if(status === "reject") {
			s = "Rejected";
		}else if(status === "accept") {
			s = "Accepted";
		}else if(status === "pending"){
			s = "Pending";
		}
		return s;
	};
});
