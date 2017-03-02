'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:AboutUstrl
 * @description
 * # AboutUstrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('AboutUsCtrl',
                function ($scope, $http, WPService, UtilsService, $uibModal, MatrixService, DataService, I18N, $rootScope) {

                    //window.presenderReady SEO
                    window.prerenderReady = false;
                    $scope.numberContent = 0;

                    $scope.connection = MatrixService.getInstance();
                    $scope.i18n = I18N[DataService.language];
                    $scope.data = DataService;
                    
                    if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                        UtilsService.getNewIovationBlackBox(DataService);
                    }
                    
                    $rootScope.$broadcast('change-language', {
                        data: localStorage.getItem('language')
                    });
                    
                    $scope.signUp = function () {

                        $scope.data.modalDialogs.modalDialogBox =
                                UtilsService.showModalMessageAuto($uibModal, '', 'main/registerUser.html',
                                        'RegisterUserCtrl', 'large-modal');
                    };

                    WPService.getSinglePostInCategory("About Us", "Banner About Us").success(function (res) {
                        $scope.bannerAboutUs = res[0];
                        $scope.numberContent++;
                    });

                    //getSinglePostInCategoryAllTagLanguage (ALL Languaje )   
                    //getSinglePostInCategory(five Languaje)
                    WPService.getSinglePostInCategoryAllTagLanguage("About Us", "Data Protection").success(function (res) {
                        $scope.dataProtection = res[0];
                        $scope.numberContent++;
                    });

                    WPService.getSinglePostInCategory("About Us", "Responsible Gaming").success(function (res) {
                        $scope.responsibleGaming = res[0];
                        $scope.numberContent++;
                    });

                    /*PLEASE Be carefull if the number of aboutUs page change, the conditional 
                     * should by change 
                     * SEO get games and set window.prerenderReady to true
                     */
                    var clearwatch = $scope.$watch(function () {
                        if ($scope.numberContent === 3) {
                            setTimeout(function () {
                                window.prerenderReady = true;
                            }, 2000);
                            clearwatch();
                        }
                    });
                    //End SEO
                });
