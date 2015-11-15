(function () {
    angular.module("app.components")
        .controller("WmcTooltipTableGroupEditController", function ($scope,$rootScope) {
			console.log("WmcTooltipTableGroupEditController");
			
			$rootScope.$on("openTooltipTableGroupEdit",showTooltipTableGroupEdit);
			$scope.tipTop = 10;
			$scope.tipLeft = 50;
			$scope.visibleTipTableGroupEdit = false;
			
			$scope.passObject = {};
            $scope.passEvent = {};
			$scope.type = "";
            $scope.newCellValue = "";
			
			$scope.onWmcTooltipTableGroupEditCancel = function()  {
				console.log("onToolTipTableCancel");
				closeTooltip();
				//$scope.$emit("clickOnNew");
			};
			 
			$scope.onWmcTooltipTableGroupEditOk = function()  {
				console.log("onToolTipOk");
				closeTooltip();
				$rootScope.$broadcast("onClickOkAtTooltip",{'type':$scope.type,'data':$scope.passObject,'value':$scope.newCellValue,'event':$scope.passEvent});
			};
			
			function showTooltipTableGroupEdit(evt,data) {
                $scope.newCellValue="";
				$scope.type = data.data.type;
				if($scope.type == 'table_edit_popop'){
					forTableEditPopup(data.data.item);
				}
				//matrix_edit_popop
				setPosition(data.event);
				$scope.visibleTipTableGroupEdit = true;
                
			}
			
			
			function closeTooltip(){
				$scope.visibleTipTableGroupEdit = false;
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