(function () {
    angular.module("app.wmcheader")
        .directive("wmcheaderViewBox", function () {
            return {
                templateUrl: "app/wmcheader/wmcheader.html",
                controller: "WmcHeaderController"
            }
        });
}());