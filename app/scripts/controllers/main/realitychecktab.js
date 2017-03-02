'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainRealitycheckCtrl
 * @description
 * # MainRealitycheckCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('RealityCheckTabCtrl',
                function ($scope, $q, MatrixService, UtilsService, $location, $uibModal, I18N, DataService, WPService, MainMatrixService) {
                    $scope.data = DataService;
                    $scope.i18n = I18N[DataService.language];
                    $scope.tabName = 'realityCheck';

                    var culture = UtilsService.getCorrectlanguageCode();

                    var RealityCheck = MatrixService.getRealityCheckCfg($q);
                    RealityCheck.then(
                            function (success) {
                                $scope.realityCheckInterval = success.kwargs;
                            },
                            function (error) {
                                console.log(error);
                            }
                    );
                    var getCurrentRealityCheck = MatrixService.getRealityCheck($q);
                    getCurrentRealityCheck.then(
                            function (success) {
                                $scope.currentRealityCheck = success.kwargs;
                            },
                            function (error) {
                                console.log(error);
                            }
                    );


                    // $scope.form_relitycheck_tab = false;
                    var validForm = false;
                    var clearWatchR = $scope.$watch(function () {
                        if ($("#form_relitycheck_tab").load()) {

                            $("#form_relitycheck_tab").validate({
                                errorClass: "errorMessageFormValidation",
                                submitHandler: function (form) {

                                    validForm = true;
                                    $scope.setRealityCheck();

                                }
                            });
                            clearWatchR();
                        }
                    });

                    $scope.setRealityCheck = function () {
                        if (validForm) {
                            validForm = false;
                            var parameters = {
                                "value": $scope.reality,
                                culture: localStorage.getItem("language"),
                                iovationBlackBox: DataService.iovationBlackBox
                            };
                            MainMatrixService.getInstance().setRealityCheck(parameters, $q).then(
                                    function (result) {
                                        UtilsService.modalDialog.close();

                                        DataService.contentModalMessage = {
                                            title: $scope.i18n['success'],
                                            className: 'successMessage',
                                            message: 'Your Reality Check interval has been set.'
                                        };
                                        UtilsService.showModalMessage($uibModal, "", "main/modalMessage.html", "ModalMessageCtrl", "");
                                        $scope.data.modalDialogs.modalConfirmationPayment.close();

                                    }
                            , function (error) {

                                DataService.contentModalMessage = {
                                    title: $scope.i18n['error'],
                                    className: 'errorMessage',
                                    message: "" + error.desc + ", Try again please"
                                };
                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                            }
                            );
                        }
                    }
                });
