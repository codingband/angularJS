'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainAccountdetailsctrlCtrl
 * @description
 * # MainAccountdetailsctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('AccountDetailsCtrl', 
    function ($scope, UtilsService, I18N, DataService) {
       $scope.data = DataService;
        $scope.i18n = I18N[DataService.language];
        if(DataService.modalLimit){
          $scope.data.tabName='limits';
        }
        $scope.changeTab = function (value) {
            $scope.data.tabName = value;
        };

        $scope.closeAccountDetails = function () {
            if(UtilsService.isAppleDevice()){
                   UtilsService.enableScrollNormal(); 
            }
            UtilsService.modalDialog.close();
        };     
  });
