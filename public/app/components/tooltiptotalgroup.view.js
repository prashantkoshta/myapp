(function () {
    angular.module("app.components")
        .directive("wmcTooltipGroup", function () {
            return {
                templateUrl: "app/components/tooltiptotalgroup.html",
                controller: "wmcTooltipGroupController",
				link: function( scope, elm, attr ){
					//console.log("link function :",scope,elm,attr,$(this));
					var showPop = false;
					$('.PopoverWrapper').click(function(evt){
						showPop = true;
						console.log("click",evt);
					});
					
					$(this).click(function(evt){
						//console.log("click this",evt,showPop,scope.visibleTipMatrix);
						if(!showPop){
							scope.visibleTipGroup = false;
							scope.$apply();
							showPop = false;
						}
						
					});
					
					
					
					scope.$watch(
                        "visibleTipGroup",
                        function handleWatchValueChange( newValue, oldValue ) {
                            console.log( "$watch() -- Middle:", newValue,oldValue,scope.tipTop,scope.tipLeft);
							if(newValue){
								var w = $('.PopoverGroupWrapper').width;
								var h = $('.PopoverGroupWrapper').height;
								var t = scope.tipTop;// + 10;
								var l = scope.tipLeft + 88;
								$('.PopoverGroupWrapper').css("top",t);
								$('.PopoverGroupWrapper').css("left",l);
							}

                        }
                    );
				
				}
            }
        });
}());