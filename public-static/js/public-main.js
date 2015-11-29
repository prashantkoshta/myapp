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
    
    $rootScope.$on('$routeChangeSuccess', function () {
    	// Google Analytic Controller
        console.log($location.path());
        console.log($location.url());
        $window.ga('send', 'pageview', { page: $location.path()});
    });
});

app.controller('publicMainController', function ($scope, $rootScope, $window) {
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
    
    
});