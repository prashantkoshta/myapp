(function(){
	var name ="app",
	requires = [
		'app.public.login'
	];
	angular.module(name,requires).
		run(['$route',function($route){
			$route.reload();
	}]);
})();