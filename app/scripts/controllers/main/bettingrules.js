'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainBettingrulesctrlCtrl
 * @description
 * # MainBettingrulesctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('bettingRulesCtrl',
                function ($scope, WPService, MatrixService, DataService, I18N, $rootScope) {

                    $scope.connection = MatrixService.getInstance();
                    $scope.i18n = I18N[DataService.language];

                    $rootScope.$broadcast('change-language', {
                        data: localStorage.getItem('language')
                    });

                    WPService.getSinglePostInCategory("Casino", "Lorem").success(function (res) {
                        $scope.bettingRules = res[0];
                    });

                    $scope.path = cyberPlayLocalized.urlhome;

                });
