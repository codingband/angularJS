'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainSecurityCtrl
 * @description
 * # MainSecurityCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('SecurityCtrl', function ($scope, $http, $q, WPService, MainMatrixService, UtilsService, $rootScope) {

            WPService.getSinglePostInCategory("Help", "Help Security").success(function (res) {
                $scope.data.content = res[0];
                
                $rootScope.$broadcast('change-language', {
                    data: localStorage.getItem('language')
                });
                
                $scope.closeModal = function () {
                    UtilsService.modalDialog.close();
                };
            });


        });
