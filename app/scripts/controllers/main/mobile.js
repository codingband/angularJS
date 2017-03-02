'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainMobilectrlCtrl
 * @description
 * # MainMobilectrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('mobileCtrl',
                function ($scope, WPService, MatrixService, DataService, I18N, $rootScope) {
                    $scope.connection = MatrixService.getInstance();
                    $scope.i18n = I18N[DataService.language];

                    $rootScope.$broadcast('change-language', {
                        data: localStorage.getItem('language')
                    });

                    WPService.getSinglePostInCategoryAllTagLanguage("Casino", "Lorem").success(function (res) {
                        $scope.bonusTerms = res[0];
                    });

                    $scope.path = cyberPlayLocalized.urlhome;
                });
