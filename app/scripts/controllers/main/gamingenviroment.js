'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainGamingenviromentctrlCtrl
 * @description
 * # MainGamingenviromentctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('GamingEnviromentCtrl',
                function ($scope, MatrixService, I18N, DataService, $rootScope, UtilsService) {
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
                    
                    //SEO get Gaming Enviroment content and set window.prerenderReady to true
                    var clearwatch = $scope.$watch(function () {
                        if (DataService.stateRespGambling) {
                            setTimeout(function () {
                                window.prerenderReady = true;
                            }, 2000);
                            clearwatch();
                        }
                    });
                    //End SEO
                });
