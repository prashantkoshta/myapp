'use strict';
app.controller('userviewController', function($scope,$rootScope, $state, mainSvc,ngTableParams) {
    
	$scope.tableConfigParam;
	$scope.users = []

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
	}
	
	
	
	
	if($state.current.name == "userview"){
		getUserList();
	}
	
});
