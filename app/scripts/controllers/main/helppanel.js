'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainHelppanelctrlCtrl
 * @description
 * # MainHelppanelctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('HelpPanelCtrl', 
    function ($scope, $q, $location, UtilsService, MatrixService, MainMatrixService, DataService, $uibModal, I18N) {
                $scope.data = DataService;
                $scope.i18n = I18N[DataService.language];
                $scope.signUpNow="";
                if( $scope.i18n['sign-up-now']!== undefined){
                  $scope.signUpNow = $scope.i18n['sign-up-now'];
                }else if($scope.i18n['sign-up-now']!== undefined){
                  $scope.signUpNow = $scope.i18n['sign-up-now']; 
                }
            
                $scope.helpI18n = "";
                if( $scope.i18n['help']!== undefined){
                  $scope.helpI18n = $scope.i18n['help'];
                }
                
                
            $scope.showListHelp = function () {
                $('#panelSlide').toggle('slide', {direction: "down"}, 'slow');
                $('#buttonSlide').hide('slide', {direction: "down"}, 'slow');
            };

            $scope.hidePanelHelp = function () {
                $('#panelSlide').toggle('slide', {direction: "down"}, 'slow');
                $('#buttonSlide').show('slide', {direction: "down"}, 'slow');
            };

            $scope.showDeposit = function () {
                $scope.data.modalDialogs.modalDepositPaymentDialog = 
                    UtilsService.showModalMessageAuto($uibModal, "deposit modal", 
                    "payments/depositPaymentsModal.html", 'DepositPaymentsModalCtrl', 'large-modal');
                
            };
        
            $scope.urlHelpPage = '/'+DataService.language.toLowerCase()+ "/help";
            $scope.urlSecurity = '/'+DataService.language.toLowerCase()+ "/security-page";
            $scope.urlRules = '/'+DataService.language.toLowerCase()+ "/rules";
            
            $scope.showPhone = function () {
                window.location = cyberPlayLocalized.urlhome +'/'+DataService.language.toLowerCase()+ "/contactus";
            };
            $scope.displayWithdraw = function(){
               /*$.blockUI({
                    message: $('#messageLoadingLogin'), 
                    css: {
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .7, 
                        color: '#fff',
                        'font-size': '40px',
                        'font-weight': 'bold',
                        left: '25%',
                        width: '45%'
                    }
                });*/

              $scope.data.modalDialogs.modalConfirmationPayment =
                        UtilsService.showModalMessageAuto($uibModal, '', "payments/withdrawPayment.html", 'WithdrawPaymentCtrl');
        };
  });
