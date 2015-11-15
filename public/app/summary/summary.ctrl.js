(function () {
    angular.module("app.summary")
        .controller("SummaryController", function ($scope, $routeParams) {
			
			$scope.$on("showSummaryView", showSummaryView);	
			
			function showSummaryView(evt, data) {
				//console.log("123"+ $scope.objCurrentWS);
				$scope.summaryList = $scope.objCurrentWS.summary;
				/*$scope.summaryList = { 
						'rating':"A+",
						'dur':2.2,
						'ytw': 2.22,
						'expreturn':2.22 ,
						'vol':222,
						'skew':-2.2,
						'var':2.5,
						'cvar':2.2,
						'varskew':2.5,
						'cvarskew':2.2,
						'mcdd':-2.22,
						'histdd':-2.22,
						'months':2
				}*/      
			
            }
			
            $scope.closeSummaryView = function(){
				//console.log("Close"+ $scope.objCurrentWS);
				$scope.boolSummaryView = false;
				$scope.$broadcast('closeActiveSummaryView', null);
			}
			
			
			

        });
})();