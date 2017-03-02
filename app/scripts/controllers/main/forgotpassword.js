'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainForgotpasswordctrlCtrl
 * @description
 * # MainForgotpasswordctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('ForgotPasswordCtrl', 
    function ($scope, MatrixService, $q, UtilsService, I18N, DataService, $uibModal) {
            $scope.i18n = I18N[DataService.language];
            $scope.resetUrl = cyberPlayLocalized.urlhome + DataService.language.toLowerCase() +"/casino" + "/reset-password/"; 
            var publicKey = "6LcJ7e4SAAAAAOaigpBV8fDtQlWIDrRPNFHjQRqn";
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }
            
            $scope.loadCaptcha = function () {
                Recaptcha.create(publicKey, "captchaId", {theme: "clean"});
            };
            $scope.closeModalDialog = function () {
                UtilsService.modalDialog.close();
            };
            $scope.resetPassword = function () {
                var id = $("#captchaId");
                var parameters = {
                    email: $scope.dataEmail,
                    changePwdURL: $scope.resetUrl,
                    captchaPublicKey: publicKey,
                    captchaChallenge: Recaptcha.get_challenge(),
                    captchaResponse: Recaptcha.get_response(),
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };                
                   
                var promiseForgot = MatrixService.forgotPassword(parameters, $q);
                promiseForgot.then(
                    function(success) {
                        UtilsService.modalDialog.close();
                        DataService.contentModalMessage = {
                            title: 'Send Email',
                            className: 'errorMessage',
                            message: 'Please review your email to reset your password'
                        };
                        
                        $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                        //$location.path('/');
                        
                    }, function(error) {
                        DataService.contentModalMessage = {
                            title: $scope.i18n['error'],
                            className: 'errorMessage',
                            message: "Reset password failed, "+error.kwargs.desc
                        };
                        
                        $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                        Recaptcha.reload();
                    }
                );
            };       
  });
