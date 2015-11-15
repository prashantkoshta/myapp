(function () {
    angular.module("app.shell")
        .controller("Shell", function ($scope) {
			
			// Global variable
			$scope.workSpaceList = [];
			$scope.objGlobalWS = [];
			$scope.objCurrentWS = {};
			$scope.currentWSID = "";
			$scope.benchmarks = [];
			
			// Use for ws popup list
			$scope.wdData = [];
			
			// Count to restrict max limit of open tab.
			$scope.maxTabCount = 10;
			
			// Number of chart type
			$scope.chartTypeList = ["None", "New"];
			
			$scope.indicesList = [];
			
			$scope.arRating = [
				"AAA",
				"AA+",
				"AA",
				"AA-", 
				"A+",
				"A",
				"A-",
				"BBB+",
				"BBB",
				"BBB-",
				"BB+",
				"BB",
				"BB-",
				"B+",
				"B",
				"B-",
				"CCC+",
				"CCC",
				"CCC-",
				"CC",
				"C",
				"D"
			];
			
			$scope.riskAvrSeries = [0.005,0.0045,0.006,0.023,0.009,0.007];
			
			
			$scope.chartWindow = null;
			
			$scope.seriesPushed = [];

			//'description','mv','ctd','cdst','expreturn','haircut','rating','duration','spreaddur','ytw','oas','volatility','skew','sharpe','mv_max','mv_min','ctd_min','ctd_max',
			
			
			
        });
})();