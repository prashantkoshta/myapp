(function () {
    angular.module("app.components")
        .controller("WmcTooltipRatingController", function ($scope,$rootScope) {
			console.log("WmcTooltipRatingController");
			
			$rootScope.$on("openToolTipRating",showToolTipRating);
			$scope.tipTop = 10;
			$scope.tipLeft = 50;
			$scope.visibleTipRating = false;
			
			$scope.passObject = {};
            $scope.passEvent = {};
			$scope.type = "";
            $scope.newCellValue = "";
			
			$scope.onToolTipRatingCancel = function()  {
				console.log("onToolTipRatingCancel");
				closeTooltip();
				//$scope.$emit("clickOnNew");
			};
			 
			$scope.onToolTipRatingOk = function()  {
				console.log("onToolTipRatingOk");
				closeTooltip();
				$rootScope.$broadcast("onClickOkAtTooltip",{'type':$scope.type,'data':$scope.passObject,'value':$scope.newCellValue,'event':$scope.passEvent});
			};
			
			function showToolTipRating(evt,data) {
                $scope.newCellValue="";
				//{"event":evt,"data":data}
				console.log("showToolTipRating : data",data);
                console.log("TooltipEventRating",evt);
				$scope.type = data.data.type;
				if($scope.type == 'table_edit_popop'){
					forTableEditPopup(data.data.item);
				}
				//rating_edit_popup
				setPosition(data.event);
				$scope.visibleTipRating = true;
                
			}
			
			
			function closeTooltip(){
				$scope.visibleTipRating = false;
			}
			
			function setPosition(event){
				//console.log("setPosition : data",$scope);
				$scope.tipLeft = Number(event.pageX) - 170;
                //console.log("tipLeft",$scope.tipLeft);
				$scope.tipTop = Number(event.pageY);
                //console.log("tipTop",$scope.tipTop);
			}
			
			function forTableEditPopup(data){
				// 
				
				$scope.passObject = data;
			}
			
			

        });
})();