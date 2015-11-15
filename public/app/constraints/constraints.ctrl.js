(function () {
    angular.module("app.constraints")
        .controller("ConstraintsController", function ($scope, $routeParams) {
			
			$scope.constraintsList  = $scope.objCurrentWS.additional_constraints;

			// Listener
			$scope.$on("showAddConstraints", showAddConstraintsView);
			// bradcast main
			
			$scope.$on("startUpdateView", startConstraintsUpdateView);
			
            function showAddConstraintsView(evt,data) {
				if($scope.objCurrentWS != undefined)
					$scope.constraintsList = $scope.objCurrentWS.additional_constraints;
            }

				
            $scope.closeConstraintsView = function(){
				//console.log("Close");
				$scope.boolConstraintsView = false;
				$scope.$broadcast('closeActiveConstraintsView', null);
			}
			
			$scope.deleteConstraints = function(key){
				//console.log("deleteConstraints" + key);
				$scope.constraintsList.splice(key,1);
			};
            $scope.showConstraintBox = function(value){
                $scope.IsVisible = value;
                $scope.constraint_string ="";
            }
			
			
			$scope.addConstraints = function(constraint){
                if(constraint)
                {
				var len = $scope.constraintsList.length;
				//console.log("Length" + len);
				$scope.constraintsList.push(constraint);
                }
			};
			
			
			function startConstraintsUpdateView(){
				//if( $scope.objCurrentWS.additional_constraints!=undefined)
					//console.log("startConstraintsUpdateView :",$scope.objCurrentWS);
					if($scope.objCurrentWS != undefined)
						$scope.constraintsList = $scope.objCurrentWS.additional_constraints;
			}
			
			
        });
})();