'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('privateMain', [
  'ngRoute'
]).
config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
		when("/aboutus",{
			templateUrl: 'view/:aboutus'
		}).
		otherwise({
			redirectTo: '/profile'
		});
}]);

app.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});
