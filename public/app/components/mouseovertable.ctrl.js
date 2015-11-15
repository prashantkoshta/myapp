(function () {
    angular.module("app.components")
        .controller("WmcMouseoverTableController", function ($scope,$rootScope) {
			console.log("WmcMouseoverTableController");
			
			$rootScope.$on("hoverToolTipTable",showMouseOverTableData);
			$scope.InfoTop = 10;
			$scope.InfoLeft = 50;
			$scope.visibleInfoTable = false;
			$scope.type = "";
            $scope.changedValue="";
			
         
			function showMouseOverTableData(evt,data) {
				console.log("InfotipEvent",evt);
				$scope.type = data.data.type;
				//table_info_popop
				if($scope.type == 'table_info_popop'){
					
					//$scope.visibleInfoTable = true;
					//Function for detecting the change value
					$scope.tableListOverrides = $scope.objCurrentWS.overrides;
					
					console.log("data data: ",data)
					var currentColField = data.data.item.col.field;
					var currentRowEntityId = data.data.item.row.entity.id;
					
					for (key in $scope.tableListOverrides){
						if($scope.tableListOverrides[key].id == currentRowEntityId){
							
							$scope.currentColumnList = [];
							var colCurrent = $scope.tableListOverrides[key];
							for(i in colCurrent){
								$scope.currentColumnList.push(i);
							}
							for(i=0; i<$scope.currentColumnList.length; i++){
								var curr = $scope.currentColumnList[i];
								if($scope.currentColumnList[i] == currentColField){
									$scope.visibleInfoTable = true;
									$scope.changedValue = data.data.item.row.entity[currentColField];
									console.log("Changed Value",$scope.changedValue);
									//alert("Value should be shown in popInfo");
								} else {
									$scope.visibleInfoTable = false;
								}
							}
						}
					}
				}
				setPosition(data.event);    				
			}
			
			function setPosition(event){
				//console.log("setPosition : data",$scope);
				$scope.InfoLeft = Number(event.pageX) - 5;
                //console.log("tipLeft",$scope.InfoLeft);
				$scope.InfoTop = Number(event.pageY) + 20;
                //console.log("tipTop",$scope.InfoTop);
			}

        });
})();