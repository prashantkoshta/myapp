(function () {
    angular.module("app.components")
	
        .controller("WSPopupController", function ($scope, $modal, $log) {
			  console.log("WSPopupController");
			  $scope.animationsEnabled = true;
			  
			  $scope.$on("toggleWSPopup",toggleModal);
			  $scope.$on("toggleDelWSPopup",toggleDelModal);
			  $scope.$on("toggleDelRowPopup",toggleDelRow);
			  $scope.$on("toggleMaxTabPopup",toggleMaxTabModal);
			  
			  $scope.$on("toggleWarningChartPopup",toggleWarningChartModal);
			  
			  function toggleWarningChartModal(size,msg){
				 console.log("toggleWarningChartModal");
				 var modalInstance = $modal.open({
				  animation: $scope.animationsEnabled,
				  templateUrl: 'app/components/warningwspopup.html',
				  controller: 'WarningChartModalInstanceCtrl',
				  resolve: {
					items: function () {
					  return msg;
					}
				  }
				});
			  }
			  
			  function toggleModal(size){
					  console.log("open");
					  var modalInstance = $modal.open({
					  animation: $scope.animationsEnabled,
					  templateUrl: 'app/components/wspopup.html',
					  controller: 'ModalInstanceCtrl',
					  size: size,
					  resolve: {
						items: function () {
						  return $scope.wdData;
						}
					  }
					});
			  } 
			  
			  function toggleDelModal(size,ws_id){
					  console.log("DelModalInstanceCtrl open");
					  var modalInstance = $modal.open({
					  animation: $scope.animationsEnabled,
					  templateUrl: 'app/components/delwspopup.html',
					  controller: 'DelModalInstanceCtrl',
					  size: size,
					  resolve: {
						items: function () {
						  return ws_id;
						}
					  }
					});
			  }
			  
			    function toggleDelRow(evt,row){
					console.log("toggleDelRow",row);
					var modalInstance = $modal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'app/components/delwspopup.html',
					controller: 'DelRowModalInstanceCtrl',
					resolve: {
						items: function () {
						  return row;
						}
					  }
					});
				}

			function toggleMaxTabModal(size){
					  console.log("DelModalInstanceCtrl open");
					  var modalInstance = $modal.open({
					  animation: $scope.animationsEnabled,
					  templateUrl: 'app/components/maxtabpopup.html',
					  controller: 'MaxTabModalInstanceCtrl',
					  size: size,
					  resolve: {
						items: function () {
						  return $scope.maxTabCount;
						}
					  }
					});
			  } 
			  
        })
		
		.controller('ModalInstanceCtrl', function ($rootScope,$scope, $modalInstance, items) {
			  console.log("ModalInstanceCtrl items:",items);
			  $scope.wsData = items;
			  $rootScope.$on("gotWSList",function(data){
				   console.log("gotWSList",data);
				   $scope.wsData = data;
			  });
			  $scope.ok = function () {
				$modalInstance.close();
			  };

			  $scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			  };
			  
			  $scope.selectWSItem = function(ws){
				console.log("selectWSItem", ws);
				$scope.popupSelectedWS = ws;
			  }
				
			$scope.openWorkSpace = function(item){
				console.log("openWorkSpace:", item);
				$rootScope.$emit("clickOnWSOpen",item);
			}
				
			  
		})
		
		.controller('DelRowModalInstanceCtrl', function ($rootScope, $scope, $modalInstance, items) {
			  console.log("DelRowModalInstanceCtrl items:",items);
			  $scope.delConfirm = function (isConfirm) {
				console.log("delConfirm:",isConfirm);
				$modalInstance.close();
				if(isConfirm){
					$rootScope.$emit("deleteConfirmRowAction",items);
				}
			  };
 
		})
		.controller('DelModalInstanceCtrl', function ($rootScope, $scope, $modalInstance, items) {
			  console.log("DelModalInstanceCtrl items:",items);
			  $scope.delConfirm = function (isConfirm) {
				console.log("delConfirm:",isConfirm);
				$modalInstance.close();
				if(isConfirm){
					$rootScope.$emit("deleteConfirmAction",items);
				}
			  };
 
		})
		.controller('MaxTabModalInstanceCtrl', function ($rootScope, $scope, $modalInstance, items) {
			  console.log("MaxTabModalInstanceCtrl items:",items);
			  $scope.mxTabCnt = items;
			  $scope.onClose = function (isConfirm) {
				$modalInstance.close();
			  };
 
		})
		.controller('WarningChartModalInstanceCtrl', function ($rootScope, $scope, $modalInstance, items) {
			  console.log("WarningChartModalInstanceCtrl items:",items);
			  $scope.message = items;
			  $scope.onClose = function (isConfirm) {
				$modalInstance.close();
			  };
 
		});
})();