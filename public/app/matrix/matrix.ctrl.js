(function () {
    angular.module("app.matrix")
        .controller("MatrixController", function ($scope, $rootScope, $routeParams) {
			
			
			$scope.matrixList = $scope.objCurrentWS.overridematrix;
            $scope.refMatrix =$scope.objCurrentWS.referencematrix;
            //$scope.defaultMatrix = $scope.objCurrentWS.referencematrix;
            $scope.indices = $scope.objCurrentWS.positions;
           	$scope.slider = 1;
			
            
			//$scope.$on("showMatrix", showMatrixView);
            
            $scope.$on("startUpdateView", startMatrixUpdateView);
			
			// dispatch from tooltip
			$rootScope.$on("onClickOkAtTooltip",onEditTooltipDone);
			//{'type':$scope.type,'data':$scope.passObject}
        
            $scope.arNewColorMatrix = null;
            $scope.contentWidth = "";
          
			function onEditTooltipDone(evt,data){
				if(data.type == "matrix_edit_popop"){
                    
                    var currentCellValue = data.data.cell;
                    var currentCellID = data.event.currentTarget.id;
                    var currentCellPos = currentCellID.slice(6);
                    
                    if(currentCellPos.length == 2)
                    {
                        var splitPos= currentCellPos.split("");
                        console.log(splitPos);
                        var currentCellRow=Number(splitPos[0]);
                        var currentCell=Number(splitPos[1]);
                        if(data.value <= 1 && data.value>= -1)
                        {
                            $scope.matrixList[currentCellRow][currentCell] = (Number(data.value)).toFixed(2);
                            $scope.matrixList[currentCell][currentCellRow] = (Number(data.value)).toFixed(2);
                            $scope.arNewColorMatrix[currentCell][currentCellRow] = 1;
                            $scope.arNewColorMatrix[currentCellRow][currentCell] = 1;
							$scope.objCurrentWS.overridematrix = $scope.matrixList;
							setWSColorMatrix();
                           
                        }
                    }
                    else if(currentCellPos.length == 3 || currentCellPos.length ==4)
                    {
                        var splitPoses = currentCellPos.match(/.{1,2}/g)
                        var currentCellRow=Number(splitPoses[0]);
                        var currentCell=Number(splitPoses[1]);
                        if(data.value <= 1 && data.value>= -1)
                        {
                            $scope.matrixList[currentCellRow][currentCell] = (Number(data.value)).toFixed(2);
                            $scope.matrixList[currentCell][currentCellRow] = (Number(data.value)).toFixed(2);
                            $scope.arNewColorMatrix[currentCell][currentCellRow] = 1;
                            $scope.arNewColorMatrix[currentCellRow][currentCell] = 1;
							$scope.objCurrentWS.overridematrix = $scope.matrixList;
							setWSColorMatrix();
                           
                        }
                        
                    }
					
					
				}
			}
			
		
            
            
		$scope.changeValue = function(valPresent) {          
		   $scope.arNewColorMatrix = resetColorMatrix( $scope.arNewColorMatrix);
		   setWSColorMatrix();
		   valPresent = $scope.slider;
		   $scope.matrixList = scaleMatrixValue(valPresent);
		   $scope.objCurrentWS.scaleValue = Number(valPresent);
		   $scope.objCurrentWS.overridematrix = $scope.matrixList;
		};
        
		function scaleMatrixValue(valPresent){
		   var ar = angular.copy($scope.refMatrix);
		   var len =ar.length;
		   for(i=0;i<len;i++){
				var inLen = ar[i].length;
				for(j=0;j<inLen;j++){
					if($scope.arNewColorMatrix[i][j] != 1){
						var val = (i==j) ? Number(ar[i][j]): Number(ar[i][j]) * Number(valPresent);
						if(val < -1){
							ar[i][j] = -1.00;
						}else if(val > 1){
							ar[i][j] = 1.00;
						}else{
							ar[i][j] = val.toFixed(2);
						}
						
						
						
					}					
				}
			}
			return ar;
		}
		
        function resetColorMatrix(matrix){
             for(i in matrix){
				i = Number(i);
                var colAr = matrix[i];
                for (j in colAr){
					j = Number(j);
                    if(colAr[j] == -1){
                         colAr[j]  = -1;
                    }else{
                        colAr[j]  = 0;
                    }
                }
             }
            return matrix;
        }
        
        
        function createClorMatrix(refMatrix, overMatrix){
                var arColorMatrix = [];
                for(i in refMatrix){
					i = Number(i);
					arColorMatrix[i] = [];
                    var colAr = refMatrix[i];
                    for (j in colAr){
						j = Number(j);
                        var val = 0; // for white -1 for gray 1 for oranage
                        if(i == j){
                             arColorMatrix[i][j] = -1;    
                        }else{
                            if(colAr[j] != overMatrix[i][j]){
                                 arColorMatrix[i][j] = 1;    
                            }else{
                                arColorMatrix[i][j] = 0;    
                            }
                           
                        }
                          
                    }
                }
            return arColorMatrix;
        }
        
        $scope.setCellColor = function(cellIndex,rowIndex){
			   //console.log("Hi setCellColor",rowIndex,cellIndex,$scope.arNewColorMatrix);
			    
			   if($scope.arNewColorMatrix == null)	return {"default_cell":"default_cell"};  
			   
			   var colorType = $scope.arNewColorMatrix[rowIndex][cellIndex];
			   if(colorType == -1){
					 return {"diagonal_cell":"diagonal_cell"};
				}else if(colorType == 0){
					return {"default_cell":"default_cell"};
				}else{
					return {"updated_cell":"updated_cell"};  
				}

        }
            
            
          
        
        function startMatrixUpdateView(){
					console.log("startMatrixUpdateView :",$scope.objCurrentWS);
					/*if($scope.objCurrentWS != undefined && $scope.objCurrentWS.referencematrix != undefined){
                        if($scope.objCurrentWS.arNewColorMatrix == undefined)    {
                            $scope.matrixList = $scope.objCurrentWS.overridematrix;
                            $scope.refMatrix = $scope.objCurrentWS.referencematrix;
                            $scope.indices = $scope.objCurrentWS.positions;
                            console.log("Indices",$scope.indices.length);
                            var numberOfIndices = $scope.indices.length;
                            if(numberOfIndices > 9){
                                var newWidth = (numberOfIndices + 1) * 100+"px";
                                $scope.contentWidth = newWidth;
                                $scope.objCurrentWs.contentWidth = $scope.contentWidth;
                            }
                            else{
                                $scope.contentWidth='950px';
                                $scope.objCurrentWs.contentWidth = $scope.contentWidth;
                            }
                            // $rootScope.$broadcast("onMouseover",{'data':$scope.refMatrix});
                            //$scope.slider = 1;
							$scope.slider = 1;
							$scope.arNewColorMatrix = createClorMatrix( $scope.refMatrix,$scope.matrixList);
							setWSColorMatrix();
                        }else{
                            $scope.matrixList = $scope.objCurrentWS.overridematrix;
                            $scope.refMatrix =$scope.objCurrentWS.referencematrix;
                            $scope.indices = $scope.objCurrentWS.positions;
                            // $rootScope.$broadcast("onMouseover",{'data':$scope.refMatrix});
                            if($scope.objCurrentWS.scaleValue == undefined){
								$scope.slider=1;
							}else{
								$scope.slider=$scope.objCurrentWS.scaleValue;
							}
							$scope.arNewColorMatrix = $scope.objCurrentWS.arNewColorMatrix;
                            $scope.contentWidth = $scope.objCurrentWS.contentWidth;
							setWSColorMatrix();
                        }
					}*/
            
        }
		
		function setWSColorMatrix(){
			if($scope.arNewColorMatrix!=undefined && $scope.arNewColorMatrix !=null){
				$scope.objCurrentWS.arNewColorMatrix = $scope.arNewColorMatrix;
			}
		}
		
		
		$scope.isDigonal = function (cell,row){
				var bool = (row == cell) ? true : false;				
				return bool;
		};
		
	 });	

     
})();