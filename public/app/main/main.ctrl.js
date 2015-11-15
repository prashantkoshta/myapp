(function () {
    angular.module("app.main")
        .controller("MainController", function ($rootScope,$scope,$routeParams,$timeout,$window,wmcdataSvc,wmccollectionSvc,wmcJsonSvc) {
		
			
			$scope.test = $scope.objCurrentWS;
			$scope.isWorkAreaVisible = false;

			
			// Adding emit listners
			$scope.$on("showMatrix", showMatrixView);
			//dispatch from navctrl
			$scope.$on("showTable", showTableView);
			$scope.$on("showSummaryView", showSummaryView);
			$scope.$on("showAddConstraints", showAddConstraintsView);
			
			// dispatch from Tabbar on close click.
			$scope.$on("closeWorkSpace", closeWorkSpace);
			$scope.$on("onNavTabClick",assignTabWorkSapceData);
			
			// dispatch from header
			$scope.$on("clickOnNew",addNewWorkSpace);
			$scope.$on("clickOnOpen",openWorkSpacePopup);
			//dispatch from wsmodal
			$rootScope.$on("clickOnWSOpen",openSelectedWS);
			// dispatch from navbar
			$scope.$on("clickOnDeleteWS",deleteWorkSpace);
			// dispatchf rom navvar
			$scope.$on("clickOnCloneWS",cloneWorkSpace);
			
			// dispatch from table ctrl
			$scope.$on("clickOnDeleteRow",deleteRow);
			
			// dispatchf rom navvar
			$scope.$on("clickOnSaveWS",saveWorkSpace);
			
			//dispatch from delete 
			$rootScope.$on("deleteConfirmAction",onConfirmDelete);
			
			// dispatch from nav ctrl
			$scope.$on("clickOnRun",doRunWS);
			
			//dispatch from tab bar
			$scope.$on("onUpdateDescEvt",updateCurrentWSDesc);
			
			
			
			//
			reqinIndices();
			reqBenchMarkData();
			
			
		
			
			$scope.showCurrentView = function(ui){
				//console.log("showCurrentView",ui);
				if(ui== $scope.currentView) return true;
				return false;
				
			}
			
			
			
            function addNewWorkSpace(){
				//console.log("onNew");
				if(!wmccollectionSvc.boolAddNewWSAvail($scope.workSpaceList,$scope.maxTabCount)) {
					$scope.$broadcast("toggleMaxTabPopup",null);
					return;
				}
				var ws_tab_data = wmccollectionSvc.getNewWorkSpaceData();
				//return 	{"ws":ws,"ws_data":ws_data};
				$scope.workSpaceList.push(ws_tab_data.ws);
				//$scope.objGlobalWS.push(ws_tab_data.ws_data);				
				var obj = wmccollectionSvc.addWSTabData(ws_tab_data.ws_data,ws_tab_data.ws.id,$scope.objGlobalWS);
				//return {"global":gWSObj,"objCurrentWS":gWSObj[wsid],"currentWSID":wsid}
				$scope.objGlobalWS = obj.global;
				$scope.objCurrentWS = obj.objCurrentWS;
				$scope.currentWSID = obj.currentWSID;
				$scope.isWorkAreaVisible = true;
				//$scope.objCurrentWS.positions.push(addEmptyPosition());
				
				$scope.$emit("addNewTabbar", $scope.workSpaceList);
				startUpdateView();				
            }
			function addEmptyPosition(){
				return {
					"id": "Index1",
					"description": "Index 1",
					"taggroup" : "A",
					"mv": 0.25,
					"ctd": 0.4,
					"cdst": 0.2,
					"expreturn":2.22,
					"haircut": 0.1,
					"rating": 0.1,
					"duration": 4,
					"spreaddur" : 1,
					"ytw": 0.3,
					"oas" : 0.2,
					"volatility" : 0.5,
					"skew":-2.2,
					"sharpe":2
					
				};
			}
			
			
			function updateCurrentWSDesc(evt,data){
				$scope.objCurrentWS.workspacedesc = data;
			}
			
			
			
			function reqForWSList()  {
                // Todo on open activity
				//console.log("onOpen");
				wmcdataSvc.getWorkSpace()
                    .then(
                        function (response) {
							$scope.wdData = response.workspace;
							//console.log("workspace list :",$scope.wdData);
							$scope.$broadcast("toggleWSPopup",$scope.wdData);
							
							
                        },
                        function (err) {
                            //console.log("error finding : ", err);
                        }
					);
            }
		
			function reqBenchMarkData(){
					// bench mark data
				wmcdataSvc.getBenchmarks()
                    .then(
                        function (response) {
                           
							$scope.benchmarks = response.benchmarks;
							//console.log("wmcdataSvc:", $scope.benchmarks );
							$scope.$emit("benchmarks", $scope.benchmarks);
                        },
                        function (err) {
                            //console.log("error finding : ", err);
                        }
					); 	
			}
			
			
			//reqinIindicesData(indicesId);
			function reqinIndices(){
					// bench mark data
				wmcdataSvc.getIndices()
                    .then(
                        function (response) {
                           
							$scope.indicesList = response.Indices;
							//console.log("wmcdataSvc:getIndices", $scope.indicesList);
							$scope.$broadcast("onGetIndices", $scope.indicesList);
                        },
                        function (err) {
                            //console.log("error finding : ", err);
                        }
					); 	
			}
			
			function reqinIindicesData(indicesId){
					// bench mark data
				wmcdataSvc.getIndicesData(indicesId)
                    .then(
                        function (response) {
                           
							$scope.benchmarks = response.benchmarks;
							//console.log("wmcdataSvc:", $scope.benchmarks );
							$scope.$emit("benchmarks", $scope.benchmarks);
                        },
                        function (err) {
                            //console.log("error finding : ", err);
                        }
					); 	
			}
			
			function openWorkSpacePopup(){
				//console.log("openWorkSpacePopup");
				reqForWSList();
			}
			
			
			function openSelectedWS(evt,item){
				//console.log("openSelectedWS",item);
				if(item == undefined && item == null) return;
				
				var bool = wmccollectionSvc.isWorkSpaceAlreadyOpen($scope.workSpaceList,item.id);
				//console.log("----------- bool: ",bool);
				if(bool){
					setCurrentWorkSpaceData(item.id)
				}else{
					if(!wmccollectionSvc.boolAddNewWSAvail($scope.workSpaceList,$scope.maxTabCount)) {
						$scope.$broadcast("toggleMaxTabPopup",null);
						return;
					}
					$scope.workSpaceList.push(item);
					$scope.$emit("addNewTabbar", $scope.workSpaceList);
					$scope.isWorkAreaVisible = true;
					fetchWorkspaceData(item);
				}
			}
			
			
			$scope.boolMatirxView = false;
			$scope.currentView ="table";
			$scope.boolSummaryView = false;
			$scope.boolConstraintsView = false;
			
			
			function deleteWorkSpace(evt,ws_id){
				//console.log("dispatch:");
				$scope.$broadcast("toggleDelWSPopup",ws_id);
			}
			
			function deleteRow(evt,row){
				console.log("deleteRow: ",evt,row);
				$scope.$broadcast("toggleDelRowPopup",row);
			}
			
			
			function onConfirmDelete(evt,ws_id){
				//console.log("onConfirmDelete : ",ws_id);
				sendReqForDeleteWS(ws_id);
			}
			
			var xSeriesChartData = [];
			var ySeriesChartData = [];
			var dBenchMarkChartData = [];
			
			function doRunWS(evt,obj){
				console.log("doRunWS : ",obj);
				/*var navObj = {
                    "series":true,
                    "riskAversionCoeff": 0.004,
                    "benchmark" : {
					    "name": "AGG",
					    "return": 0.9,
					    "risk": 0.6610
					  },
                    "chart" : "New",
                    "summaryView" : false,
                    "constraints" : false,
                    "matrix" : false,
                    "table" : true

                };*/
                //$scope.objCurrentWS["navObj"] = navObj;
				var navObj = $scope.objCurrentWS["navObj"];
				if($scope.objCurrentWS.navObj.riskAversionCoeff == ""){
					$scope.$broadcast("toggleWarningChartPopup","You have to enter Risk Aversion.");
					return;
				}
				
				if(!$scope.objCurrentWS.navObj.series){
					reqForOptimizerData($scope.objCurrentWS);
				}else if($scope.objCurrentWS.navObj.series && $scope.objCurrentWS.navObj.chart == "None"){
						$scope.$broadcast("toggleWarningChartPopup","You have to select chart.");
				}else if($scope.objCurrentWS.navObj.series && $scope.objCurrentWS.navObj.chart != "None") {
					// Pass series data
					xSeriesChartData = [];
					ySeriesChartData = [];
					dBenchMarkChartData = [];
					var arSerVal = $scope.riskAvrSeries;
					var len = arSerVal.length;
					for(var i = 0;i<len;i++){
						var newnavObj = angular.copy($scope.objCurrentWS.navObj);
						newnavObj["benchmark"] = arSerVal[i];
						xSeriesChartData[i] = arSerVal[i];
						dBenchMarkChartData [i] = navObj["benchmark"];
						var copyWs = angular.copy($scope.objCurrentWS);
						copyWs["navObj"] = newnavObj;
						reqForOptimizerChartData(copyWs,i,len-1);
					}
					 
				}				
				
			}
			
			function reqForOptimizerChartData(wsObj,cnt,len){
				var opt_m_req = wmcJsonSvc.getOptimizerReqJson(wsObj);
				wmcdataSvc.postOptimizer(opt_m_req)
				.then(
					function (response) {
						// TO do for run services
						console.log("reqForOptimizerData response>>>>>",cnt,response);
						var opt = response.optimizer;
						ySeriesChartData[cnt] = opt["return"];
						if(cnt == len){
							//console.log("Plot Chart :",xSeriesChartData,ySeriesChartData,dBenchMarkChartData);
							startChartPlot(xSeriesChartData,ySeriesChartData,dBenchMarkChartData);
						}
					},
					function (err) {
						//console.log("error finding : ", err);
					}
				); 
			}
			
			
			function reqForOptimizerData(wsObj){
				var opt_m_req = wmcJsonSvc.getOptimizerReqJson(wsObj);
				wmcdataSvc.postOptimizer(opt_m_req)
				.then(
					function (response) {
						// TO do for run services
						console.log("reqForOptimizerData >>>>>",response)
						$scope.objCurrentWS["summary"] = {};
						var summary = $scope.objCurrentWS.summary;
						summary["var"] = response.optimizer["var"];
						summary["cvar"] = response.optimizer["cvar"];
						summary["varskew"] = response.optimizer["varskew"];
						summary["cvarskew"] = response.optimizer["cvarskew"];
						summary["mcdd"] = response.optimizer["mcdd"];
						summary["histdd"] = response.optimizer["histdd"];
						summary["months"] = response.optimizer["months"];
						$scope.objCurrentWS.positions = response.positions;
						console.log(response);
					},
					function (err) {
						//console.log("error finding : ", err);
					}
				); 
			}
			
			function callBackMe(){
				console.log("Yes i called.");
			}
			var loadDone = false;
			function startChartPlot(xSer,ySer,bSer){
				//console.log("startChartPlot :");
				if($scope.chartWindow==null){
					$scope.chartWindow = $window.open("riskvsreturn.html", "_target","width=1200,height=500,left=200,top=5,toolbar=0,resizable=no,scrollbars=0,toolbar=0,menubar=0,location=0,directories=0,channelmode=0,titlebar=no,addressbar=no,status=0");
					$timeout(function() {
							$scope.chartWindow.focus();
					}, 1000);
				}
				

				if($scope.chartWindow == undefined){
					$scope.chartWindow = null;
					$scope.$broadcast("toggleWarningChartPopup","Plase disable popup blocker for this site. Then try again.");
					return;
				}

				createSeriesData(xSer,ySer,bSer);
				if(!loadDone){
					$scope.chartWindow.addEventListener("load", function() {
						console.log("I am load now");
						loadDone = true;
						$scope.chartWindow.chartAPI.addSeries($scope.seriesPushed[0]);
						$scope.chartWindow.chartAPI.setCopyToWorkspace(copyToWorkspaceCb);
						$scope.chartWindow.chartAPI.setCopyToNewWorkspace(copyToNewWorkspaceCb);

						$scope.chartWindow.addEventListener("unload",function(){
							console.log("I am unload now");
							loadDone = false;
							$scope.chartWindow = null;
							$scope.seriesPushed = [];
							
						});	

					});
					
				}else{
					$scope.chartWindow.chartAPI.addSeries($scope.seriesPushed[0]);
					$scope.chartWindow.chartAPI.setCopyToWorkspace(copyToWorkspaceCb);
					$scope.chartWindow.chartAPI.setCopyToNewWorkspace(copyToNewWorkspaceCb);
				}





				
				
				
			}

			function copyToWorkspaceCb(data) {
				console.log("copyToWorkspaceCb()",data);
				addNewWorkSpace();
			}

			function copyToNewWorkspaceCb(data) {
				console.log("copyToNewWorkspaceCb()",data);
				addNewWorkSpace();
			}

			function createSeriesData(xSer,ySer,bSer) {
				var seriesData = [];
				var data;

				for (var ii = 0, len = xSer.length; ii < len; ii++) {
					data = {
						name: 'Plot ' + ($scope.seriesPushed.length + 1),
					};
					data.x = xSer[ii];
					data.y = ySer[ii];
					data.total = bSer[ii];
					data.positions = [];
					seriesData.push(data);
				}

				$scope.seriesPushed.push(seriesData);
				console.log("$scope.seriesPushed:: ", $scope.seriesPushed);
			}
			
			function saveWorkSpace(evt,ws_id){
				console.log("saveWorkSpace : ");
				var ws = wmcJsonSvc.getSaveReqJson($scope.objCurrentWS);
				wmcdataSvc.postWorkSpaceData(ws)
                    .then(
                        function (response) {
							console.log(">>>");
                        },
                        function (err) {
                            console.log("error finding : ", err);
                        }
                    ); 
			}
			
			function cloneWorkSpace(evt,ws_id){
				//console.log("cloneWorkSpace : ",ws_id,$scope.workSpaceList,$scope.objGlobalWS);
				if(!wmccollectionSvc.boolAddNewWSAvail($scope.workSpaceList,$scope.maxTabCount)) {
					$scope.$broadcast("toggleMaxTabPopup",null);
					return;
				}
				var obj = wmccollectionSvc.getCloneWSObjects(ws_id,$scope.workSpaceList,$scope.objGlobalWS);
				//return {"wsList":wsList,"wsData":wsData,"new_wsid":cloneWSId,"old_wsid":ws_id}
				//return 	{"ws":ws,"ws_data":ws_data};
				/*$scope.workSpaceList.push(ws_tab_data.ws);
				$scope.objGlobalWS.push(ws_tab_data.ws_data);
				$scope.objCurrentWS = ws_tab_data.ws_data;
				$scope.currentWSID = ws_tab_data.ws.id;*/
				
			}
			
			function closeWorkSpace(evt, data){
				//console.log("closeWorkSpace : ",data,$scope.workSpaceList);
				if($scope.workSpaceList.length==0) $scope.isWorkAreaVisible = false;
				setCurrentWorkSpaceData(data.new_wsid);
			}
			
			
			function showMatrixView(evt, data) {
                //console.log("showMatrixView");
				$scope.currentView ="matrix";
            }
			
			function showTableView(evt, data) {
                //console.log("showTableView...");
				$scope.currentView ="table";
            }
			
			function showSummaryView(evt, data) {
				//console.log("showSummaryView");
                $scope.boolSummaryView = true;
				$scope.boolConstraintsView = false;
            }
			
			function showAddConstraintsView(evt, data) {
				//console.log("showAddConstraintsView");
				$scope.boolSummaryView = false;
				$scope.boolConstraintsView = true;
                
            }
			
			function assignTabWorkSapceData(evt,ws_data){
				//console.log("assignTabWorkSapceData",ws_data);
				setCurrentWorkSpaceData(ws_data.ws.id);
			}
			
			function setCurrentWorkSpaceData(new_wsid){
				console.log("setCurrentWorkSpaceData :");
				$scope.objCurrentWS = wmccollectionSvc.getWorkSpaceDataById($scope.objGlobalWS,new_wsid);
				$scope.currentWSID = new_wsid;
				//console.log($scope.objGlobalWS);
				//console.log($scope.objCurrentWS);
				startUpdateView();
			}
			
			
			
			function fetchWorkspaceData (ws_data){
				//console.log("Tab Click : ",ws_data);
					
				if(wmccollectionSvc.isUserCreatedWS(ws_data.id)) return;
				//$scope.$emit("addTabs", { ws: ws_data });
				wmcdataSvc.getWorkSpaceData(ws_data.id)
                    .then(
                        function (response) {
							var obj = wmccollectionSvc.addWSTabData(response,ws_data.id,$scope.objGlobalWS);
							//return {"global":gWSObj,"objCurrentWS":gWSObj[wsid],"currentWSID":wsid}
							$scope.objGlobalWS = obj.global;
							$scope.objCurrentWS = obj.objCurrentWS;
							$scope.currentWSID = obj.currentWSID;
							//console.log(">>>",$scope.objCurrentWS);
							$scope.$broadcast("workSpaceDataGet", {ws_data:$scope.objCurrentWS,indices:$scope.indicesList});
							startUpdateView();
                        },
                        function (err) {
                            //console.log("error finding : ", err);
                        }
                    ); 
			}
			
			function sendReqForDeleteWS(ws_id){
				//console.log("##sendReqForDeleteWS:",$scope.workSpaceList,ws_id);
				// Add here delete workspace logic
				/**/
				if(!wmccollectionSvc.isWSIDPresent(ws_id,$scope.wdData)){
					nowDeleteWSCollection(ws_id)
					return;
				}
				wmcdataSvc.deleteWorkSpaceData(ws_id)
				.then(
					function (response) {
						// On Done
						nowDeleteWSCollection(ws_id)
					},
					function (err) {
						//console.log("error finding : ", err);
					}
				); 
			}
			
			function nowDeleteWSCollection(ws_id){
				//console.log("nowDeleteWSCollection :",ws_id);
				delete $scope.objGlobalWS[ws_id];
				var key = wmccollectionSvc.getWorkSpaceIndex($scope.workSpaceList,ws_id);
				var obj = wmccollectionSvc.removeWSList($scope.workSpaceList,key);
				$scope.workSpaceList = obj.wsList;
				$scope.objCurrentWS = wmccollectionSvc.getWorkSpaceDataById($scope.objGlobalWS,obj.new_wsid);;
				$scope.currentWSID = obj.new_wsid;
				//console.log('$scope.objGlobalWS :',$scope.objGlobalWS,'$scope.workSpaceList:',$scope.workSpaceList,'$scope.objCurrentWS:',$scope.objCurrentWS,'$scope.currentWSID:',$scope.currentWSID);
				if($scope.workSpaceList.length==0) $scope.isWorkAreaVisible = false;
				startUpdateView();
			}
			
			function startUpdateView(){
				console.log("***startUpdateView:***",$scope.objCurrentWS);
				if($scope.objCurrentWS!=undefined){
					$scope.$broadcast("startUpdateView");
				}
				
			}
			
			
			
			//
			
			//Object to check for field name to display group edit tooltip array
			$scope.tableGroupEditTooltipArray = {
				"mv_min" :"mv_min",
				"mv_max" :"mv_max",
				"ctd_min" :"ctd_min",
				"ctd_max" :"ctd_max"
			};
			
			
			$scope.showTip = function(evt,data){
				//console.log("showTip:",evt,data);
				console.log("showTip:",data);
				
				if(data.type == 'table_edit_popop'){
					if(data.item.col.field == 'rating'){
						$rootScope.$broadcast("openToolTipRating",{"event":evt,"data":data});
					}else if(data.item.col.field == 'description'){
						$rootScope.$broadcast("openToolTipGroup",{"event":evt,"data":data});
					}else if(data.item.row.entity.isGroupColumn || $scope.tableGroupEditTooltipArray.hasOwnProperty(data.item.col.field)){
						$rootScope.$broadcast("openTooltipTableGroupEdit",{"event":evt,"data":data});
					} else {
						$rootScope.$broadcast("openToolTipTable",{"event":evt,"data":data});
					}
				} else {
					$rootScope.$broadcast("openToolTip",{"event":evt,"data":data});
				}
				event.stopPropagation(evt);
			}
			
            $scope.showMatrixMouseOver = function(evt,data){
				$rootScope.$broadcast("hoverToolTip",{"event":evt,"data":data});
				event.stopPropagation(evt);
            }
			
			 $scope.showTableMouseOver = function(evt,data){
				$rootScope.$broadcast("hoverToolTipTable",{"event":evt,"data":data});
				event.stopPropagation(evt);
            }
			
			
        });

					
})();