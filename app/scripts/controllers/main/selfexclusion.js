'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainSelfexclusionCtrl
 * @description
 * # MainSelfexclusionCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('SelfExclusionCtrl', function ($scope, $q,  MatrixService, UtilsService, $uibModal, I18N, DataService, WPService, MainMatrixService, $location) {
    
        $scope.data = DataService;
        $scope.i18n = I18N[DataService.language];
        $scope.statusCoolOff = true;
        var culture = UtilsService.getCorrectlanguageCode();
          var promiseSelfExclusion = MatrixService.getCfg($q);
          promiseSelfExclusion.then(
                  function(success) {
                    DataService.reasons = success.kwargs.reasons;
                    DataService.periods = success.kwargs.periods;
                  }, function(error) {
          }
          );
          
          $scope.unable = false;
          var validForm = false;
          
          var clearWatchR = $scope.$watch(function() {
              
            $("#text-reason").hide();
            $("#errorText-reason").hide();
            if ($("#form_selfExclusion").load()) {
             
             $("#form_selfExclusion").validate({
                errorClass: "errorMessageFormValidation",
                submitHandler: function(form){
                    validForm = true;
                    $scope.selfExclusionEnable();
                }
            });
            
            $('select#reason').on('change', function() {
                var valor = $(this).val();
                if (valor === 'other') {
                  $scope.selfExclusion.unsatisfiedReason='';  
                  $("#text-reason").show();
                   
                  $("#errorText-reason").show();
                } else {
                  $("#text-reason").hide();
                  $("#errorText-reason").hide();
                }
            });
             
             
              clearWatchR();
            }

          });
          
          $scope.selfExclusion = {
            reason: '',
            periods: '',
            unsatisfiedReason: '',
          };
          $scope.selfExclusionEnable = function() {
            
            if(validForm){
            
                $scope.selfExclusion.reason = $("#reason").val();
                $scope.selfExclusion.periods = $('input[name=period]:checked').val();
                var parameters = {
                  "reason": $scope.selfExclusion.reason,
                  "unsatisfiedReason": $scope.selfExclusion.unsatisfiedReason,
                  "period": $scope.selfExclusion.periods,
                  culture: localStorage.getItem("language"),
                  iovationBlackBox: DataService.iovationBlackBox
                };
                $scope.unable = true;
                if( $scope.selfExclusion.reason !=='' && $scope.selfExclusion.periods !== '')
                {
                MainMatrixService.getInstance().enable(parameters, $q).then(
                        function(result) {
                             DataService.contentModalMessage = {
                            title: $scope.i18n['success'],
                            className: 'successMessage',
                            message: "Your Acount was  self-exclusion is enabled"
                        };
                        
                        $scope.unable = false;
                        
                        $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                        
                        $scope.statusCoolOff =  false;    
                        window.location = cyberPlayLocalized.urlhome + '/'+DataService.language+"/casino";  
                                                   
                        }
                , function(error) {
                    
                    $scope.statusCoolOff =  false;  
                    DataService.contentModalMessage = {
                            title: $scope.i18n['error'],
                            className: 'errorMessage',
                            message: "menssage error: " +error.kwargs.desc
                        };
                        
                        $scope.unable = false;
                        
                        $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");

                });
                
                if($scope.statusCoolOff){
                   window.location = cyberPlayLocalized.urlhome + '/'+DataService.language+"/casino";
                }
                              
               } 
              
           }
           
          };

  });
