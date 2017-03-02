'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainBonushistoryctrlCtrl
 * @description
 * # MainBonushistoryctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('BonusHistoryCtrl', 
    function ($scope, $q, I18N, DataService, MainMatrixService) {
            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            
            var promiseCurrentBonus = MainMatrixService.getInstance().getGameCasinoBonuses($q);
            promiseCurrentBonus.then(
                    function (success) {
                        DataService.bonusHistory = success.kwargs.bonuses;
                    },
                    function (error) {
                        console.log("error Current Bonus", error);
                    }
            );   
  });
