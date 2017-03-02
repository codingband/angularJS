'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainMyaccountdetailsctrlCtrl
 * @description
 * # MainMyaccountdetailsctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('MyAccountDetailsCtrl', function ($scope, $q,  I18N, DataService) {
    $scope.data = DataService;
    $scope.i18n = I18N[DataService.language];
      
  });
