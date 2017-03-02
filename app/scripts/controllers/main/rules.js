'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:rulesCtrl
 * @description
 * # rulesCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('RulesCtrl', function ($scope, MatrixService, I18N, DataService, $rootScope, UtilsService) {
            //window.presenderReady SEO
            window.prerenderReady = false;

            $scope.connection = MatrixService.getInstance();
            $scope.i18n = I18N[DataService.language];
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }

            $rootScope.$broadcast('change-language', {
                data: localStorage.getItem('language')
            });

            //SEO get terms and conditions content and set window.prerenderReady to true
            var clearwatch = $scope.$watch(function () {
                if (DataService.stateTermsConditions) {
                    setTimeout(function () {
                        window.prerenderReady = true;
                    }, 2000);
                    clearwatch();
                }
            });
            //End SEO  
        });
