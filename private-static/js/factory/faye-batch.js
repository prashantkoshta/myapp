'use strict';
app.factory('svcFaye', ["$faye",function($faye) {
  return $faye("/faye");
}]);
