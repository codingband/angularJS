'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainSetlimitCtrl
 * @description
 * # MainSetlimitCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('SetLimitCtrl', function ($scope, $q,  MatrixService, UtilsService, $uibModal, I18N, DataService, WPService, MainMatrixService) {
        $scope.data = DataService;
        $scope.i18n = I18N[DataService.language];
        $scope.setlimit = {
          select:''
        };
        
        $scope.unable = false;
        var validForm = false;
        var clearWatchR = $scope.$watch(function () {
            if ($("#form_setLimitConfigure").load()) {
           
                $("#form_setLimitConfigure").validate({
                    errorClass: "errorMessageFormValidation",
                    submitHandler: function(form){
                        validForm = true;
                        $scope.setLimitConfigure();
                    }
                });
                clearWatchR();
            }
        });
        
        
        
        $scope.setLimitConfigure = function() {
            if(validForm){
                $scope.setlimit.select=$('input[name=select]:checked').val();
                if($scope.setlimit.select === '0'){
                  DataService.modalLimit = true;

                  UtilsService.modalDialog.close();
                  UtilsService.showModalMessage($uibModal, 'Details', 
                              'main/myAccountDetails.html', 'AccountDetailsCtrl', 'large-modal');
                }else{
                   if($scope.setlimit.select === '1'){
                  UtilsService.modalDialog.close();
                }
                }
          }
        };
        $scope.closeModalDialog = function () {
            UtilsService.modalDialog.close();
        };
  });
