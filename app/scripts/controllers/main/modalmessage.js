'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainModalmessagectrlCtrl
 * @description
 * # MainModalmessagectrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('ModalMessageCtrl',
        function ($scope, $q, UtilsService, DataService, I18N, $uibModal, $uibModalInstance, $location) {

            $scope.i18n = I18N[DataService.language];
            $scope.data = DataService;

            $scope.closeModalMessage = function () {
                if ($scope.data.modalDialogs.messageModal) {
                    switch ($scope.data.errorTransfer) {
                        case "error":
                            $scope.data.modalDialogs.messageModal.close();
                            $uibModalInstance.dismiss('cansel');
                            $scope.data.errorTransfer = "";
                            break;
                        case "erroreco":
                            displayModalDeposit("payments/depositPayment.html", 'DepositPaymentCtrl', '0');
                            $uibModalInstance.dismiss('cansel');
                            $scope.data.modalDialogs.messageModal.close();
                            $scope.data.errorTransfer = "";
                            break;
                        case "erroneller":
                            displayModalDeposit("payments/depositNeteller.html", 'DepositNetellerCtrl', '0');
                            $uibModalInstance.dismiss('cansel');
                            $scope.data.modalDialogs.messageModal.close();
                            $scope.data.errorTransfer = "";
                            break;
                        case "errorskillenvoy":
                            displayModalDeposit("payments/depositPaymentWithoutAmount.html", 'DepositPaymentWithoutAmountCtrl', '0');
                            $uibModalInstance.dismiss('cansel');
                            $scope.data.modalDialogs.messageModal.close();
                            $scope.data.errorTransfer = "";
                            break;
                        case "errorFundsend":
                            displayModalDeposit("payments/depositPayment.html", 'DepositPaymentCtrl', '0');
                            $uibModalInstance.dismiss('cansel');
                            $scope.data.modalDialogs.messageModal.close();
                            $scope.data.errorTransfer = "";
                            break;
                        default:
                            $scope.data.modalDialogs.messageModal.close();
                            $scope.data.modalDeposit = "";
                            $uibModalInstance.dismiss('cansel');
                            $scope.data.modalDialogs.messageModal.close();

                            $scope.data.modalDialogs.messageModal.close();
                            $scope.data.errorTransfer = "";
                            $scope.data.cscNumberSelectedT = "";
                            $scope.data.cscNumberSelected = "";
                            $scope.data.bonusCodeT = "";
                            $scope.data.amountTo = "0";
                            $scope.data.modalDeposit = "";
                            break;
                    };
                } else {
                    UtilsService.modalDialog.close();
                }
                if(DataService.openMessagegame){
                    DataService.openMessagegame = false;
                    $location.path(localStorage.getItem("language").toLowerCase());
                    $scope.data.modalDialogs.messageModal.close();
                }
                
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    if($scope.data.sportsMethod.transactionFailed  && $scope.data.sportsMethod.deposit){
                        $scope.data.sportsMethod.transactionFailed = false;
                        $scope.data.sportsMethod.deposit = false;
                        localStorage.removeItem("method");
                        localStorage.removeItem("mobileDeposit");
                        window.location = $scope.data.sportsMethod.urlMobileWindow;
                    }
                }
            };

            var displayModalDeposit = function (htmlFile, controllerName) {
                UtilsService.showModalMessage($uibModal, "deposit modal", htmlFile, controllerName);
            };
        });





            