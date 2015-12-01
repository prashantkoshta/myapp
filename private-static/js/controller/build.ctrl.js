'use strict';
app.controller('buildController', function($scope,$rootScope, $state, validatorFactory,mainSvc,multipartFormSvc,ngTableParams) {
    var isPwdServerError = false;
	//var data = [{"_id":"565b37c2d19b269821d415bb","description":"sd","createdby":"pra  Kos","filename":"New Text Document_2015112911386890.zip","buildnum":"adsf","appversion":"asd","buildname":"A","builddate":"2015-11-29T17:37:06.897Z","__v":0},{"_id":"5659b61dae4de2902822f526","description":"- Change\r\n- How to Do","createdby":"pra  Kos","filename":"New Text Document_2015112881241381.zip","buildnum":"BV1","appversion":"a1","buildname":"Ape","builddate":"2015-11-28T14:11:41.388Z","__v":0},{"_id":"5659b53fc17c07bc1b3ec619","description":"- Added Program Feature","createdby":"pra  Kos","filename":"New Text Document_201511288859144.zip","buildnum":"3.4","appversion":"1.0.1","buildname":"New Build 1","builddate":"2015-11-28T14:07:59.149Z","__v":0},{"_id":"5658b211ce61760c0bd11d02","description":"asdf","createdby":"pra  Kos","filename":"2 - Copy_2015112713439941.zip","buildnum":"asdf","appversion":"sadf","buildname":"adf","builddate":"2015-11-27T19:42:09.949Z","__v":0}];
	$scope.tableConfigParam;
    if (typeof $rootScope.pageError!== "undefined" 
        && $rootScope.pageError !== null
        && typeof $rootScope.pageError.error !== "undefined"
        && typeof $rootScope.pageError.errorType !== "undefined"
        && $rootScope.pageError.error === "true"
        && $rootScope.pageError.errorType === "passwordError" ) {
        isPwdServerError = true;
    }
	
	$scope.getDetails = function () {
        mainSvc.getBuildDetails().then(
            function (response) {
            	 $scope.buildList= response.data;
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
	  			arBuild.push({"_id":value._id});
	  		  }
	  		
	  	});
        mainSvc.delBuild(arBuild).then(
            function (response) {
            	$scope.getDetails();
            },
            function (err) {
                console.log("Error >>>", err); 
            }
        );
    };
    
    $scope.uploadForm = {
    		name : "",
    		description :"",
    		file : "",
    		appversion: "",
    		buildversion:""	
    };
    //{error:"",msg:""}
    $scope.uploadFormErrorList = [];
	
	$scope.submitUploadform = function(event){
		var bool = doBuildFormValiation();
		if(!bool){
			event.preventDefault();
			return;
		}
		//multipartFormSvc.post('/buildapp/gateway/saveBuildInfo',$scope.uploadForm);
		multipartFormSvc.post('/buildapp/gateway/saveBuildInfo',$scope.uploadForm).then(
	            function (response) {
	            	if(response.error === false){
	            		$state.go("home");
	            	}else{
	            		$scope.uploadFormErrorList.push({error:"",msg:"File size / File Type not allowed."});
	            	}
	            },
	            function (err) {
	                console.log("Error >>>", err); 
	            }
	        );
	}
	
	function doBuildFormValiation(){
		$scope.uploadFormErrorList = []
		if($scope.uploadForm.name.trim() === "" || $scope.uploadForm.description.trim() === ""
			|| $scope.uploadForm.appversion.trim() === "" || $scope.uploadForm.buildversion.trim() === "" 
			|| $scope.uploadForm.file === undefined || $scope.uploadForm.file === null){
			$scope.uploadFormErrorList.push({error:"",msg:"Field Should not be empty."});
			return false;
		}
		var UPLOAD_FILE_SIZE = 1 * 1024 * 1024;
		var ALLOWD_FILE_TYPE = ".zip,.txt,.apk,.ipa";
		var filename = $scope.uploadForm.file.name;
		var ext = filename.substring(filename.lastIndexOf("."),filename.length);
    	console.log(ext,filename);
    	if(ALLOWD_FILE_TYPE.indexOf(ext.toLowerCase()) == -1){
    		$scope.uploadFormErrorList.push({error:"",msg:"Only file "+ALLOWD_FILE_TYPE+" allowed to upload."});
    		return false;
		}
    	if($scope.uploadForm.file.size > UPLOAD_FILE_SIZE){
    		$scope.uploadFormErrorList.push({error:"",msg:"File size not allowed."});
    		return false;
		}
    	return true;
	}
	
	if($state.current.name == "home"){
		$scope.getDetails();
	}
	
	
	
	
	
	
});

/* Filter for file type */
app.filter("getFileType", function(){
	return function(filename){
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