(function () {
    angular.module("app.components")
        .controller("WmcMouseoverController", function ($scope,$rootScope) {
			console.log("WmcMouseoverController");
			
			$rootScope.$on("hoverToolTip",showMouseOver1);
			$scope.InfoTop = 10;
			$scope.InfoLeft = 50;
			$scope.visibleInfoMatrix = false;
			$scope.type = "";
            $scope.changedValue="";
			
         
			function showMouseOver1(evt,data) {
				console.log("showInfolTip : data",data,data.data.refMatrix);
                console.log("InfotipEvent",evt);
				$scope.type = data.data.type;
				if($scope.type == 'matrix_info_popop'){
					var hasClassUpdated = data.event.currentTarget.parentElement.className;
                    var checkForClass = hasClassUpdated.search("updated_cell");
					$scope.changedValue = data.data.refMatrix;
					$scope.visibleInfoMatrix = true;
                    if(checkForClass>0){
                        // $scope.matrixOriginal[currentCellRow][currentCell];
                        console.log("Reference Value",$scope.changedValue);
                    }
                    else
                    {
                        $scope.visibleInfoMatrix = false;
                    }
				}
				//matrix_info_popop
				
				//table_info_popop
				if($scope.type == 'table_info_popop'){
					
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
									$scope.visibleInfoMatrix = true;
									$scope.changedValue = data.data.item.row.entity[currentColField];
									console.log("Changed Value",$scope.changedValue);
									//alert("Value should be shown in popInfo");
								} else {
									$scope.visibleInfoMatrix = false;
								}
							}
						}
					}
				}
				setPosition(data.event);    				
			}
			
			function setPosition(event){
				//console.log("setPosition : data",$scope);
				$scope.InfoLeft = Number(event.currentTarget.offsetLeft);
                //console.log("tipLeft",$scope.InfoLeft);
				$scope.InfoTop = Number(event.currentTarget.offsetTop) + 37;
                //console.log("tipTop",$scope.InfoTop);
			}

        });
})();