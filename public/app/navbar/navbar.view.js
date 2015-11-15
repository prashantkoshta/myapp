(function () {
    angular.module("app.navbar")
        .directive("navViewBox", function () {
            return {
                templateUrl: "app/navbar/navbar.html",
                controller: "WmcTopNavigation"
            }
        });
}());