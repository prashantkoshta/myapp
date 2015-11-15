(function () {
    angular.module("app.components")
        .controller("WmcTooltipController", function ($scope,$rootScope) {
			console.log("WmcTooltipController");
			
			$rootScope.$on("openToolTip",showToolTip);
			$scope.tipTop = 10;
			$scope.tipLeft = 50;
			$scope.visibleTipMatrix = false;
			
			$scope.passObject = {};
            $scope.passEvent = {};
			$scope.type = "";
            $scope.newCellValue = "";
			
			$scope.onToolTipCancel = function()  {
				console.log("onToolTipCancel");
				closeTootip();
				//$scope.$emit("clickOnNew");
			};
			 
			$scope.onToolTipOk = function()  {
				console.log("onToolTipOk");
				closeTootip();
				$rootScope.$broadcast("onClickOkAtTooltip",{'type':$scope.type,'data':$scope.passObject,'value':$scope.newCellValue,'event':$scope.passEvent});
			};
			
			function showToolTip(evt,data) {
                $scope.newCellValue="";
				console.log("showToolTip : data",data);
                console.log("TooltipEvent",evt);
				$scope.type = data.data.type;
				if($scope.type == 'matrix_edit_popop'){
					forMatrixEditPopup(data.data,data.event);
				}else if($scope.type == 'table_edit_popop'){
					forTableEditPopup(data.data.item);
				}
				//matrix_edit_popop
				setPosition(data.event);
				$scope.visibleTipMatrix = true;
                
			}
			
			
			function closeTootip(){
				$scope.visibleTipMatrix = false;
			}
			
			function setPosition(event){
				//console.log("setPosition : data",$scope);
				$scope.tipLeft = Number(event.pageX) - 170;
                //console.log("tipLeft",$scope.tipLeft);
				$scope.tipTop = Number(event.pageY);
                //console.log("tipTop",$scope.tipTop);
			}
			
			
			function forMatrixEditPopup(data,event){
				$scope.passObject = data;
				$scope.passEvent = event;
			}
			
			function forTableEditPopup(data){
				$scope.passObject = data;
			}
			
			

        });
})();