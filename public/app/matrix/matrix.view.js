(function () {
    angular.module("app.matrix")
        .directive("matrixViewBox", function () {
            return {
                templateUrl: "app/matrix/matrix.html",
                controller: "MatrixController"
            }
        });
}());