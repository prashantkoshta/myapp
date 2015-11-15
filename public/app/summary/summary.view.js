(function () {
    angular.module("app.summary")
        .directive("summaryViewBox", function () {
            return {
                templateUrl: "app/summary/summary.html",
                controller: "SummaryController"
            }
        });
}());