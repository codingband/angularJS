'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainAffiliatesCtrl
 * @description
 * # MainAffiliatesCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('AffiliatesCtrl', function ($scope, $rootScope) {

            $scope.path = cyberPlayLocalized.urlhome;

            $rootScope.$broadcast('change-language', {
                data: localStorage.getItem('language')
            });

        });
