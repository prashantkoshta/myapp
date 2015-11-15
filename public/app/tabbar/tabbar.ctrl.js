(function () {
    angular.module("app.tabbar")
        .controller("WmcTabController", function ($scope, $routeParams,wmccollectionSvc,$timeout) {
			
			$scope.tabList = [];
			$scope.$on("addTabs", addTabs);
			$scope.selectedTabID = "";
			$scope.$on("addNewTabbar",addNewTabs);
			
			// broadcast from main
			$scope.$on("startUpdateView",startUpdateTabView);
			
			
			// Local
			
			function addNewTabs(evt, data) {
                //console.log("addNewTabs",data);
				updateTabs(data);
            }
			
			function addTabs(evt, data) {
                //console.log("addTabs....",data.ws);
				$scope.tabList.push(data.ws);	
            }
			
            $scope.closeWorkSpace = function(key)  {
				//console.log("closeWorkSpace", key, $scope.tabList);
				var obj = wmccollectionSvc.removeWSList($scope.tabList,key);
				//return {"tabList":tabList,"new_wsid":new_wsid,"old_wsid":old_wsid};
				$scope.tabList = obj.wsList;
				$scope.selectedTabID = obj.new_wsid;
				$scope.$emit("closeWorkSpace", {"new_wsid":obj.new_wsid,"old_wsid":obj.old_wsid});
            };
			
			
			$scope.setCurrentWorkspace = function(item)  {
				console.log("setCurrentWorkspace");
				$scope.selectedTabID = item.id;
				$scope.$emit("onNavTabClick", {"ws":item});
            };
			
			$scope.showSelectedTab = function(item){
				if($scope.selectedTabID!= "" && item!= undefined && $scope.selectedTabID == item.id){
					return {"active":'active'};	
				}else{
					return {"active":''};
				}
				
			}
			
			$scope.showInputView = function(item){
				console.log("showInputView : ",item);
				return item["editMode"];
			}
			//$scope.boolDbClick = false;
			$scope.isEditView = function(item){
				console.log("isEditView : ",item);
				return item["editMode"];
			}
			
			$scope.editCurrentWorkspace = function(item)  {	
            	console.log("editCurrentWorkspace : ",item);
            	item["editMode"] = true;
				
			};
			
			$scope.doneEditing = function (evt,item) {
				console.log("doneEditing : ",item);
		     	item["editMode"] = false;
				updateDescription(item.desc);
		    };
			
			function updateDescription(str){
				$scope.$emit("onUpdateDescEvt", str);
			}
			
			/*function isAllowCharacter(code){
			48-57 Number
			65-90 a-z
			96-105 num pad 0-9
			46 delete
			
				if(code ){
				}
			}*/
			
		    $scope.txtValidation = function(event,item){
				console.log("txtValidation : ",event,item);
		    	var regex = new RegExp("^[a-zA-Z0-9]+$");
			    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
				if(event.keyCode == 13){
		     		item["editMode"] = false;
					updateDescription(item.desc);
					return true;
		     	}
				
			    if (!regex.test(key)) {
			       event.preventDefault();
			       return false;
			    }				
		     	
		    }
			
			function updateTabs(list){
				$scope.tabList = list;	
				if($scope.tabList.length>0){
					$scope.selectedTabID = $scope.tabList[$scope.tabList.length -1].id;
				}
			}
			
			function startUpdateTabView(){
				updateTabs($scope.workSpaceList)
			}
			
			
			

        });
})();