(function () {
    angular.module("app.tabbar")
        .directive("tabViewBox", function () {
            return {
                templateUrl: "app/tabbar/tabbar.html",
                controller: "WmcTabController"
            }
        });
}());