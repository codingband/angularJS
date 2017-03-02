'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainAddbonusctrlCtrl
 * @description
 * # MainAddbonusctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('AddBonusCtrl', 
    function ($scope, $q, I18N, DataService, MainMatrixService, $uibModal, UtilsService) {
            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
         
            $scope.unable = false;
            var validForm = false;
             var clearWatchR = $scope.$watch(function(scope) { 
          
                 $("#form_bonusPage").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function(form){
                            
                            validForm = true;
                            $scope.saveBonusCode();
                        }
                    });
                    clearWatchR();
                });
 
            
            $scope.saveBonusCode = function () {
                var culture = UtilsService.getCorrectlanguageCode();
              if(validForm){ 
               var paramenter = {
                   bonusCode: $scope.bonusCode,
                   culture: localStorage.getItem("language"),
                   iovationBlackBox: DataService.iovationBlackBox
               };
                //console.log(paramenter);
                MainMatrixService.getInstance().applyBonus(paramenter, $q).then(
                        function (success) {
                            
                            DataService.contentModalMessage = {
                                title: $scope.i18n['success'],
                                className: 'successMessage',
                                message: 'The bonus code was added successfully to your account.'
                            };
                            $scope.data.modalDialogs.messageModal = 
                                    UtilsService.showModalMessageAuto($uibModal, "",  "main/modalMessage.html", "ModalMessageCtrl", "");
                        },
                        function (error) {
                           DataService.contentModalMessage = {
                            title: $scope.i18n['error'],
                            className: 'errorMessage',
                            message: "Error: "+error.kwargs.desc+", Try again please"
                        };
                        $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                        
                        }
                );
                }
            };
  });
