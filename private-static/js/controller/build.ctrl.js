'use strict';
app.controller('buildController', function($scope,$rootScope, $state, mainSvc,ngTableParams) {
    
	$scope.tableConfigParam;
	$scope.messageData = ""
	$scope.projects = []
    $scope.selectedProject;
	
    	
	$scope.doPublish = function () {
		var buildid = "";
	    	angular.forEach($scope.buildList, function(value, key) {
	    		  if(value["selected"] === true) buildid = value["_id"];
	    	});
		var d = {"projectname" : $scope.selectedProject.projectname,"builds":[buildid]};
	        mainSvc.postCommon("/buildapp/gateway/publishBuildInfo",d).then(
	            function (response) {
	            	 
	            },
	            function (err) {
	                console.log("Error >>>", err); 
	            }
	        );
    	};
	
	
	
	$scope.getDetails = function () {
		var d = {"projectname" : $scope.selectedProject.projectname};
        mainSvc.postCommon("/buildapp/gateway/projectBuilds",d).then(
            function (response) {
            	 $scope.buildList= response.data.builds;
				 $scope.tableConfigParam = new ngTableParams(
						{
							sorting: {builddate:"asc"}
						},
						{
							counts: [],
							paginationMaxBlocks:5,
							paginationMinBlocks:2,
							dataset: $scope.buildList
						}
					);
                 $state.go("home");
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
    };
    
    $scope.onCheckedAll = function(event){
    	var bool = event.currentTarget.checked;
    	angular.forEach($scope.buildList, function(value, key) {
    		  value["selected"] = bool
    	});
    }
    
   
    
    $scope.deleteBuilds = function () {
    	console.log($scope.buildList);
    	var arBuild = [];
    	angular.forEach($scope.buildList, function(value, key) {
	  		  if(value["selected"]){
	  			arBuild.push(value._id);
	  		  }
	  		
	  	});
		var d = {"projectname" :$scope.selectedProject.projectname,"builds":arBuild};
        mainSvc.postCommon("/buildapp/gateway/deleteBuild",d).then(
            function (response) {
            	$scope.getDetails();
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
				 $scope.getDetails();
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
	}
	
	
	$scope.onProjectSelect = function(project){
		$scope.getDetails();
	}
	
	if($state.current.name == "home"){
		getProjectList();
	}
	
});

/* Filter for file type */
app.filter("getFileType", function(){
	return function(filename){
		if(filename === undefined) return "";
		var ext = filename.substring(filename.lastIndexOf("."),filename.length);
	    return ext
	};
});

/* Filter for file type */
app.filter("getDateFormat", function(){
	return function(date){
		var d = new Date(date);
		var fromate = (d.getUTCMonth() + 1)+"\\"+d.getUTCDate()+"\\"+d.getUTCFullYear()+"  "+d.getUTCHours()+":"+d.getUTCMinutes()+":"+d.getUTCSeconds();
		/*return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate() + 'T'
		         + d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds();*/
		return fromate;
	};
});
