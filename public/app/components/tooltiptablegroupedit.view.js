(function () {
    angular.module("app.components")
        .directive("wmcTooltipTableGroupEdit", function () {
            return {
                templateUrl: "app/components/tooltiptablegroupedit.html",
                controller: "WmcTooltipTableGroupEditController",
				link: function( scope, elm, attr ){
					//console.log("link function :",scope,elm,attr,$(this));
					var showPop = false;
					$('.PopoverWrapper').click(function(evt){
						showPop = true;
						console.log("click",evt);
					});
					
					$(this).click(function(evt){
						//console.log("click this",evt,showPop,scope.visibleTipTableGroupEdit);
						if(!showPop){
							scope.visibleTipTableGroupEdit = false;
							scope.$apply();
							showPop = false;
						}
						
					});
					
					
					
					scope.$watch(
                        "visibleTipTableGroupEdit",
                        function handleWatchValueChange( newValue, oldValue ) {
                            console.log( "$watch() -- Middle:", newValue,oldValue,scope.tipTop,scope.tipLeft);
							if(newValue){
								var w = $('.PopoverWrapper').width;
								var h = $('.PopoverWrapper').height;
								var t = scope.tipTop;// + 10;
								var l = scope.tipLeft;// - w;
								$('.PopoverWrapper').css("top",t);
								$('.PopoverWrapper').css("left",l);
							}

                        }
                    );
				
				}
            }
        });
}());