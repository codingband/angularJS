'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainBonusestabctrlCtrl
 * @description
 * # MainBonusestabctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('BonusesTabCtrl', 
    function ($scope, I18N, DataService) {
            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            $scope.tabName = 'currentBonuses';
            $scope.changeTabBonuses = function (values) {
                $scope.tabName = values;
            };        
  });
