'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainKyctabctrlCtrl
 * @description
 * # MainKyctabctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('KYCTabCtrl', 
    function ($scope, $q,  I18N, DataService, MainMatrixService) {
     $scope.data = DataService;
     $scope.i18n = I18N[DataService.language];
  });
