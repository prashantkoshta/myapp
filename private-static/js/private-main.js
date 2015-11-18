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

app.run(function($rootScope, $templateCache, $location, $window) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
    });

   $rootScope.$on('$routeChangeSuccess', function () {
        $window.ga('send', 'pageview', { page: $location.path() });
    });
});
