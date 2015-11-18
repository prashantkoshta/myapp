'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('publicMain', [
  'ngRoute'
]).
config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
		when("/loginview",{
			templateUrl: 'view/:login',
			controller: 'loginController'
		}).
		when("/aboutus",{
			templateUrl: 'view/:aboutus'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);

app.run(function($rootScope, $templateCache, $location, $window) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        $window.ga('send', 'pageview', $location.absUrl());
    });

});

app.controller('publicMainController', function($scope,$rootScope) {
	$rootScope.loginError = false;
});