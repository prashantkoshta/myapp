'use strict';
app.controller('userviewController', function($scope,$rootScope,$state,mainSvc,ngTableParams,$uibModal) {
    
	$scope.tableConfigParam;
	$scope.users = [];
	$scope.projectList = [];
	$scope.roleList = [];

	function getUserList(){
		/**/ mainSvc.postCommon("/buildapp/gateway/usersList",{}).then(
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
	
	
	
	if($state.current.name == "userview"){
		getUserList();
	}
	
	
});




/* Filter for file type */
app.filter("getTeamList", function(){
	return function(projectteam){
		var list = "";
		for(var p in projectteam){
			list= list+"<li>"+projectteam[p].fullname+" ("+projectteam[p].projectrole+") </li>";
		}
		return list;
	}
});

