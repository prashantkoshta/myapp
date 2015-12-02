'use strict';
app.factory('Faye', ["$faye",function($faye) {
  return $faye("http://peaceful-basin-7772.herokuapp.com/faye");
}]);
