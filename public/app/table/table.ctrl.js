(function () {
    angular.module("app.table", ['ngGrid'])
        .controller("TableController", function ($scope, $rootScope, $http, $routeParams, $filter, wmcutilsSvc,wmcdataSvc) {
			
			$scope.ws_data_l = {};
			$scope.tableList = [];
			$scope.tableListTotal = [];
			////console.log("Hi I amere",$scope.tableList);
			$scope.columnPopupList = [];

			$scope.colsPopupList = [];
			////console.log($scope.tableList);
			// dispatch from popup ctrl
			$rootScope.$on("deleteConfirmRowAction",nowDeleteRow);
			
			// dispatch from main
			$scope.$on("workSpaceDataGet",showDataInGrid);
			// dispatch from nav
			//$scope.$on("showTable", startTableUpdateView);
			// dispatch from main.ctrl
			$scope.$on("startUpdateView", startTableUpdateView);
			$scope.tagList	 = [];
			
			
			// dispatch from group tooltip ctrl
			$rootScope.$on("onClickGroupSelect", onGroupSelect);


			function updateVisibleGridCols(){
				var len = $scope.colsPopupList.length;
				for(i=0;i<len;i++){
					var item = $scope.colsPopupList[i];
					updateGridVisibleCols(item);
				}
			}

			
			function startTableUpdateView(){
				console.log("****showDataInGrid.....",$scope.objCurrentWS);
				$scope.ws_data_l = $scope.objCurrentWS;
				$scope.tableList = $scope.objCurrentWS.positions;

				if($scope.ws_data_l.hasOwnProperty("visibleColsList")){
					$scope.colsPopupList = $scope.ws_data_l.visibleColsList;
				}else{
					$scope.colsPopupList = [];
				    var colL = $scope.gridOptions.columnDefs.length;
				    var cnn =0;
				    for(var m=0;m<colL;m++){			    	
				    	var field = $scope.gridOptions.columnDefs[m].field;
				    		if(field!="" && field!="description"){
				    			$scope.colsPopupList[cnn] = {
						    		id:$scope.gridOptions.columnDefs[m].field,
						    		displayName:$scope.gridOptions.columnDefs[m].displayName,
						    		visible:"checked"
						    	};
						    	cnn++;
				    		}
				    }
					$scope.ws_data_l["visibleColsList"] = $scope.colsPopupList;


				}

				

				
				updateVisibleGridCols();

				renderTableNow();				
			}
			
			$scope.checkBoxStyle = function(item){
				return "columns_drpdwn-op-"+item.visible;
			}

			function renderTableNow(){
				$scope.tableList = wmcutilsSvc.addPositionsConstraints($scope.tableList,$scope.ws_data_l.position_constraints);
				$scope.tableList = wmcutilsSvc.filterByTagGroup($scope.tableList);
				if($scope.ws_data_l.hasOwnProperty("indicesList")){
					$scope.indicesList_l = $scope.ws_data_l.indicesList;
				}else{
					// global variable $scope.indicesList declared in shell.ctrl
					$scope.ws_data_l.indicesList = wmcutilsSvc.getIndicesList($scope.tableList,$scope.indicesList);
					$scope.indicesList_l = $scope.ws_data_l.indicesList;
				}
				
				if($scope.ws_data_l.hasOwnProperty("groups")){
					$scope.tagList = $scope.ws_data_l.groups;
				}else{
					$scope.ws_data_l["groups"]  = wmcutilsSvc.getTagGroup($scope.ws_data_l);//   getTagGroup($scope.ws_data_l);
					$scope.tagList = wmcutilsSvc.setTagGroup($scope.ws_data_l["groups"]);
				}
				
				
				if($scope.ws_data_l.hasOwnProperty("group_constraints")){
					$scope.grpConstraintsList = $scope.ws_data_l.group_constraints;
				}else{
					$scope.grpConstraintsList = [];
				}
				
				
				$scope.columnPopupList = [];
				var col1 = $scope.tableList[0];
				for(i in col1){
					$scope.columnPopupList.push(i);
				}				
				$scope.tableList =  wmcutilsSvc.doTagGrouping($scope.columnPopupList,$scope.tableList,$scope.grpConstraintsList,$scope.ws_data_l);


				if($scope.tableList.length!=0){
					$scope.tableListTotal = [];
					var totalColData =  wmcutilsSvc.getGrandTotalRow($scope.columnPopupList,$scope.tableList,"ALL","total",'tgroup');
					var totalColDataMin =  wmcutilsSvc.getGrandTotalRowMin($scope.columnPopupList,$scope.tableList,"ALL",'tmin',$scope.grpConstraintsList);
					var totalColDataMax =  wmcutilsSvc.getGrandTotalRowMax($scope.columnPopupList,$scope.tableList,"ALL",'tmax',$scope.grpConstraintsList);
					var totalColDataTarget = wmcutilsSvc.getGrandTotalRowTarget($scope.columnPopupList,$scope.tableList,"ALL",'ttarget',$scope.grpConstraintsList);
					
					$scope.tableListTotal.push(totalColData);
					$scope.tableListTotal.push(totalColDataMin);
					$scope.tableListTotal.push(totalColDataMax);
					$scope.tableListTotal.push(totalColDataTarget);
				}

				

			}
			
		
			
			$scope.ratingArray = $scope.arRating;
			
			//Validate if the enter value is decimal or not
			$scope.isValidCellValue = function(){
				if($scope.newCellValue != ""){
					$scope.currentCellValue = $scope.newCellValue
					$scope.decimalValidationExp=  /^[-+]?[0-9]+\.[0-9]+$/; 
					if($scope.currentCellValue.match($scope.decimalValidationExp)){
						$scope.isValid = false;
					} else {
						$scope.isValid = true;
					}
				}
			}
			
			// dispatch from tooltip.ctrl
			$scope.$on("onClickOkAtTooltip",onEditTooltipDone);
			function onEditTooltipDone(evt,data){
				if(data.type == "table_edit_popop"){
					//console.log("onEditTooltipDone",data);
					currentRowEntity = data.data.row.entity;
					currentColField = data.data.col.field;
//alert("IN Function");
					if(data.data.col.field == "rating") {
//alert("if"+data.data.col.field);
						currentRowEntity[currentColField] = $scope.newCellValue;
						var ratingToNum = wmcutilsSvc.getRatingToNum($scope.newCellValue);
//alert("ratingToNum :"+ratingToNum);
					} else {
//alert("else"+data.data.col.field);
						//Validation
						$scope.updateValue = false;
						$scope.currentCellValue = $scope.newCellValue
						$scope.decimalValidationExp=  /^[-+]?[0-9]+\.[0-9]+$/; 
						if($scope.currentCellValue.match($scope.decimalValidationExp)) {   
							$scope.updateValue = true;
						}

						if($scope.updateValue) {
							currentRowEntity[currentColField] = Number($scope.newCellValue).toFixed(2);
							$scope.updateValue = false;
							
							/*console.log("this.evt: ",this.evt);
							$(this.evt).addClass("edited");*/
							
						
						}
					}
				}
			}
			
			// dispatch from mail.ctrl
			$scope.$on("onGetIndices", setIndicesList);
			$scope.indicesList_l = [];
			function setIndicesList(evt,data){
				$scope.indicesList_l =  data;
			}
			
			function showDataInGrid(evt,data){
				//startTableUpdateView()
			}
			
			
			
			
            function showTableView(evt,data) {
				//console.log("Table.....");
                //$scope.tableList = $scope.ws_data_l.positions;
				
            }
			
			//Locally declared variables
			$scope.selectedListGroup=[];
			
			
			$scope.selectedList=[];
			$scope.IndicesIds=[];
			
			$scope.selectedAction = "Tag";
			$scope.tagList = [];//"A", "B", "C"
			$scope.newTagName = "";
			
	
			$scope.groupList = [];
			$scope.groupRemoveList = [];
			
			//$scope.columnList = ""; // Declare for column list in nav bar
			

	
			/*$scope.fnWorkspaceIdData = function() {
				$scope.WorkspaceIdData = $scope.tableList;	
				$scope.selectedList = [];
				angular.forEach($scope.WorkspaceIdData, function(data, index) {                
					$scope.selectedList.push($scope.WorkspaceIdData[index].id);
				});
				$scope.selectedList.sort();

				var tempIds = [];
				angular.forEach($scope.indicesList_l, function(data, index) {
					if ($scope.selectedList.indexOf(data.id) == -1) {
						tempIds.push(data);
					}
				});
				$scope.indicesList_l = tempIds;
			};*/
	
			
	
			$scope.selectedCheckList = [];
			
			$scope.getSelectedValue = function(arrList,$index){
				$scope.selectedCheckList.push({
					"id":arrList.id,
					"desc":arrList.desc
				});
			};
	 
	 
			$scope.addRow = function(){ 
				if(!($scope.tableList != "")){
					$scope.tableList = [];
				}
				var l = $scope.selectedCheckList.length;
				console.log(" l :"+l);
				for(var i=0; i<l; i++){
						var id=$scope.selectedCheckList[i].id;						
						// Do here
						getPositionData(i,id,l);
				}	
				
			};
			
			function getPositionData(i,id,l){
				wmcdataSvc.getIndicesData(id)
						.then(
							function (response) {
								console.log("response : ",response,$scope.ws_data_l);
								var obj = angular.copy(response);
								obj["id"] = id;
								obj["description"] = id;
								$scope.tableList.push(obj);
								$scope.ws_data_l.positions = $scope.tableList;
								//$scope.tableList = $scope.ws_data_l.positions;
								var len = $scope.indicesList_l.length;
								for(var k=0;k<len;k++){
									if($scope.indicesList_l[k].id == id){
										$scope.indicesList_l.splice(k,1);
										break;
									}
								}
								
								//$scope.tableList = wmcutilsSvc.filterByTagGroup($scope.tableList);
								//$scope.tableList =  wmcutilsSvc.doTagGrouping($scope.columnPopupList,$scope.tableList,$scope.grpConstraintsList,$scope.ws_data_l);
								if(i == l-1) {
									renderTableNow();
									$scope.selectedCheckList=[];
									
								}
							},
							function (err) {
								//console.log("error finding : ", err);
							}
						); 
			}
	
			function nowDeleteRow(evt,data){
				//data.entity.id
				var id = data.entity.id;
				console.log("nowDeleteRow :",id);
				wmcutilsSvc.removePosistionById($scope.ws_data_l,id);
				$scope.tableList = $scope.ws_data_l.positions;
				$scope.tableList = wmcutilsSvc.doTagGrouping($scope.columnPopupList,$scope.tableList,$scope.grpConstraintsList,$scope.ws_data_l);
				$scope.ws_data_l.positions = $scope.tableList;
			}
			
			//Delete Selected row
			$scope.deleteSelectedRow = function(row){
				$scope.$emit("clickOnDeleteRow",row);
			};
			
			// Hide and Display columns in nav Bar function
			$scope.toggleCol = function(item) {
				var key = item.id;
				item.visible = (item.visible == "checked") ? "":"checked";
				
				updateGridVisibleCols(item);
			};

			function updateGridVisibleCols(item){
				var key = item.id;
				var bool = (item.visible == "checked") ? true:false;
				for(item in $scope.gridOptions.$gridScope.columns){
					var o =  $scope.gridOptions.$gridScope.columns[item];
					var col_name = o.colDef.field
					if(col_name.toUpperCase() == key.toUpperCase()){
						 o.visible = bool;
					}
				}

				for(item in $scope.gridOptionsTotal.$gridScope.columns){
					var o =  $scope.gridOptionsTotal.$gridScope.columns[item];
					var col_name = o.colDef.field
					if(col_name.toUpperCase() == key.toUpperCase()){
						o.visible = bool;
					}
				}
			}
			
			
			//Set Action from selected tag in drop down
			$scope.setAction = function($event, action, index, row) {
				$scope.tableList[row.rowIndex].taggroup = action;
				$scope.applyGroupByTag(action, row);
			};
			
			$scope.addTagInGridTbl = function(tag) {
				$scope.tagList.push(tag);
				$scope.tagList = wmcutilsSvc.setTagGroup($scope.tagList);
				$scope.ws_data_l.groups = $scope.tagList;
				$scope.newTagName = "";
			};
			
			$scope.applyGroupByTag = function(groupingOnTag, row) {
				//console.log("applyGroupByTag :",groupingOnTag,row);
				row.entity["taggroup"] = groupingOnTag;
				$scope.tableList = wmcutilsSvc.filterByTagGroup($scope.tableList);
				$scope.tableList =  wmcutilsSvc.doTagGrouping($scope.columnPopupList,$scope.tableList,$scope.grpConstraintsList, $scope.ws_data_l);
				
				
			}
			
			$scope.isShowDropDown = function(row){
				////console.log("isShowDropDown:",row.entity["isGroupColumn"]);
				return !row.entity["isGroupColumn"];
			}
			
			
			$scope.isShowDelete = function(row){
				return !row.entity["isGroupDelete"];
			}

			
			
			var cellSelectDropDownTemplate = wmcutilsSvc.getCellDropdownTemplate();
			var cellEditableTemplate = wmcutilsSvc.getEditableCellTemplate();
			var cellEditableConstTemplate = wmcutilsSvc.getEditableCellConstraintsTemplate();
			var cellDescriptionTemplate = wmcutilsSvc.getDescriptionTemplate();
			
			//console.log("#####Tab List onLoad: ", $scope.tableList);
			$scope.gridOptions = { 
				data: 'tableList',
				enableRowSelection : false,
				enableSorting : false,
				columnDefs: [
					{
						field: '',
						displayName: 'Tag',
						cellTemplate: cellSelectDropDownTemplate,
						width:'7%'/*,
						cellClass: 'nonEditableCol-even'*/
						
					},{
						field: 'description',
						displayName: 'Description',
						width:150,
						cellTemplate: cellDescriptionTemplate
					},{
						field: 'mv',
						displayName: 'MV',
						cellTemplate: cellEditableTemplate						

					},{
						field: 'ctd',
						displayName: 'CTD',
						cellTemplate: cellEditableTemplate
					},{
						field: 'cdst',
						displayName: 'CDST',
						cellTemplate: cellEditableTemplate
					},{
						field: 'expreturn',
						displayName: 'Exp Return',
						cellTemplate: cellEditableTemplate
					},{
						field: 'haircut',
						displayName: 'Haircut',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'rating',
						displayName: 'Rating',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'duration',
						displayName: 'Dur',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'spreaddur',
						displayName: 'Spread Dur',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'ytw',
						displayName: 'YTW',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'oas',
						displayName: 'OAS',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'volatility',
						displayName: 'VOL',
						cellTemplate: cellEditableTemplate
					},{
						field: 'skew',
						displayName: 'skew',
						cellTemplate: cellEditableTemplate
					},{
						field: 'sharpe',
						displayName: 'sharpe',
						cellTemplate: cellEditableTemplate
					},{
						field: 'mv_max',
						displayName: 'Min MV%',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate //'<div><div class="ngCellText" tooltip="min Mv value is greater" tooltip-append-to-body="true" tooltip-trigger:"focus" ng-class="{minMV: row.getProperty(\'arcurve\') > row.getProperty(\'fsabrl\')}">{{row.getProperty(col.field)}}</div></div>'
					},{
						field: 'mv_min',
						displayName: 'MAX MV%',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate
					},{
						field: 'ctd_min',
						displayName: 'Min CTD',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate
					},{
						field: 'ctd_max',
						displayName: 'Max CTD',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate
					},{
						field:'',
						displayName:'',
						width:'2%',
						cellTemplate:'<div class="deleteWrapper"><span ng-show="isShowDelete(row)" class="delete_grid_row" aria-hidden="true" ng-click="deleteSelectedRow(row)"></span><div style="visibility:hidden">.</div></div>'
					}
					
				]
				
			};

			$scope.gridOptionsTotal = { 
				data: 'tableListTotal',
				enableRowSelection : false,
				enableSorting : false,
				columnDefs: [
					{
						field: '',
						displayName: 'Tag',
						cellTemplate: cellSelectDropDownTemplate,
						width:'7%'/*,
						cellClass: 'nonEditableCol-even'*/
						
					},{
						field: 'description',
						displayName: 'Description',
						width:150,
						cellTemplate: cellDescriptionTemplate
					},{
						field: 'mv',
						displayName: 'MV',
						cellTemplate: cellEditableTemplate						

					},{
						field: 'ctd',
						displayName: 'CTD',
						cellTemplate: cellEditableTemplate
					},{
						field: 'cdst',
						displayName: 'CDST',
						cellTemplate: cellEditableTemplate
					},{
						field: 'expreturn',
						displayName: 'Exp Return',
						cellTemplate: cellEditableTemplate
					},{
						field: 'haircut',
						displayName: 'Haircut',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'rating',
						displayName: 'Rating',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'duration',
						displayName: 'Dur',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'spreaddur',
						displayName: 'Spread Dur',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'ytw',
						displayName: 'YTW',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'oas',
						displayName: 'OAS',
						cellTemplate: cellEditableTemplate						
					},{
						field: 'volatility',
						displayName: 'VOL',
						cellTemplate: cellEditableTemplate
					},{
						field: 'skew',
						displayName: 'skew',
						cellTemplate: cellEditableTemplate
					},{
						field: 'sharpe',
						displayName: 'sharpe',
						cellTemplate: cellEditableTemplate
					},{
						field: 'mv_max',
						displayName: 'Min MV%',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate //'<div><div class="ngCellText" tooltip="min Mv value is greater" tooltip-append-to-body="true" tooltip-trigger:"focus" ng-class="{minMV: row.getProperty(\'arcurve\') > row.getProperty(\'fsabrl\')}">{{row.getProperty(col.field)}}</div></div>'
					},{
						field: 'mv_min',
						displayName: 'MAX MV%',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate
					},{
						field: 'ctd_min',
						displayName: 'Min CTD',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate
					},{
						field: 'ctd_max',
						displayName: 'Max CTD',
						cellClass: 'positionConst',
						width:'6%',
						cellTemplate: cellEditableConstTemplate
					},{
						field:'',
						displayName:'',
						width:'2%',
						cellTemplate:'<div class="deleteWrapper"><span ng-show="isShowDelete(row)" class="delete_grid_row" aria-hidden="true" ng-click="deleteSelectedRow(row)"></span><div style="visibility:hidden">.</div></div>'
					}
					
				]
				
			}; 






























			
			$scope.getCellStyle = function(row,col){
				var obj = wmcutilsSvc.getCellBackGroundColor(row,col);
				return obj;
			};
			
			$scope.getCellDisable = function(row,col){
				var obj = wmcutilsSvc.getCellDisableProperty(row,col);
				return obj;
			};
			
			$scope.groupBorder = function(){
				return "groupBorder";
			};
			
			
			
			
			function onGroupSelect(evt,data){
				var grpname = data.data.row.entity.description.split(" ")[1];
				var grpType = data.selectedRow.toLowerCase();
				var bool = wmcutilsSvc.actionOnGroupSelection($scope.ws_data_l,grpname,grpType,grpType);
				if(bool){
					$scope.tableList =  wmcutilsSvc.doTagGrouping($scope.columnPopupList,$scope.tableList,$scope.grpConstraintsList, $scope.ws_data_l);
				}
			}
        });
})();