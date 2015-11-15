(function () {
    angular.module("app.navbar")
        .controller("WmcTopNavigation", function ($scope, $routeParams, $window) {
    
			$scope.seriesVal = "series"
			//$scope.chartList = $scope.chartTypeList;
			$scope.benchmarkList = $scope.benchmarks;
            var navObject =  null;
            
            //console.log($scope.navObject);
			
			$scope.newChartNm = "";
			
			$scope.$on("startUpdateView", startNavBarUpdateView);
			$scope.$on("closeActiveSummaryView", closeActiveSummaryView);
			$scope.$on('closeActiveConstraintsView', closeActiveConstraintsView);
        
        
           /* "navObj" :{
                "series":true,
                "riskAversionCoeff": 0.11,
                "benchmark" : "ACG",
                "chart" : "New",
                "summaryView" : true,
                "constraints" : true,
                "matrix" : true,
                "table" : true
                
            } */
            //console.log("Nav Object",$scope.navObject);
            
            function updateView(navObj){
                // To do enable and disable
                //$scope.boolRiskAversionDisable = navObj.series;
                $scope.riskAversionVal = navObj.riskAversionCoeff;
                $scope.selectedbenchmarkList = navObj.benchmark.name;
                $scope.selectedChartName = navObj.chart;
                $scope.selectedSeries = navObj.series;
                $scope.isSummarySelected = navObj.summaryView;
                $scope.isConstraintsSelected = navObj.constraints;
                $scope.isExapnd = navObj.expand;
                $scope.chartList = navObj.chartList;
                $scope.selectedChartName = navObj.chart;
            }
        
            function getDefaultView(){
                var navObj = {
                    "series":"no_series",
                    "riskAversionCoeff": 0.001,
                    "benchmark" : {
					    "name": "AGG",
					    "return": 0.9,
					    "risk": 0.6610
					 },
                    "chart" : "None",
                    "summaryView" : false,
                    "constraints" : false,
                    "matrix" : false,
                    "table" : true,
                    "expand" : false,
                    "chartList": ['None', 'New']

                };
                $scope.objCurrentWS["navObj"] = navObj;
                return navObj;
            }
        
            function setNavView(navObj,key,value){
                console.log("setNavView ",key,value)
                navObj[key] = value;
            }
              
			
			$scope.onSeriesSelection = function(val){
				$scope.seriesVal = val;
				$scope.boolRiskAversionDisable = (val == "series")?true:false;
			}
			
			$scope.$on("benchmarks", function(evt, data) {
				$scope.benchmarkList = data;
			});
			
			//console.log("---WmcTopNavigation-------------",$scope.benchmarkList);
			
			$scope.isExapnd = false;

            $scope.showTable = function()  {
                 // Todo on open activity
				//console.log("showTable");
                setNavView(navObject,"table", true);
                setNavView(navObject,"matrix", false);
				$scope.$emit("showTable", { str: "showTable" });
                
            };
			
			$scope.showMatrix = function()  {
                 // Todo on open activity
				//console.log("showMatrix");
                setNavView(navObject,"table", false);
                setNavView(navObject,"matrix", true);
				$scope.$emit("showMatrix", { str: "showMatrix" });
            };
			
			$scope.onSave = function()  {
                // Todo on open activity
				//console.log("onSave");
				$scope.$emit("clickOnSaveWS", $scope.currentWSID);
            };
			
			$scope.onClone = function()  {
                // Todo on open activity
				//console.log("onClone");
				$scope.$emit("clickOnCloneWS", $scope.currentWSID);
            };
			
			$scope.showSummaryView = function()  {
                 // Todo on open activity
				//console.log("showSummaryView");
				$scope.isSummarySelected = true;
				$scope.isConstraintsSelected = false;
                setNavView(navObject,"constraints", false);
                setNavView(navObject,"summaryView", true);
				$scope.$emit("showSummaryView", { str: "showSummaryView" });
            };
			
			function closeActiveSummaryView(){
				$scope.isSummarySelected = false;		
            };
			
			$scope.showAddConstraints = function()  {
                 // Todo on open activity
				//console.log("showAddConstraints");
				$scope.isConstraintsSelected = true;
				$scope.isSummarySelected = false;
                setNavView(navObject,"constraints", true);
                setNavView(navObject,"summaryView", false);
				$scope.$emit("showAddConstraints", { str: "showAddConstraints" });
            };
			
			function closeActiveConstraintsView(){
				$scope.isConstraintsSelected = false;		
            };
			
			$scope.onDeleteWorkSpace = function()  {
                 // Todo on open activity
				$scope.$emit("clickOnDeleteWS", $scope.currentWSID);
            };
			
			$scope.onRun = function()  {
                // Todo on open activity
		 		$scope.$emit("clickOnRun",$scope.currentWSID);
            };
			
			
			$scope.onExpand = function(flag)  {
                 // Todo on open activity
				//console.log("onExpand");
				$scope.isExapnd = !$scope.isExapnd;
                setNavView(navObject,"expand", $scope.isExapnd);
            };
			
			function startNavBarUpdateView(){
                console.log("startNavBarUpdateView",$scope.objCurrentWS);    
               if(!$scope.objCurrentWS.hasOwnProperty("navObj") && $scope.objCurrentWS.navObj == undefined){
                   //alert("Undefined");
                   navObject = getDefaultView();
                   updateView(navObject);
                   console.log("When object is undefined",$scope.objCurrentWS.navObj);
                   //$scope.navObject =  $scope.objCurrentWS.navObj;
                   
               }
                else{
                    navObject = $scope.objCurrentWS["navObj"];
                    updateView(navObject);
                    console.log("When object is defined",$scope.objCurrentWS.navObj);
                }
                
                
				//$scope.objCurrentWS = ws_tab_data.ws_data;
				//$scope.currentWSID = ws_tab_data.ws.id;
			}
	//code for dropdown
			//$scope.selectedChartName = $scope.objCurrentWS.selectedChart;
			$scope.getSelectedChartdd = function(data){
				$scope.selectedChartName = data;
                setNavView(navObject,"chart", data);
			};

			$scope.addNewChartName = function(newChart){
				if ($scope.chartList.indexOf(newChart) > -1) {
					//alert(found);					
				}else{
					$scope.chartList.push(newChart);
				}
                setNavView(navObject,"chartList", $scope.chartList);
				$scope.newChartNm = "";
			};
			
			//$scope.selectedbenchmarkList = $scope.objCurrentWS.selectedBenchmark;
			$scope.getSelectedBenchmarkdd = function(data){
				$scope.selectedbenchmarkList = data.name;
                setNavView(navObject,"benchmark.name", data.name);
			};

			//reset nav bar view
			$scope.resetNavBarView = function() {
				if ($scope.isExapnd) {
					$scope.isExapnd = !$scope.isExapnd;
				}	
				/*angular.forEach(navArr, function(item) {
		          //console.log(item);
		          $scope[item] = (str == item);
		        });
				$scope.isActiveSecond = false;
				$scope.isActiveFirst = true;*/

			};	
    	
            $scope.onChangeRiskAvr = function (val){
                     setNavView(navObject,"riskAversionCoeff", val);
            }
            
            $scope.onChangeSeries = function(val){
                //$scope.selectedSeries = val;
                setNavView(navObject,"series", val);
            }
                    
        
			$scope.isSelectedSeries = function(val){
               // var bool =  (val == "series") ? true :false;
				return val === $scope.selectedSeries;
                //setNavView(navObject,"series", $scope.selectedSeries);
                //selectedSeries
			};
            
    	

        });
})();