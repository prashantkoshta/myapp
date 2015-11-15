(function () {
    angular.module("app.table")
        .directive("tableViewBox", function () {
            return {
                templateUrl: "app/table/table.html",
                controller: "TableController"
            }
        });
}());