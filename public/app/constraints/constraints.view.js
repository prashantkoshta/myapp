(function () {
    angular.module("app.constraints")
        .directive("constraintsViewBox", function () {
            return {
                templateUrl: "app/constraints/constraints.html",
                controller: "ConstraintsController"
            }
        });
}());