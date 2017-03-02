'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainLimitstabctrlCtrl
 * @description
 * # MainLimitstabctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('LimitsTabCtrl', 
    function ($scope, I18N, DataService) {
     $scope.data = DataService;
    $scope.i18n = I18N[DataService.language];
    $scope.tabName = 'limits';
    $scope.changeTabLimits = function (values) {
        $scope.tabName = values;
    };     
  });
