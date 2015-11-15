angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('PopoverDemoCtrl', function ($scope) {
  $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'myPopoverTemplate.html',
    title: 'Title'
  };
});