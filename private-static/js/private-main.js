'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('privateMain', ['ui.router','ngTable','faye'])
.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
       //$urlRouterProvider.otherwise("/profile");
	   $urlRouterProvider.otherwise("/buildapp/gateway");
	
        
        $stateProvider.state("chpwd", {
            url: "/changepassword",
            templateUrl: "secureview/:changepassword",
            controller: "accountController",
            cache: false
        }) 
        .state("aboutus", {
            url: "/aboutus",
            templateUrl: "secureview/:aboutus",
            cache: false
        })
		.state("autobuild", {
            url: "/autobuild",
            templateUrl: "secureview/:autobuild",
			controller: "buildController",
            cache: false
        })
		.state("pwdChanged", {
            url: "/passwordchanged",
            templateUrl: "secureview/:passwordchanged",
            cache: false
        })
		/*.state("home", {
            url: "/profile",
            cache: false
        })*/
        .state("home",{
        	url: "/profile",
            templateUrl: "secureview/:uploaddetails",
            controller: "buildController",
            cache: false
        })
        .state("review", {
            url: "/profile",
            cache: false
        })
        .state("upload", {
        	url: "/upload",
            templateUrl: "secureview/:upload",
            controller: "buildController",
            cache: false
        });
      
}]);

app.run(function ($rootScope, $templateCache, $location, $window) {
    $rootScope.$on('$viewContentLoaded', function () {
        //$templateCache.removeAll();
    });
    
    $rootScope.$on('$routeChangeSuccess', function () {
        $window.ga('send', 'pageview', { page: $location.path() });
    });
});

app.controller('privateMainController', function ($scope, $rootScope, $window ,$state) {
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
	
	$state.go("home");
});
