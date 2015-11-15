(function () {
    angular.module("app.wmcheader")
        .controller("WmcHeaderController", function ($scope, $routeParams,wmcdataSvc,wmccollectionSvc) {
			
			 $scope.onNew = function()  {
				$scope.$emit("clickOnNew");
			 };
			 
			 $scope.onOpen = function()  {
				$scope.$emit("clickOnOpen");
			 };
			 
			 $scope.showProfile = function()  {
                // Todo show profile
				//console.log("showProfile");
            }


        });
})();