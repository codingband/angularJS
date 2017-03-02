'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainModalinstancectrlCtrl
 * @description
 * # MainModalinstancectrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('ModalInstanceCtrl', 
    function ($scope, UtilsService, message) {
        $scope.message = message;
            $scope.ok = function(){
                UtilsService.modalDialog.close();
        };
  });
