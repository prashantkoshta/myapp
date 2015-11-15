(function () {
    angular.module("app.components")
        .directive("wmcMouseoverViewBox", function () {
            return {
                templateUrl: "app/components/mouseover.html",
                controller: "WmcMouseoverController",
				link: function( scope, elm, attr ){
				
					var showPopInfo = false;
					$(this).mouseover(function(evt){
						if(!showPopInfo){
							scope.visibleInfoMatrix = false;
							scope.$apply();
							showPopInfo = false;
						}
					});
					
					scope.$watch(
                        "visibleInfoMatrix",
                        function handleWatchValueChange( newValue, oldValue ) {
                           // console.log( "$watch() -- Middle:", newValue,oldValue,scope.InfoTop,scope.InfoLeft);
							if(newValue){
								var w = $('.PopoverMouseoverWrapper').width;
								var h = $('.PopoverMouseoverWrapper').height;
								var t = scope.InfoTop + 10;
								var l = scope.InfoLeft + w/2;
								$('.PopoverMouseoverWrapper').css("top",t);
								$('.PopoverMouseoverWrapper').css("left",l);
							}

                        }
                    );
					/**/
				
				}
            }
        });
}());