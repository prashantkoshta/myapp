(function () {
    var name = "app",
        requires = [
            "app.shell",
			"app.main",
            "app.data",
			"app.wmcheader",
			"app.navbar",
			"app.matrix",
			"app.table",
			"app.summary",
			"app.constraints",
			"app.tabbar",
			"app.components"
        ];

    angular.module(name, requires)
        .run(['$route', function ($route) {
            $route.reload();
        }]);
})();