'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:securityPageCtrl
 * @description
 * # securityPageCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('SecurityPageCtrl', function ($scope, WPService, MatrixService, DataService, I18N, $rootScope, UtilsService) {

            //window.presenderReady SEO
            window.prerenderReady = false;
            $scope.connection = MatrixService.getInstance();
            $scope.i18n = I18N[DataService.language];
            $scope.img = cyberPlayLocalized.images;
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }

            $rootScope.$broadcast('change-language', {
                data: localStorage.getItem('language')
            });

            var stateSecurity = false;
            WPService.getSinglePostInCategoryAllTagLanguage("Casino", "Lorem").success(function (res) {
                $scope.bonusTerms = res[0];
                if ($scope.bonusTerms !== undefined) {
                    stateSecurity = true;
                }
            });

            WPService.getSinglePostInCategoryAllTagLanguage("Help", "Security Page").success(function (res) {
                $scope.pageSecurity = res[0];
                $scope.numberContent++;
            });

            /*PLEASE Be carefull if the number of aboutUs page change, the conditional 
             * should by change 
             * SEO get games and set window.prerenderReady to true
             */
            var clearwatch = $scope.$watch(function () {
                if ($scope.bonusTerms !== undefined) {
                    setTimeout(function () {
                        window.prerenderReady = true;
                    }, 2000);
                    clearwatch();
                }
            });
            //End SEO

            $scope.path = cyberPlayLocalized.urlhome;

            //SEO get Security content and set window.prerenderReady to true
            var clearwatch = $scope.$watch(function () {
                if (stateSecurity) {
                    setTimeout(function () {
                        window.prerenderReady = true;
                    }, 2000);
                    clearwatch();
                }
            });
            //End SEO

        });
