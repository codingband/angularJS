'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainMessagenewemailctrlCtrl
 * @description
 * # MainMessagenewemailctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('MessageNewEmailCtrl', function ($scope, UtilsService, $location) {
      $scope.closeMessage = function () {
                UtilsService.modalDialog.close();
                $location.path('/');
      };
  });
