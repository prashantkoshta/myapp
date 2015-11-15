(function () {
    var name = "app.shell",
        requires = ["ngRoute"];

    angular.module(name, requires)
        .config(function ($routeProvider) {
            $routeProvider
  				.when("/", {
                    templateUrl: "app/main/main.html",
                    controller: "MainController"
                })
            .otherwise({
                redirectTo: "/"
            })
        })
})();