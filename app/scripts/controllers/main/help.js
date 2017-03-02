'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainHelpctrlCtrl
 * @description
 * # MainHelpctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('HelpCtrl',
                function ($scope, $location, WPService, MatrixService, DataService, I18N, $rootScope, UtilsService) {
                    window.prerenderReady = false;
                    $scope.connection = MatrixService.getInstance();
                    $scope.i18n = I18N[DataService.language];
                    
                    if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                        UtilsService.getNewIovationBlackBox(DataService);
                    }

                    $rootScope.$broadcast('change-language', {
                        data: localStorage.getItem('language')
                    });

                    WPService.getSinglePostInCategoryAllTagLanguage("Help", "Help FAQ").success(function (res) {
                        $scope.helpFAQ = res[0];
                    });

                    WPService.getSinglePostInCategoryAllTagLanguage("Help", "Phone Number").success(function (res) {
                        $scope.phoneNumber = res[0];
                    });

                    WPService.getSinglePostInCategoryAllTagLanguage("Help", "Help Questions").success(function (res) {
                        var listQuestions = new Array();

                        for (var i = 0; i < res.length; i++) {
                            var question = {
                                definition: res[i].title,
                                detailhc: res[i]
                            };
                            listQuestions.push(question);
                        }
                        ;
                        $scope.helpSection = listQuestions;
                        setTimeout(function () {
                            window.prerenderReady = true;
                        }, 2000);
                    });
                    WPService.getSinglePostInCategoryAllTagLanguage("Help", "Help QuestionM").success(function (res) {
                        //WPService.getSinglePostInCategory("Help", "Help QuestionM").success(function (res) { 
                        var listQuestionsM = new Array();
                        for (var i = 0; i < res.length; i++) {
                            var questionM = {
                                definition: res[i].title,
                                detailhc: res[i]
                            };
                            listQuestionsM.push(questionM);
                        }
                        ;
                        $scope.helpSectionM = listQuestionsM;
                    });

                    $scope.urlContactUs = "/" + DataService.language.toLowerCase() + "/contactus";

                    $scope.contactUsView = function () {
                        event.preventDefault();
                        $location.path("/" + DataService.language.toLowerCase() + "/contactus");

                    };

                });
