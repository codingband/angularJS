'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainFaqctrlCtrl
 * @description
 * # MainFaqctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('FaqCtrl', 
    function ($scope, $http, $q, WPService, MainMatrixService, UtilsService, DataService ) {
             WPService.getSinglePostInCategory("Help", "Help FAQ").success(function (res) {
                $scope.data.content = res[0];
            });

            $scope.closeModal = function () {
                UtilsService.modalDialog.close();
            };
  });
