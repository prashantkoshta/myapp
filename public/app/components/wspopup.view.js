(function () {
    angular.module("app.components")
        .directive("wsModal", function () {
             return {
                  controller: "WSPopupController"
				};
        });
}());