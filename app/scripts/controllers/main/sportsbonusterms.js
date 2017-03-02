'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainBonustermsctrlCtrl
 * @description
 * # MainBonustermsctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('SportsBonusTermsCtrl',
                function ($location, $scope, WPService, MatrixService, DataService, I18N, $rootScope, UtilsService) {
                    //window.presenderReady SEO
                    window.prerenderReady = false;
                    $scope.connection = MatrixService.getInstance();
                    $scope.i18n = I18N[DataService.language];
                    var stateBonusTerms = false;
                    
                    if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                        UtilsService.getNewIovationBlackBox(DataService);
                    }
                    
                    $rootScope.$broadcast('change-language', {
                        data: localStorage.getItem('language')
                    });
                    
                    WPService.getSinglePostInCategoryAllTagLanguage("Help", "rules sports").success(function (res) {
                        $scope.bonusTerms = res[0];
                        if ($scope.bonusTerms !== undefined) {
                            stateBonusTerms = true;
                        }
                    });

                    $scope.path = cyberPlayLocalized.urlhome;

                    //SEO get Bonus terms content and set window.prerenderReady to true
                    var clearwatch = $scope.$watch(function () {
                        if (stateBonusTerms) {
                            setTimeout(function () {
                                window.prerenderReady = true;
                            }, 2000);
                            clearwatch();
                        }
                    });
                    //End SEO
             
                    
 
                });
