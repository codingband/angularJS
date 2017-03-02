'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainLimitsctrlCtrl
 * @description
 * # MainLimitsctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('LimitsCtrl', 
    function ($scope, $q,  MatrixService, UtilsService, $uibModal, I18N, DataService, WPService, MainMatrixService) {
            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            
            $scope.periodList = ["daily", "weekly","monthly"];
            var culture = UtilsService.getCorrectlanguageCode();
              $('.contentSpinnerRegister').hide();
           $scope.getLimits = function (parameters) {
              var promiseLimits = MatrixService.getLimits($q);
              promiseLimits.then(
                      function(success) {
                        $scope.limits = success.kwargs;
                        
                        if($scope.limits.deposit.current !== null){
                          var date = new Date($scope.limits.deposit.current.expiryDate);
                          $scope.limits.deposit.current.expiryDate =  $scope.formatDate(date); 
                        }
                        
                        if($scope.limits.wagering.current !== null){
                          date = new Date($scope.limits.wagering.current.expiryDate);
                          $scope.limits.wagering.current.expiryDate =  $scope.formatDate(date); 
                        }
                        
                        if($scope.limits.loss.current !== null){
                          date = new Date($scope.limits.loss.current.expiryDate);
                          $scope.limits.loss.current.expiryDate =  $scope.formatDate(date); 
                        }

                      },
                      function(error) {
                      }
              );
              var promiseProfileLoggedUser = MainMatrixService.getInstance().getProfile($q);
              promiseProfileLoggedUser.then(
                      function(success) {
                        $scope.user = success.kwargs.fields;
                        angular.forEach($scope.countriesList, function(country) {
                          if (country.code == $scope.user.country) {
                            $scope.user.country = country;
                          }
                        });

                      }, function(error) {
                console.log("-error", error);
              }
              );
      }
          $scope.unable = false;
          var validForm_deposit = false;
          var validForm_wagering = false;
          var validForm_loss= false;
          var clearWatchR = $scope.$watch(function(scope) {
                if ($("#form_deposit").load()) {
                   
                  $("#form_deposit").validate({
                    errorClass: "errorMessageFormValidation",
                        submitHandler: function(form){
                            validForm_deposit = true;
                            $scope.setDepositLimit();
                        }
                  });
                  clearWatchR();
                }
                if ($("#form_wagering").load()) {
                  $("#form_wagering").validate({
                    errorClass: "errorMessageFormValidation",
                    submitHandler: function(form){
                            validForm_wagering = true;
                            $scope.setWageringLimit();
                        }
                  });
                  clearWatchR();
                }
                if ($("#form_loss").load()) {
                  $("#form_loss").validate({
                    errorClass: "errorMessageFormValidation",
                    submitHandler: function(form){
                            validForm_loss = true;
                            $scope.setLossLimit();
                        }
                  });
                  clearWatchR();
                }
              });
              
              $scope.depositLimits = {
                period:'',
                currency: '',
                amount: '',
              };

              $scope.setDepositLimit = function() {
                 
                if(validForm_deposit){
                    $scope.depositLimits.currency = $("#currenycd").val();
                    if ($scope.depositLimits.currency !== '' && $scope.depositLimits.amount !== ''&& $scope.depositLimits.period !== '') {
                      var parameters = {
                        "period": $scope.depositLimits.period,
                        "amount": $scope.depositLimits.amount,
                        "currency": $scope.depositLimits.currency,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                      };
                      $scope.hideDiv();
                      MainMatrixService.getInstance().setDepositLimit(parameters, $q).then(
                              function(result) {
                                $scope.showDiv();
                                 $scope.getLimits();
                                   DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Deposit Limit has been set.'
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                              }
                      , function(error) {
                        $scope.showDiv();
                         DataService.contentModalMessage = {
                                         title: $scope.i18n['error'],
                                         className: 'errorMessage',
                                         message: ""+error.kwargs.desc+""
                                     };
                                     $scope.data.modalDialogs.messageModal = 
                                     UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");

                      }
                      );
                    }// UtilsService.modalDialog.close();
                }
              };

              $scope.removeDepositLimit = function() {
                $scope.hideDiv();
                MainMatrixService.getInstance().removeDepositLimit($q).then(
                        function(result) {
                           $scope.showDiv();
                                 $scope.getLimits();
                                   DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Deposit Limit has been removed.'
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                        }
                , function(error) {

                }
                );
              }

              $scope.wageringLimit = {
                period:'',
                currency: '',
                amount: ''
              };
              $scope.setWageringLimit = function() {
                
                  if(validForm_wagering){  
                    $scope.wageringLimit.currency = $("#currenycw").val();
                    if ($scope.wageringLimit.currency !== '' && $scope.wageringLimit.amount !== '' && $scope.wageringLimit.period !== '') {
                      var parameters = {
                        "period": $scope.wageringLimit.period,
                        "amount": $scope.wageringLimit.amount,
                        "currency": $scope.wageringLimit.currency,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                      };
                      $scope.hideDiv();
                      MainMatrixService.getInstance().setWageringLimit(parameters, $q).then(
                              function(result) {
                                $scope.showDiv();
                                 $scope.getLimits();
                                   DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Wagering Limit has been set.'
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                              }
                      , function(error) {
                        $scope.showDiv();
                         DataService.contentModalMessage = {
                                         title: $scope.i18n['error'],
                                         className: 'errorMessage',
                                         message: ""+error.kwargs.desc+""
                                     };
                                     $scope.data.modalDialogs.messageModal = 
                                     UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");

                      }
                      );
                    }
                }
              };
              $scope.removeWageringLimit = function() {
                $scope.hideDiv();
                MainMatrixService.getInstance().removeWageringLimit($q).then(
                        function(result) {
                           $scope.showDiv();
                           $scope.getLimits();
                                   DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Wagering Limit has been removed.'
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                        }
                , function(error) {

                }
                );
              }

              $scope.lossLimit = {
                period:'',
                currency: '',
                amount: ''
              };
              $scope.setLossLimit = function() {
                   
                  if(validForm_loss){
                    $scope.lossLimit.currency = $("#currencyl").val();
                    if ($scope.lossLimit.currency !== '' && $scope.lossLimit.amount !== '' && $scope.lossLimit.period !== '') {

                      var parameters = {
                        "period": $scope.lossLimit.period,
                        "amount": $scope.lossLimit.amount,
                        "currency": $scope.lossLimit.currency,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                      };
                      $scope.hideDiv();
                      MainMatrixService.getInstance().setLossLimit(parameters, $q).then(
                              function(result) {
                                $scope.showDiv();
                                 $scope.getLimits();
                                DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Loos Limit has been set.'
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                              }
                      , function(error) {
                        $scope.showDiv();
                         DataService.contentModalMessage = {
                                         title: $scope.i18n['error'],
                                         className: 'errorMessage',
                                         message: ""+error.kwargs.desc+""
                                     };
                                     $scope.data.modalDialogs.messageModal = 
                                     UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");

                      }
                      );
                    }
                }
              };
              $scope.removeLossLimit = function() {
                
                MainMatrixService.getInstance().removeLossLimit($q).then(
                        function(result) {
                         $scope.showDiv();
                         $scope.getLimits();
                         DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Loos Limit has been removed.'
                                };

                                $scope.data.modalDialogs.messageModal =
                                       UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                        }
                , function(error) {

                }
                );
              }
              $scope.hideDiv = function() {
                $('#register_limit').hide();

               // $('.bodycontainer_limits').css({"background-color": "#ccc"});

                $('.contentSpinnerRegister').show();
              };
              $scope.showDiv = function() {
                $('#register_limit').show();

                //$('.bodycontainer_limits').css({"background-color": "#ccc"});

                $('.contentSpinnerRegister').hide();
              };
              
              
              $scope.formatDate = function(date){  
                var datestring = date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
                                          ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
                        
                 return datestring; 
                 
              };
              
  });
