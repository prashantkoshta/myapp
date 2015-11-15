(function () {
    angular.module("app.components")
        .controller("wmcTooltipGroupController", function ($scope,$rootScope) {
			console.log("wmcTooltipGroupController");
			
			$rootScope.$on("openToolTipGroup",showToolTipGroup);
			$scope.tipTop = 10;
			$scope.tipLeft = 50;
			$scope.visibleTipGroup = false;
			
			$scope.passObject = {};
            $scope.passEvent = {};
			$scope.type = "";
            $scope.newCellValue = "";
			
			$scope.onToolTipGroupCancel = function()  {
				console.log("onToolTipTableCancel");
				closeTooltip();
				//$scope.$emit("clickOnNew");
			};
			 
			$scope.onToolTipGroupOk = function()  {
				console.log("onToolTipOk");
				closeTooltip();
				$rootScope.$broadcast("onClickOkAtTooltip",{'type':$scope.type,'data':$scope.passObject,'value':$scope.newCellValue,'event':$scope.passEvent});
			};
			
			$scope.getGroupRow = function(selectedRow)  {
				console.log("getGroupRow");
				closeTooltip();
				$rootScope.$broadcast("onClickGroupSelect",{'type':$scope.type,'data':$scope.passObject,'value':$scope.newCellValue,'event':$scope.passEvent, 'selectedRow':selectedRow});
			};
			
			function showToolTipGroup(evt,data) {
                $scope.visibleTipGroup = true;
				
				$scope.type = data.data.type;
				if($scope.type == 'table_edit_popop'){
					forTableEditPopup(data.data.item);
				}
				//matrix_edit_popop
				setPosition(data.event);
			}
			
			
			function closeTooltip(){
				$scope.visibleTipGroup = false;
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