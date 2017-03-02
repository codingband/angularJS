'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:ResetPasswordCtrl
 * @description
 * # ResetPasswordCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('ResetPasswordCtrl', function ($scope, $q, MatrixService, UtilsService, DataService, $location, $uibModal, I18N) {

            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            var culture = UtilsService.getCorrectlanguageCode();
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }
            
            $scope.changePassword = function () {
                var parameters = {
                    key: $scope.data.passKey,
                    password: $scope.password,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };

                var promiseResetPassword = MatrixService.resetPassword(parameters, $q);
                promiseResetPassword.then(
                        function (success) {
                            UtilsService.modalDialog.close();
                            DataService.contentModalMessage = {
                                title: $scope.i18n['success'],
                                className: 'successMessage',
                                message: 'Your password was changed succefully'
                            };

                            $scope.data.modalDialogs.messageModal =
                                    UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                        }, function (error) {
                    DataService.contentModalMessage = {
                        title: $scope.i18n['error'],
                        className: 'errorMessage',
                        message: "Reset password failed, " + error.kwargs.desc
                    };

                    $scope.data.modalDialogs.messageModal =
                            UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                }
                );
            };
        });
