'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainCurrentbonusesctrlCtrl
 * @description
 * # MainCurrentbonusesctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('CurrentBonusesCtrl', 
    function ($scope, $q,  MatrixService, UtilsService, $uibModal, I18N, DataService, WPService, MainMatrixService) {
        $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            
            var promiseCurrentBonus = MainMatrixService.getInstance().getGameCasinoBonuses($q);
            promiseCurrentBonus.then(
                    function (success) {
                        DataService.currentBonus = success.kwargs.bonuses;
                    },
                    function (error) {
                        console.log("error Current Bonus", error);
                    }
            );
        //$scope.bonusData = WPService;
  });
