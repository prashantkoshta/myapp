(function () {
    angular.module("app.components")
        .directive("wmcTooltipRatingViewBox", function () {
            return {
                templateUrl: "app/components/tooltiprating.html",
                controller: "WmcTooltipRatingController",
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
							scope.visibleTipRating = false;
							scope.$apply();
							showPop = false;
						}
						
					});
					
					
					
					scope.$watch(
                        "visibleTipRating",
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