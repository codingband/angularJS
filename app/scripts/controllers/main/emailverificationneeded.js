'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainEmailverificationneededctrlCtrl
 * @description
 * # MainEmailverificationneededctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('EmailVerificationNeededCtrl', 
    function ($scope, UtilsService, DataService) {
        $scope.data = DataService;

        $scope.closeDialog = function () {
            $scope.data.modalDialogs.emailVerif.close();
        };
  });
