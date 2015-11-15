(function () {
    angular.module("app.data")
        .factory("wmcJsonSvc", function ($http, $q, workspaceUrl,workspaceDataUrl,benchmarksUrl,optimizerUrl,indicesUrl,indicesDataUrl) {
            return {
                getSaveReqJson: getSaveReqJson,
				getOptimizerReqJson : getOptimizerReqJson
            }
			
			function getSaveReqJson(wsObj){
				var ws = angular.copy(wsObj);
				var newWs = {};
				newWs["workspaceid"] = ws["workspaceid"];
				newWs["workspacedesc"] = ws["workspacedesc"];
				newWs["overridematrix"] = ws["overridematrix"];
				newWs["positions"] = removeKeyAddedForRef(ws["positions"]);
				newWs["overrides"] = ws["overrides"];
				newWs["position_constraints"] = ws["position_constraints"];
				newWs["group_constraints"] = ws["group_constraints"];
				newWs["additional_constraints"] = ws["additional_constraints"];
				
				console.log("getSaveReqJson --->",newWs);
				return newWs;
			}
			
			function getOptimizerReqJson(wsObj){
				var ws = angular.copy(wsObj);
				
				/*navObj = {
                    "series":false,
                    "riskAversionCoeff": 0.001,
                    "benchmark" : "ACG",
                    "chart" : "None",
                    "summaryView" : false,
                    "constraints" : false,
                    "matrix" : false,
                    "table" : true

                }*/
				
				var newWs = {};
				
				var optimizer = {
					"optimize": true,
					"riskadversecoef": ws.navObj.riskAversionCoeff
				};
				
				newWs["optimizer"] = optimizer;
				newWs["matrix"] = ws["overridematrix"]; 
				newWs["positions"] = removeKeyAddedForRef(ws["positions"]);
				newWs["overrides"] = ws["overrides"];
				newWs["group_constraints"] = ws["group_constraints"];
				newWs["additional_constraints"] = ws["additional_constraints"];
				console.log("getOptimizerReqJson --->",newWs);
				return newWs;
			}
			
			
			function removeKeyAddedForRef(positions){
				// created for development.
				var newPositions = positions;
				var ar = ['indexLevel']
				var arLen = ar.length;
				if(positions!=undefined && positions!=null){
					var len = positions.lenght;
					for(var i= 0;i<len;i++){
						var pos = positions[i];
						for(var k=0;k<arLen;k++){
							delete pos[ar[k]];
						}
					}
				}
				console.log(">>>>>>>>"+newPositions);
				return newPositions;
			
			}

			

        
			
			
           
        });
}());