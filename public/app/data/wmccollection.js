(function () {
    angular.module("app.data")
        .factory("wmccollectionSvc", function () {
			
			var indexKeyCount = 0;
			var cloneIndexCount = 0;
			
            return {
                getWorkSpaceDataById: getWorkSpaceDataById,
				addWSTabData : addWSTabData,
				getNewWorkSpaceData: getNewWorkSpaceData,
				isUserCreatedWS : isUserCreatedWS,
				isWorkSpaceAlreadyOpen : isWorkSpaceAlreadyOpen,
				removeWSList :removeWSList,
				getWorkSpaceIndex : getWorkSpaceIndex,
				boolAddNewWSAvail : boolAddNewWSAvail,
				getCloneWSObjects : getCloneWSObjects,
				getOptimizerReqObject : getOptimizerReqObject,
				isWSIDPresent : isWSIDPresent
				
            }
			
			function addWSTabData(resObj,wsid,gWSObj){
				var o = gWSObj[wsid];
				//if(o == null || o == undfined){
					gWSObj[wsid] = resObj;
				//}else{
					//gWSObj[wsid] = resObj;
				//}
				return {"global":gWSObj,"objCurrentWS":gWSObj[wsid],"currentWSID":wsid};
			}

            function getWorkSpaceDataById(obj,id){
			   console.log("##############"+id);
			   console.log(obj);
			   return obj[id];
            }
			
			function getNewWorkSpaceData() {
				var count = getNewTabIndexKey();
				var ws = new Object({"id":"$$$$$_new_workspace_"+count,"desc":"New WS "+count});;
				var ws_data =  new Object({
					  "workspaceid": "$$$$$_new_workspace_"+count,
					  "workspacedesc" : "New WS "+count,
					  "referencematrix":[],
					  "positions":  [],
					  "additional_constraints"	: []
					});
				return 	{"ws":ws,"ws_data":ws_data};
			}
			
			
			
			function getNewTabIndexKey(){
				console.log("indexKeyCount : ",indexKeyCount);
				return indexKeyCount++;
			}
			
			function isUserCreatedWS(ws_id){
				var b = false;
				if(ws_id.indexOf("$$$$$_new_")>-1){
					b = true;
				}
				return b;
			}
			
			function isWSIDPresent(ws_id,wslist){
				for(i in wslist){
					if(wslist[i].id== ws_id) return true;
				}
				return false;
			}
			
			function isWorkSpaceAlreadyOpen(wslist, ws_id){
				console.log("isWorkSpaceAlreadyOpen#############",wslist,ws_id);
				for( key in wslist ) {
					if(wslist[key].id == ws_id) return true;
				}
				
				return false;
			}
			
			function removeWSList(listWS,key){
				console.log("closeWorkSpace", key, listWS);
				var old_wsid = listWS[key].id;
				listWS.splice(key,1);
				var new_wsid = (listWS.length>0)? listWS[listWS.length-1].id : null;
				console.log({"wsList":listWS,"new_wsid":new_wsid,"old_wsid":old_wsid});
				return {"wsList":listWS,"new_wsid":new_wsid,"old_wsid":old_wsid};
			}
			
			function getWorkSpaceIndex(listWS,ws_id){
				var key = -1;
				for(item in listWS){
					key++;
					if(item.id == ws_id) return key;
				}
				return key;
			}
			
			function boolAddNewWSAvail(wslist,cnt){
				console.log("boolAddNewWSAvail:",wslist.length,wslist);
				var maxCountWS = cnt;
				if(wslist.length < maxCountWS){
					return true;
				}else{
					return false;
				}
				
				
			}
			
			function getCloneWSObjects(ws_id, wsList,wsData){
				console.log("getCloneWSObjects:");
				var key = getWorkSpaceIndex(wsList,ws_id);
				var cnt = getCloneCountIndex();
				
				var wsObj = wsList[key];
				var cloneWSId = wsObj.id+"_clone"+cnt;
				var newWsObj = angular.copy(wsObj)		
				newWsObj.id = cloneWSId;
				newWsObj.desc =  "clone_"+wsObj.desc;
				wsList.push(newWsObj);
				//
				
				var wsOldObj = wsData[ws_id];
				var wsDataObj = angular.copy(wsOldObj);
				wsDataObj.workspaceid = cloneWSId;				
				wsDataObj.workspacedesc = newWsObj.desc;	
				wsData[cloneWSId] = wsDataObj;
				
				console.log("wsList:",wsList,"wsData:",wsData,"new_wsid:",cloneWSId,"old_wsid:",ws_id);
				return {"wsList":wsList,"wsData":wsData,"new_wsid":cloneWSId,"old_wsid":ws_id}
			}
			
			
			
			
			function getCloneCountIndex(){
				console.log("getCloneCountIndex : ",cloneIndexCount);
				return cloneIndexCount++;
			}
			
			function getOptimizerReqObject(){
			   /* var optmized_req = {
					"optimizer":    
					{
						"optimize": optimize,
						"riskadversecoef": riskadversecoef
					}
				}*/
				
				return {
				  "optimizer":    {
						"optimize": false,
						"riskadversecoef": 0.001
				  },
				  "overridematrix":
					[[1,0.12,0.25,0.31,0.40,-0.60,-0.20],
					[0.12,1,-0.81,0.22,-0.51,-0.32,0.11],          
					[0.25,-0.81,1,0.25,0.9,0.72,-0.02],
					[0.31,0.22,0.25,1,-0.66,0.17,0.08],
					[0.40,-0.51,0.9,-0.66,1,-0.81,0.44],          
					[-0.60,-0.32,0.72,0.17,-0.81,1,0.33],          
					[-0.20,0.11,-0.02,0.08,0.44,0.33,1]],     
				   "positions":    [
							{
						 "id": "Index1",  
						 "mv": 0.6610 
					  },
							{
						 "id": "Index2",
						 "mv": 0.1495
					  },
							{
						 "id": "Index3",
						 "mv": 0.0000
					  },
							{
						 "id": "Index4",
						 "mv": 0.1895
					  }
				   ],
					"overrides":  [
					{
						"id": "Index1",
						"oas" : 0.5,
						"volatility" : 0.6
					},
					{
						"id": "Index3",
						"rating": 0.1,
						"duration": 0.7
					}],
					"constraints":	[
						"constraint1",
						"constraint2",
						"constraint3",
						"constraint4"
				  ]	  
				};
			}
		

           
        });
}());