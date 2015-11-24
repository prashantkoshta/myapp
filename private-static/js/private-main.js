'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('privateMain', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise("/profile");
        
        $stateProvider.state("chpwd", {
            url: "/changepassword",
            templateUrl: "view/:changepassword",
            controller: "accountController",
            cache: false
        }) 
        .state("aboutus", {
            url: "/aboutus",
            templateUrl: "view/:aboutus",
            cache: false
        })
		.state("pwdChanged", {
            url: "/passwordchanged",
            templateUrl: "view/:passwordchanged",
            cache: false
        })
		.state("home", {
            url: "/profile",
            cache: false
        })
        .state("review", {
            url: "/profile",
            cache: false
        });
      
}]);

app.run(function ($rootScope, $templateCache, $location, $window) {
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
    });
    
    $rootScope.$on('$routeChangeSuccess', function () {
        $window.ga('send', 'pageview', { page: $location.path() });
    });
});

app.controller('privateMainController', function ($scope, $rootScope, $window) {
    $rootScope.pageError;
    $scope.setInitPageValue = function (obj){
        $rootScope.pageError = obj;
    }
});