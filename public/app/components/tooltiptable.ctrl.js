(function () {
    angular.module("app.components")
        .controller("WmcTooltipTableController", function ($scope,$rootScope) {
			console.log("WmcTooltipTableController");
			
			$rootScope.$on("openToolTipTable",showToolTipTable);
			$scope.tipTop = 10;
			$scope.tipLeft = 50;
			$scope.visibleTipTable = false;
			
			$scope.passObject = {};
            $scope.passEvent = {};
			$scope.type = "";
            $scope.newCellValue = "";
			
			$scope.onToolTipTableCancel = function()  {
				console.log("onToolTipTableCancel");
				closeTooltip();
				//$scope.$emit("clickOnNew");
			};
			 
			$scope.onToolTipTableOk = function()  {
				console.log("onToolTipOk");
				closeTooltip();
				$rootScope.$broadcast("onClickOkAtTooltip",{'type':$scope.type,'data':$scope.passObject,'value':$scope.newCellValue,'event':$scope.passEvent});
			};
			
			function showToolTipTable(evt,data) {
                $scope.newCellValue="";
				$scope.type = data.data.type;
				if($scope.type == 'table_edit_popop'){
					forTableEditPopup(data.data.item);
				}
				//matrix_edit_popop
				setPosition(data.event);
				$scope.visibleTipTable = true;
                
			}
			
			
			function closeTooltip(){
				$scope.visibleTipTable = false;
			}
			
			function setPosition(event){
				//console.log("setPosition : data",$scope);
				$scope.tipLeft = Number(event.pageX) - 170;
                //console.log("tipLeft",$scope.tipLeft);
				$scope.tipTop = Number(event.pageY);
                //console.log("tipTop",$scope.tipTop);
			}
			
			function forTableEditPopup(data){
				$scope.passObject = data;
			}
			
			

        });
})();