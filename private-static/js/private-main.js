'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('privateMain', ['ui.router','ui.bootstrap','ngTable','faye','ngSanitize'])
.config(['$stateProvider','$urlRouterProvider', 

	function ($stateProvider, $urlRouterProvider) {
        
       $urlRouterProvider.otherwise("/uploaddetails");
	   //$urlRouterProvider.otherwise("/buildapp/gateway");
        $stateProvider.state("home",{
        	url: "/uploaddetails",
            templateUrl: "secureview/:uploaddetails",
            controller: "buildController",
			resolve: { "authenticate": authenticate }
        })
        .state("chpwd", {
            url: "/changepassword",
            templateUrl: "secureview/:changepassword",
            controller: "accountController",
			resolve: { "authenticate": authenticate }
        }) 
        .state("aboutus", {
            url: "/aboutus",
            templateUrl: "secureview/:aboutus",
			resolve: { "authenticate": authenticate }
        })
		.state("autobuild", {
            url: "/autobuild",
            templateUrl: "secureview/:autobuild",
			controller: "autobuildController",
			resolve: { "authenticate": authenticate }
        })
		.state("pwdChanged", {
            url: "/passwordchanged",
            templateUrl: "secureview/:passwordchanged",
			resolve: { "authenticate": authenticate }
        })
		/*.state("home", {
            url: "/profile",
            cache: false
        })*/
       
        .state("review", {
            url: "/profile",
			resolve: { "authenticate": authenticate }
        })
        .state("upload", {
        	url: "/upload",
            templateUrl: "secureview/:upload",
            controller: "uploadbuildController",
			resolve: { "authenticate": authenticate }
        })		
		.state("createproject", {
        	url: "/createproject",
            templateUrl: "secureview/:createproject",
			controller: "createProjectController",
			resolve: { "authenticate": authenticate }
        })
		.state("userview", {
        	url: "/userview",
            templateUrl: "secureview/:userview",
			controller: "userviewController",
			resolve: { "authenticate": authenticate }
        })
		.state('editproject', {
            url: '/editproject',
            templateUrl: 'secureview/:editproject',
            controller: 'editProjectController',
			resolve: { "authenticate": authenticate },
			params: {
				projectid: null
			}
        })
		.state('editteam', {
            url: '/editteam',
            templateUrl: 'secureview/:editteam',
            controller: 'editTeamController',
			resolve: { "authenticate": authenticate },
			params: {
				projectid: null
			}
        })
		.state("pendingapproval", {
        	url: "/pendingapproval",
            templateUrl: "secureview/:pendingapproval",
			controller: "pendingapprovalController",
			resolve: { "authenticate": authenticate }
        })
		.state("projectaccessrequest", {
        	url: "/projectaccessrequest",
            templateUrl: "secureview/:projectaccessrequest",
			controller: "projectaccessrequestController",
			resolve: { "authenticate": authenticate }
        });
      
	  function authenticate($state,$http,$q,$window,$rootScope,$stateParams) {
		   // console.log(">>",$state);
			// console.log(">>",$state.current);
			// console.log($stateParams);
			//return $q.resolve({a:"a"});
			
			var defer = $q.defer();
			var url = "/isAuthenticated"
			//var url = $state.current.templateUrl;
			var data =  {};
			$http({"method": "get", "data":data, "url":url, headers: {"token": $rootScope.token}})
			.success(function(response,status, headers, config){
				if(response["auth-error"]) {
					var er = new Error();
					er.message = response;
					return defer.reject(er);
					$window.location.href = "/";
				} else {
					return defer.resolve();
				}
			}).error(function(err,status){
				return defer.reject(err);
			});
			
			
		}

	  
}
]);

app.run(function ($rootScope, $templateCache, $location, $window) {
    $rootScope.$on('$viewContentLoaded', function () {
        //$templateCache.removeAll();
    });
    
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	// Google Analytic Controller
		if (!$window.ga) return;
		$window.ga('set',{page: $location.path(),title: $location.path()});
        $window.ga('send', 'pageview');
    });
});

app.controller('privateMainController', function ($scope, $rootScope, $window ,$state, mainSvc,$templateCache,$location) {
	
	$rootScope.token;
	$rootScope.uinkey;
	$scope.setInitToken = function(token){
		$rootScope.token = token;
		//console.log($rootScope.token);
	}
	$scope.setInitUinKey= function(uinkey){
		$rootScope.uinkey = uinkey;
	}
	
    $rootScope.pageError;
    $scope.setInitPageValue = function (obj){
        $rootScope.pageError = obj;
    }
    
    
    // Google Analytic Controller
    $rootScope.setGA = function(analyticObject){
    	//{'type':'event','eventType':'eventType','msg':''}
    	if (!$window.ga) return;
        $window.ga('send', analyticObject.event, analyticObject.eventType,analyticObject.msg);
    }
	
	$scope.onLogout = function(){
		$templateCache.removeAll();
		 mainSvc.getCommon("/logout",{}).then(
            function (response) {
				 $window.location.href = "/";
            },
            function (err) {
                console.log("Error >>>", err); 
				$window.location.href = "/";
            }
        );
	}
	
	$(window).unload(function(){
		mainSvc.getCommon("/logout",{}).then(
            function (response) {},
            function (err) {}
        );
	});
	//$state.transitionTo('home');
	//$state.go("home");
	$rootScope.setGAPage = function(analyticObject){
		if (!$window.ga) return;
		$window.ga('set',{page: analyticObject.page,title: analyticObject.title});
        $window.ga('send', 'pageview');
	}
});
