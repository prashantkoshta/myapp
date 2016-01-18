'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('publicMain', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise("/");
        
        $stateProvider.state("loginview", {
            url: "/loginview",
            templateUrl: "view/:login",
            controller: "loginController",
            cache: false
        })
        .state("forgotpassword", {
            url: "/forgotpassword",
            templateUrl: "view/:forgotpassword",
            controller: 'loginController',
            cache: false
        })
        .state("aboutus", {
            url: "/aboutus",
            templateUrl: "view/:aboutus",
            cache: false
        })
        .state("sentpassword", {
            url: "/sentpassword",
            templateUrl: "view/:sentpassword",
            cache: false
        })
 		.state("home", {
            url: "/",
			 templateUrl: "view/:home",
            cache: false
        })
        .state("review", {
            url: "/",
            cache: false
        });
      
}]);

app.run(function ($rootScope, $templateCache, $location, $window) {
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
    });
    
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	// Google Analytic Controller
		if (!$window.ga) return;
		$window.ga('set',{page: $location.path(),title: $location.path()});
        $window.ga('send', 'pageview');
    });
});

app.controller('publicMainController', function ($scope,$rootScope,$window,$state, $interval,$location) {
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
   
    $rootScope.setGAPage = function(analyticObject){
		if (!$window.ga) return;
		$window.ga('set',{page: analyticObject.page,title: analyticObject.title});
        $window.ga('send', 'pageview');
	}
   

	
});