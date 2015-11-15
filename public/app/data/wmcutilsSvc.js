(function () {
    angular.module("app.data")
        .factory("wmcutilsSvc", function ($filter) {
		
			var arEditableCell = {
				"mv": "mv",
				"haircut": "haircut",
				"rating": "rating",
				"duration": "duration",
				"spreaddur" : "spreaddur",
				"ytw": "ytw",
				"oas" : "oas",
				"volatility" : "volatility"
			};
			
			var arEditableConstraint = {
				"mv_max" :"mv_max",
				"mv_min" :"mv_min",
				"ctd_max" :"ctd_max",
				"ctd_min" :"ctd_min"
			}
			
			var arNonEditableCell = {
				"description":"description",
				"ctd" :"ctd",
				"cdst" : "cdst",
				"expreturn" : "expreturn",
				"skew" : "skew",
				"sharpe" : "sharpe",
				"taggroup" : "taggroup"
			};
			
			
			
			var arGrpEditableCell = {
				"mv": "mv",
				"ctd" :"ctd",
				"expreturn" : "expreturn",
				"rating": "rating",
				"duration": "duration",
				"spreaddur" : "spreaddur",
				"ytw": "ytw",
				"oas" : "oas",
				"volatility" : "volatility",
				"sharpe" : "sharpe"
			}
			
			var arGrpNonEditableCell = {
				"taggroup" : "taggroup",
				"description":"description",
				"cdst" : "cdst",
				"haircut": "haircut",
				"skew" : "skew",
				"mv_max" :"mv_max",
				"mv_min" :"mv_min",
				"ctd_max" :"ctd_max",
				"ctd_min" :"ctd_min"
			};
			
			var arTotalGrpNonEditableCell = {
				"taggroup" : "taggroup",
				"description":"description",
				"mv" : "mv",
				"ctd" :"ctd",
				"cdst" : "cdst",
				"haircut": "haircut",
				"skew" : "skew",
				"mv_max" :"mv_max",
				"mv_min" :"mv_min",
				"ctd_max" :"ctd_max",
				"ctd_min" :"ctd_min"
			};
			
			var arTotalEditableCell = {
				"expreturn" : "expreturn",
				"rating" : "rating",
				"duration": "duration",
				"spreaddur" : "spreaddur",
				"ytw": "ytw",
				"oas" : "oas",
				"volatility" : "volatility",
				"sharpe" : "sharpe"
			
			};
			
			
			var stringColObject = {
				"id" :"id",
				"description" :"description",
				"taggroup" :"taggroup",
				"rating" :"rating"
			}
			
			var indexLevel = "indexLevel";
			var isGroupColumn = "isGroupColumn";
			var isGroupDelete = "isGroupDelete"
			
			
            return {
                getTagGroup: getTagGroup,
				setTagGroup : setTagGroup,
				filterByTagGroup : filterByTagGroup,
				getGrandTotalRow : getGrandTotalRow,
				getGrandTotalRowMin : getGrandTotalRowMin,
				getGrandTotalRowMax : getGrandTotalRowMax,
				getGrandTotalRowTarget : getGrandTotalRowTarget,
				removeGrouping : removeGrouping,
				doTagGrouping : doTagGrouping,
				getCellDropdownTemplate : getCellDropdownTemplate,
				getEditableCellTemplate :getEditableCellTemplate,
				getDescriptionTemplate : getDescriptionTemplate,
				getEditableCellConstraintsTemplate : getEditableCellConstraintsTemplate,
				getCellBackGroundColor : getCellBackGroundColor,
				addGroupConstraints : addGroupConstraints,
				addPositionsConstraints : addPositionsConstraints,
				getCellDisableProperty : getCellDisableProperty,
				getRatingToNum : getRatingToNum,
				actionOnGroupSelection : actionOnGroupSelection,
				removePosistionById : removePosistionById,
				getIndicesList : getIndicesList
				
            }
			
			function getGrpConstraingObjByGrpId(grpname,groupConstraintsList){
				for (var k in groupConstraintsList){
					if(groupConstraintsList[k].id == grpname){
						return groupConstraintsList[k];
					}
				}
				return null;
			}
			
			function getPrefixOfGrpConstaintsKey(key) {
				var suffix = key;
				if(suffix.indexOf("_max") > -1){
					suffix = suffix.substring(0,suffix.indexOf("_max"));
				}else if(suffix.indexOf("_min") > -1){
					suffix = suffix.substring(0,suffix.indexOf("_min"));
				}else if(suffix.indexOf("_target") > -1){
					suffix = suffix.substring(0,suffix.indexOf("_target"));
				}
				return suffix;
			}
			
					
			
			function addGroupConstraints(positionsObj,groupConstraintsObj,constraintsForMMXT){
				for (var k in groupConstraintsObj) {
					if(k!= "id"){
							var prop = ""
							if(constraintsForMMXT == "min" && k.indexOf("_min") > -1){
								prop = getPrefixOfGrpConstaintsKey(k)
							}else if(constraintsForMMXT == "max" && k.indexOf("_max") > -1){
								prop = getPrefixOfGrpConstaintsKey(k)
							}else if(constraintsForMMXT == "target" && k.indexOf("_target") > -1){
								prop = getPrefixOfGrpConstaintsKey(k)
							}
							if(prop!=""){
									positionsObj[prop] = groupConstraintsObj[k];	
							}
					}
				}
				//console.log("Added PositionsConstraints : ",positionsList)
				return positionsObj;
			}
			
			function addPositionsConstraints(positionsList,positionConstraintsList){
				////console.log("addPositionsConstraints :");
				for(var posIndex in positionConstraintsList){
					var positionsObj = getPositionsById(positionsList,positionConstraintsList[posIndex].id);
					if(positionsObj!=null){
						for (var k in positionConstraintsList[posIndex]) {
							positionsObj[k] = positionConstraintsList[posIndex][k];
						}
						//positionsList[index] = positionsObj;
					}
				}
				////console.log("Added PositionsConstraints : ",positionsList)
				return positionsList;
			}
			
			function getPositionsById(positionsList,id){
				////console.log("getPositionsById : id",id);
				for(var index in positionsList){
					if(positionsList[index].id == id){
						return positionsList[index];
					}
				}
				return null;
			}
			
			function getEditableCellTemplate(){
				var editCellTemplate = "<div ng-class='getCellStyle(row,col)'><span class='btn cellEdit tableBtn' ng-disabled=\"getCellDisable(row,col)\" ng-mouseover=\"showTableMouseOver($event,{'type':'table_info_popop','item':{'row':row,'col':col}})\"  ng-click=\"showTip($event,{'type':'table_edit_popop','item':{'row':row,'col':col}})\">{{row.getProperty(col.field)}}</span><div style='visibility:hidden'>.</div></div>"
				return editCellTemplate;
			}
			
			function getDescriptionTemplate(){
				var editCellTemplate = "<div ng-class='getCellStyle(row,col)'><span class='btn cellEdit tableBtn' ng-disabled=\"getCellDisable(row,col)\" ng-mouseover=\"showMouseover($event,{'type':'table_info_popop','item':{'row':row,'col':col}})\">{{row.getProperty(col.field)}}</span><span ng-show=\"!isShowDelete(row)\" ng-click=\"showTip($event,{'type':'table_edit_popop','item':{'row':row,'col':col}})\">+</span><div style='visibility:hidden'>.</div></div>"
				return editCellTemplate;
			}
			
			function getEditableCellConstraintsTemplate(){
				var editCellConstTemplate = "<div ng-class='getCellStyle(row,col)'><span class='btn cellEdit tableBtn' ng-disabled=\"getCellDisable(row,col)\" ng-click=\"showTip($event,{'type':'table_edit_popop','item':{'row':row,'col':col}})\">{{row.getProperty(col.field)}}</span><div style='visibility:hidden'>.</div></div>"
				return editCellConstTemplate;
			}
			
			/*function getEditableCellConstraintsTemplate(){
				var editCellConstTemplate = "<div ng-class='getCellStyle(row,col)'><span class='btn cellEdit tableBtn' ng-disabled=\"getCellDisable(row,col)\" ng-click=\"showTip($event,{'type':'table_edit_popop','item':{'row':row,'col':col}})\">{{row.getProperty(col.field)}}</span><div style='visibility:hidden'>.</div></div>"
				return editCellConstTemplate;
			}*/
		
			
			// To enable and disable the cell edit
			function getCellDisableProperty(row,col) {
				var colField = col.field;
				if(row.entity.isGroupColumn == true){
					if(row.entity.w_group_name == "group"){
						return true;
					}else if(row.entity.w_group_name == "max" || row.entity.w_group_name == "min" || row.entity.w_group_name == "target"){
						if(arGrpEditableCell.hasOwnProperty(colField)){
							return false;
						}else{
							return true;
						}	
					}else if(row.entity.w_group_name == "tgroup"){
						return true;
					}else if(row.entity.w_group_name == "tmax" || row.entity.w_group_name == "tmin" || row.entity.w_group_name == "ttarget"){
						if(arTotalEditableCell.hasOwnProperty(colField)){
							return false;
						}	
					}
				}else{
					if(arEditableConstraint.hasOwnProperty(colField) || arEditableCell.hasOwnProperty(colField)){
						return false;
					}else{
						return true;
					}
				}
				return true;
			}
			
		
			
			
			function getCellBackGroundColor(row,col){
				var colField = col.field;
				if(row.entity.isGroupColumn == true){
					if(row.entity.w_group_name == "group"){
						if(row.entity.groupClass == "groupEven"){
							return {"nonEditableCol-even":"nonEditableCol-even"};
						} else {
							return {"non-editableCol":"non-editableCol"};
						}
					}else if(row.entity.w_group_name == "max" || row.entity.w_group_name == "min" || row.entity.w_group_name == "target"){
						if(arGrpEditableCell.hasOwnProperty(colField)){
							return {"positionConst":"positionConst"};
						}else if(row.entity.groupClass == "groupEven"){
							return {"nonEditableCol-even":"nonEditableCol-even"};
						}else{
							return {"non-editableCol":"non-editableCol"};
						}
					}else if(row.entity.w_group_name == "tgroup"){
							return {"totalBackground":"totalBackground"};
					}else if(row.entity.w_group_name == "tmax" || row.entity.w_group_name == "tmin" || row.entity.w_group_name == "ttarget"){
							if(arTotalEditableCell.hasOwnProperty(colField)){
								return {"positionConst":"positionConst"};
							} else {
								return {"totalBackground":"totalBackground"};
							}
					}					
				}else{
					if(arEditableConstraint.hasOwnProperty(colField)){
						return {"positionConst":"positionConst"};
					}else if(arEditableCell.hasOwnProperty(colField)){
						return {"editableCol":"editableCol"};
					}else if(row.entity.groupClass == "groupEven"){
						return {"nonEditableCol-even":"nonEditableCol-even"};
					} else{
						return {"non-editableCol":"non-editableCol"};
					}
				}
				
				
				return {"non-editableCol":"non-editableCol"};
			}
			
			
			
			
			
			function getCellDropdownTemplate (){
				var cellSelectDropDownTemplate = '<div ng-class="getCellStyle(row,col)"><div ng-show="isShowDropDown(row)" class=" dd-column dd-column-tag currentRow{{tableList[row.rowIndex].id}} dropdown"> ' +
				'<button class="tagDropDowm dropdown-toggle" type="button" id="menu_{{tableList[row.rowIndex].id}}" data-toggle="dropdown">' +
				'<div class="grid_dropdown"><span>{{tableList[row.rowIndex].taggroup}}</span><span class="caretDropColor caret"></span></div></button>' +
				'<ul class="dropdown-menu tagLayout tag-dd" ng-click="$event.stopPropagation()">' +
				'<li ng-repeat="item in tagList"  ng-click="setAction($event, item, $index, row)"><span class="dditems">' +
				'{{item}}</span></li>' +
				'<form>' +
				'<div class="form-group formTagLayout">' +
				'<div class="col-md-6"><input type="text" ng-model="newTagName" class="form-control txtInput tagInput" id="inputTag" placeholder="Enter Tag"></div>' +
				'<div class="col-md-6 noPadding-l"><button class="btn btn-primary" ng-click="addTagInGridTbl(newTagName)">Add</button></div>' +
				'</div></form></ul></div></div>';
				return cellSelectDropDownTemplate;
			}
			
			function getGroupNameDesc(groupName,grpType){
				var lab = "";
				var gType = {
					"min": "Min",
					"max" : "Max",
					"target" : "Target",
					"total"   : "Total",
					"tmin"	: "Min",
					"tmax"	: "Max"
				};
				
				if(groupName == "ALL"){
					lab = (grpType == "total")? "Total" :"Total "+gType[grpType]+".";
				}else{
					lab =  "Group "+groupName+ " "+gType[grpType]+".";
				}
				return lab;
			}
			
			
			function addGroupsRows(colList,positionsList,groupName,grpConstraintsList,grpType){
				var ar =[];
				var checkDisplayRow = [];
				if(grpType == "total"){
					var gtotalColData =  getGrandTotalRow(colList,positionsList,groupName,"total",'group');
					gtotalColData["groupClass"] = positionsList[0].groupClass;
					ar.push(gtotalColData);
				}else if(grpType == "min"){
					var gtotalColDataMin =  getGrandTotalRowMin(colList,positionsList,groupName,'min',grpConstraintsList);
					gtotalColDataMin["id"] = groupName+'_min';
					gtotalColDataMin["groupClass"] = positionsList[0].groupClass;
					ar.push(gtotalColDataMin);
				}else if(grpType == "max"){
					var gtotalColDataMax =  getGrandTotalRowMax(colList,positionsList,groupName,'max',grpConstraintsList);
					gtotalColDataMax["id"] = groupName+'_max';
					gtotalColDataMax["groupClass"] = positionsList[0].groupClass;
					ar.push(gtotalColDataMax);
				}else if(grpType == "target"){
					var gtotalColDataTarget =  getGrandTotalRowTarget(colList,positionsList,groupName,'target',grpConstraintsList);
					gtotalColDataTarget["id"] = groupName+'_target';
					gtotalColDataTarget["groupClass"] = positionsList[0].groupClass;
					ar.push(gtotalColDataTarget);
				}
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				//console.log("addedGroupState", addedGroupState);
				/*angular.forEach(addedGroupState, function(addedRow, index) {
					if(addedRow.tagGroup === groupName) {
						if (addedRow.selectedRow === 'Min') {
							//console.log("addedRow.selectedRow", addedRow.selectedRow);
							
						} else if(addedRow.selectedRow === 'Max') {
							//console.log("addedRow.selectedRow", addedRow.selectedRow);
							
						} else if(addedRow.selectedRow === 'Target') {
							//console.log("addedRow.selectedRow", addedRow.selectedRow);
							
						}
					}
				});*/
				
				
				/*if(selectedRow === 'Min') {
					ar.push(gtotalColDataMin);
				} else if(selectedRow === 'Max') {
					ar.push(gtotalColDataMax);
				} else if(selectedRow === 'Target') {
					ar.push(gtotalColDataTarget);
				}*/
				return ar;
			}
			
			function doTagGrouping(colList,positionsList,grpConstraintsList,wsData){
				var groupPositions = removeGrouping (positionsList);
				
				var positions = [];
				var counterOddEven = 1;
				var temp = [];
				
				angular.forEach(groupPositions, function(data, index) {
					
					if(index == "undefined"){
						positions = positions.concat(data);
						identifyOddEvenGroup(data, counterOddEven);
					}else{
						positions = positions.concat(data);
						identifyOddEvenGroup(data, counterOddEven);
						var grpName = data[0].taggroup;
						console.log("grpName$$$$$$$$",grpName);
						positions = positions.concat(addGroupsRows(colList,data,index,grpConstraintsList,"total"));
						
						if(getWorkSpaceGroupState(wsData,grpName,"min","min")){
							// min row addd
							positions = positions.concat(addGroupsRows(colList,data,index,grpConstraintsList,"min"));
						}
						
						if(getWorkSpaceGroupState(wsData,grpName,"max","max")){
							// min row addd
							positions = positions.concat(addGroupsRows(colList,data,index,grpConstraintsList,"max"));
						}
						
						if(getWorkSpaceGroupState(wsData,grpName,"target","target")){
							// min row addd
							positions = positions.concat(addGroupsRows(colList,data,index,grpConstraintsList,"target"));
						}
						
						/*
						var grpMin = getWorkSpaceGroupState(wsData,grpName,"min","min");
						
						if(index === tagGroup) {
							positions = positions.concat(addGroupsRows(colList,data,index,grpConstraintsList, addedGroupState, selectedRow));	
						} else {
							positions = positions.concat(addGroupsRows(colList,data,index,grpConstraintsList));
						}*/
					}
					counterOddEven++;
				});
				
				/*if(positions.length!=0){
					var totalColData =  getGrandTotalRow(colList,positionsList,"ALL","total",'tgroup');
					var totalColDataMin =  getGrandTotalRowMin(colList,positionsList,"ALL",'tmin',grpConstraintsList);
					var totalColDataMax =  getGrandTotalRowMax(colList,positionsList,"ALL",'tmax',grpConstraintsList);
					var totalColDataTarget = getGrandTotalRowTarget(colList,positionsList,"ALL",'ttarget',grpConstraintsList);
					
					positions.push(totalColData);
					positions.push(totalColDataMin);
					positions.push(totalColDataMax);
					positions.push(totalColDataTarget);
				}*/
				////console.log("Final Row :",totalColData);
				/**/
				var indexLevelCnt = 0;
				angular.forEach(positions, function(data, index) {
					data["indexLevel"] = indexLevelCnt;
					indexLevelCnt++;
				});
				////console.log("Groupped Positions :",positions, positions.length);
				return positions;
				
			}
			
			function identifyOddEvenGroup(data, counterOddEven) {
				angular.forEach(data, function(groupData, index) {					
					if(counterOddEven % 2 === 0) {
						groupData["groupClass"] = "groupEven";
					} else {
						groupData["groupClass"] = "groupOdd";
					}
				});
			}
			
			function removeGrouping(positionsList){
				var i = 0;
				while(i<positionsList.length){
					if(positionsList[i].isGroupColumn == true){
						positionsList.splice(i,1);
					}else{
						i++;
					}
				}
				
				////console.log("new positions :", positionsList);
				
				positionsList = filterByTagGroup(positionsList);
				
				var objOfGroupPositions = {};
				angular.forEach(positionsList, function(data, index) {
					if(objOfGroupPositions.hasOwnProperty(data["taggroup"])){
						var pos1 = objOfGroupPositions[data["taggroup"]];
						pos1.push(data);
						objOfGroupPositions[data["taggroup"]] = pos1;
					}else{
						var pos = [];
						pos.push(data);
						objOfGroupPositions[data["taggroup"]] = pos;
					}
					
				});
				
				////console.log("new sub group object :",objOfGroupPositions);
				
				return objOfGroupPositions;
			
			}
			
			
			function getTotalSum(arrayWeight, arrayValue) {
					var sum = 0;
					for (i = 0; i < arrayWeight.length; i++) {
						if(!arrayWeight[i].isNaN && !arrayValue[i].isNaN)	
							sum +=  Number(arrayWeight[i])* Number(arrayValue[i]);
					}
					return sum;
			}
			
			function getArraySum (ar){
					var sum = 0;
					for (i = 0; i < ar.length; i++) {
						if(!ar[i].isNaN)
							sum += Number(ar[i]);

					}
					return sum;
			}
			
			
			function getTotalSharpe(totalYTW, totalHairCut, totalVol){
				return ((totalYTW - totalHairCut) * 100)/ totalVol;
			}
			
			function getTotalYtw(arMVCols,arYtwCols){
				return getTotalSum (arMVCols,arYtwCols).toFixed(2);
			}			
			
			function getTotalOas(arMVCols,arOasCols){
				return getTotalSum (arMVCols,arOasCols).toFixed(2);
			}			
			
			function getTotalSkew(arMVCols, arSkewCols){
				return getTotalSum (arMVCols,arSkewCols).toFixed(2);
			}
			
			function getTotalSpreadDur(arMVCols, arSpreadDurCols){
				return getTotalSum (arMVCols,arSpreadDurCols).toFixed(2);
			}
			
			function getTotalDur(arMVCols, arDurCols){
				return getTotalSum (arMVCols,arDurCols).toFixed(2);
			}
			
			function getTotalRatings(arMVCols, arRatingCols) {
				return (totalSum(arMVCols, arRatingCols)/getArraySum(arMVCols)).toFixed(2);
			}
			
			//Expected Return 
			function getTotalExpReturns(arMVCols, arExpReturnsCols) {
				return getTotalSum (arMVCols,arExpReturnsCols).toFixed(2);
				//return (getTotalSum(arMVCols, arExpReturnsCols)/getArraySum(arMVCols)).toFixed(2);
			}
			
			
			function getTotalCTSD(arCtsdCols) {
				return getArraySum(arCtsdCols).toFixed(2);
			}
			
			function getTotalMV(arMVCols) {
				return getArraySum(arMVCols).toFixed(2);
			}
			
			function getTotalCTD(arCTDCols){
				return getArraySum(arCTDCols).toFixed(2);
			}
			
			function getTotalVol(arMVCols,arMatrix){
				var matrixMV = Math.matrix(arMVCols);
				matrixMV.resize([arMVCols.length,1]);
				var tempArray = Math.multiply(Math.transpose(matrixMV),arrayMatrix);
				var volTotal = Math.multiply(tempArray,matrixMV);
				return (volTotal);
			}
			
			function getTotalRating(arMVCols,arMatrix){
				return totalSum(arrayWeight, arrayValue)/getArraySum(arrayWeight);
			}
			
			
			function getRatingToNum(rating) {
				switch(true) {
				case (rating == "AAA"):
					return 0.67;
					break;
				case (rating == "AA+"):
					return 1.00;
					break;
				case (rating == "AA"):
					return 1.33;
					break;
				case (rating == "AA-"):
					return 1.67;
					break;
				case (rating == "A+"):
					return 2.00;
					break;
				case (rating == "A"):
					return 2.33;
					break;
				case (rating == "A-"):
					return 2.67;
					break;
				case (rating == "BBB+"):
					return 3.00;
					break;
				case (rating == "BBB"):
					return 3.33;
					break;
				case (rating == "BBB-"):
					return 3.67;
					break;
				case (rating == "BB+"):
					return 4.00;
					break;
				case (rating == "BB"):
					return 4.33;
					break;
				case (rating == "BB-"):
					return  4.67;
					break;
				case (rating == "B+"):
					return 5.00;
					break;
				case (rating == "B"):
					return 5.33;
					break;
				case (rating == "B-"):
					return 5.67;
					break;
				case (rating == "CCC+"):
					return 6.00;
					break;
				case (rating == "CCC"):
					return 6.33;
					break;
				case (rating == "CCC-"):
					return 6.67;
					break;
				case (rating == "CC"):
					return 7.33;
					break;
				case (rating == "C"):
					return 8.33;
					break;
				case (rating == "D"):
					return 9.33;
					break;
				default:
					return 10.0;
				}
			}
			
			
			function getNumToRating(num) {
				switch(true) {
				case (num <= 0.67):
					return "AAA";
					break;
				case (num <= 1.0):
					return "AA+";
					break;
				case (num <= 1.33):
					return "AA";
					break;
				case (num <= 1.67):
					return "AA-";
					break;
				case (num <= 2.0):
					return "A+";
					break;
				case (num <= 2.33):
					return "A";
					break;
				case (num <= 2.67):
					return "A-";
					break;
				case (num <= 3.0):
					return "BBB+";
					break;
				case (num <= 3.33):
					return "BBB";
					break;
				case (num <= 3.67):
					return "BBB-";
					break;
				case (num <= 4.0):
					return "BB+";
					break;
				case (num <= 4.33):
					return "BB";
					break;
				case (num <= 4.67):
					return "BB-";
					break;
				case (num <= 5.0):
					return "B+";
					break;
				case (num <= 5.33):
					return "B";
					break;
				case (num <= 5.67):
					return "B-";
					break;
				case (num <= 6.0):
					return "CCC+";
					break;
				case (num <= 6.33):
					return "CCC";
					break;
				case (num <= 6.67):
					return "CCC-";
					break;
				case (num <= 7.33):
					return "CC";
					break;
				case (num <= 8.33):
					return "C";
					break;
				case (num <= 9.33):
					return "D";
					break;
				default:
					return 'F';
				}
			}
			
			


		
			
			
			
			function getTotalOfCols(colName,positionsList,forGroup){
				var ar = [];
				angular.forEach(positionsList, function(data, index) {
					//////console.log("getTotalOfCols",data,index,colName);
					if(forGroup == "ALL"){
						//////console.log("##",data);
						if(!isNaN(data[colName])){
						  ar.push(data[colName]);
						}
					}else{
						if(data['taggroup'] == forGroup){
							if(!isNaN(data[colName])){
								ar.push(data[colName]);
							}
						}
					}
				});
				return ar;
			}
			
			
			function getGrandTotalRowMin (colList,positionsList,groupName,grp,grpConstraintsList){
				var obj = new Object();
				angular.forEach(colList, function(data, index) {
					if(!stringColObject.hasOwnProperty(data)){
						obj[data] =  "";
					}
				});
				obj["id"] = "";
				obj["description"] = getGroupNameDesc(groupName,"min");
				obj["taggroup"] = "";
				obj[isGroupColumn] = true;
				obj["w_group_name"] = grp;
				//obj["cssClass"] = "totalFooter";
				// positionsObj,groupConstraintsObj
				var grpConstraints = getGrpConstraingObjByGrpId(groupName,grpConstraintsList);
				if(grpConstraints != null){
					obj = addGroupConstraints(obj,grpConstraints,"min");
				}
				return obj;
			}
			
			function getGrandTotalRowMax (colList,positionsList,groupName,grp,grpConstraintsList){
				var obj = new Object();
				angular.forEach(colList, function(data, index) {
					if(!stringColObject.hasOwnProperty(data)){
						obj[data] =  "";
					}
				});
				obj["id"] = "";
				obj["description"] = getGroupNameDesc(groupName,"max");
				obj["taggroup"] = "";
				obj[isGroupColumn] = true;
				obj["w_group_name"] = grp;
				//obj["cssClass"] = "totalFooter";
				var grpConstraints = getGrpConstraingObjByGrpId(groupName,grpConstraintsList)
				if(grpConstraints!=null){
					obj = addGroupConstraints(obj,grpConstraints,"max");
				}
				return obj;
			}
			
			function getGrandTotalRowTarget (colList,positionsList,groupName,grp,grpConstraintsList){
				var obj = new Object();
				angular.forEach(colList, function(data, index) {
					if(!stringColObject.hasOwnProperty(data)){
						obj[data] =  "";
					}
				});
				obj["id"] = "";
				obj["description"] = getGroupNameDesc(groupName,"target");
				obj["taggroup"] = ""
				obj[isGroupColumn] = true;
				obj["w_group_name"] = grp;
				//obj["cssClass"] = "totalFooter";
				
				var grpConstraints = getGrpConstraingObjByGrpId(groupName,grpConstraintsList)
				if(grpConstraints!=null){
					obj = addGroupConstraints(obj,grpConstraints,"target");
				}
				return obj;
			}
			
			
			function getGrandTotalRow(colList,positionsList,forGroup,groupName,grp){
				//positionsList = removeGrouping (positionsList);
				var objOfColArr = new Object();
				angular.forEach(colList, function(data, index) {
					//////console.log("getGroupTotalRow",data,index);
					if(!stringColObject.hasOwnProperty(data)){
						objOfColArr[data] =  getTotalOfCols(data,positionsList,forGroup);
					}
				});
				
				
				var obj = new Object();
				////console.log(" New Columns : ",colList);
				angular.forEach(colList, function(data, index) {
					if(!stringColObject.hasOwnProperty(data)){
						if(data == "mv"){
							obj[data] =  getTotalMV(objOfColArr[data]);
						} else if(data == "cdst"){
							obj[data] =  getTotalCTSD(objOfColArr[data]);
						} else if(data == "expreturn"){
							obj[data] =  getTotalExpReturns(objOfColArr["mv"], objOfColArr[data]);
						} else if(data == "duration"){
							obj[data] =  getTotalDur(objOfColArr["mv"],objOfColArr[data]);
						} else if(data == "spreaddur"){
							obj[data] =  getTotalSpreadDur(objOfColArr["mv"], objOfColArr[data]);
						} else if(data == "ytw"){
							obj[data] =  getTotalYtw(objOfColArr["mv"], objOfColArr[data]);
						} else if(data == "oas"){
							obj[data] =  getTotalOas(objOfColArr["mv"], objOfColArr[data]);
						} else if(data == "skew"){
							obj[data] =  getTotalSkew(objOfColArr["mv"], objOfColArr[data]);
						} /*else if(data == "sharpe"){
							obj[data] =  getTotalSharpe(objOfColArr["mv"], getArraySum(objOfColArr["haircut"]), getArraySum(objOfColArr["volatility"]));
						}*/ else if(data == "ctd"){
							obj[data] = getTotalCTD(objOfColArr[data]);
						}/* else{
							obj[data] =  getArraySum(objOfColArr[data]);
						}*/
						
						

					}
				});
				obj["id"] = "";
				obj["description"] = getGroupNameDesc(forGroup,groupName);
				obj["taggroup"] = ""
				obj[isGroupColumn] = true;
				obj[isGroupDelete] = true;
				obj["w_group_name"] = grp;
				return obj;
			}
			
			function filterByTagGroup(positionsList){
				return $filter('orderBy')(positionsList, ['-taggroup', '-indexLevel'], true)
			}
			
			function getTagGroup(ws_data){
				var tagAr = [];
				var obj ={};
				if(ws_data["groups"]!=undefined) return ws_data["groups"];
				var positions = ws_data.positions;
				if(positions!=null && positions!=undefined){
					var len = positions.length;
					for(var i =0;i<len;i++){
						var pos = positions[i];
						if(pos!=undefined && pos.hasOwnProperty("taggroup")){
							if(!obj.hasOwnProperty(pos.taggroup)){
								tagAr.push(pos.taggroup);
								obj[pos.taggroup] =pos.taggroup;
							}
						}
					}
				}
				
				console.log("tagAr:",tagAr);
				return tagAr;
			}
			
			function setTagGroup(tagList){
				return angular.copy(tagList);
			}
			
			
			function setWorkSpaceGroupState(ws,grpName,key,value){
				console.log("setWorkSpaceGroupState :",ws);
			    var wsGrp = ws["addedGroup"];
				var grpObj;
				if(wsGrp==undefined){
					grpObj = ws["addedGroup"] = {};
				}else{
					grpObj = ws["addedGroup"];
				}
				if(grpObj.hasOwnProperty(grpName)){
					var ob = grpObj[grpName];
					ob[key] = value;
					//grpObj[grpName] = ob;
				}else{
					var o = {};
					o[key] = value;
					grpObj[grpName] = o;
				}
			}
			
			
			function getWorkSpaceGroupState(ws,grpName,key,value){
				console.log("getWorkSpaceGroupState :",ws);
				var wsGrp = ws["addedGroup"];
				if(wsGrp!=undefined && wsGrp.hasOwnProperty(grpName)){
					var grpObj = ws["addedGroup"];
					var o = grpObj[grpName];
					if(o!=undefined && o.hasOwnProperty(key)){
						return true;
					}
				}
				return false;
			}
			
			
			function actionOnGroupSelection(wsData,grpName,key,value){
				console.log("actionOnGroupSelection :",wsData);
				var bool = getWorkSpaceGroupState(wsData,grpName,key,value);
				console.log()
				if(!bool){
					setWorkSpaceGroupState(wsData,grpName,key,value);
					
					return true;	
				}
				return false;
				
			}
			
			function removePosistionById(ws,id){
				var len = ws.positions.length;
				for(var i=0;i<len;i++){
					if(ws.positions[i].id == id){
						ws.positions.splice(i,1);
						return ws;
					}
				}
				var wsAddedGroup = ws.addedGroup;
				if(wsAddedGroup != undefined) {
					tagGroupName = id.split("_")[0];
					groupType = id.split("_")[1];
					
					console.log("wsAddedGroup",wsAddedGroup);
					
					angular.forEach(wsAddedGroup, function(dataAddedGroup, index) {
						
						console.log("dataAddedGroup",dataAddedGroup, index);
						
						if(index == tagGroupName && dataAddedGroup[groupType] == groupType){
							delete wsAddedGroup[tagGroupName][groupType];
						}
					});
				}
				
			}
			
			function getIndicesList(positions,indicesList_l){
				var selectedList = [];
				angular.forEach(positions, function(data, index) {                
					selectedList.push(positions[index].id);
				});
				selectedList.sort();

				var tempIds = [];
				angular.forEach(indicesList_l, function(data, index) {
					if (selectedList.indexOf(data.id) == -1) {
						tempIds.push(data);
					}
				});
				return tempIds;
			}
			
        });
}());