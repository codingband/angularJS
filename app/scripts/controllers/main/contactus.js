'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainContactusctrlCtrl
 * @description
 * # MainContactusctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('ContactUsCtrl', 
    function ($scope, $uibModal, UtilsService, DataService, MatrixService, I18N, $rootScope) {
            $scope.connection = MatrixService.getInstance();
            $scope.i18n = I18N[DataService.language]; 
            
            $scope.data = DataService;
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }
            
            $rootScope.$broadcast('change-language', {
                data: localStorage.getItem('language')
            });
            
            $scope.contactUs = {
                to: '',
                name: '',
                subject: '',
                message:'',
                email:''
            };
            var objectContactUs = {};
            
            $scope.unableButtonContactUs = false;
            var validFormContactUs = false;
            var clearWatchR = $scope.$watch(function () {
                if ($(".contactUs-body").load()) {
                    if($scope.data.isLogged){
                        if($("#form-contactusLogged").is(":visible")){
                            $("#form-contactusLogged").validate({
                                errorClass: "errorMessageFormValidation",
                                submitHandler: function(){
                                    validFormContactUs = true;
                                    $scope.sendMessage();
                                }
                            });
                            clearWatchR();
                        }
                    }else{
                        if($("#form-contactusNoLogged").is(":visible")){
                            $("#form-contactusNoLogged").validate({
                                errorClass: "errorMessageFormValidation",
                                submitHandler: function(){
                                    validFormContactUs = true;
                                    $scope.sendMessage();
                                }
                            });
                            clearWatchR();
                        }
                    }
                }
            });

            var errorMessage = function(){
                $scope.unableButtonContactUs = false;
                DataService.contentModalMessage = {
                    title: $scope.i18n['error'],
                    className: 'errorMessage',
                    message: "Your message wasn't send, Try again please"
                };

                $scope.data.modalDialogs.messageModal = 
                        UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
            };

            $scope.sendMessage = function () {
                if(validFormContactUs){
                    $scope.unableButtonContactUs = true;
                    validFormContactUs = false;
                    
                    if($scope.data.isLogged){
                        objectContactUs = {
                            language: $scope.data.language,
                            subject: $scope.contactUs.subject,
                            message: $scope.contactUs.message,
                            name: $scope.data.infUser.firstname + ' ' + $scope.data.infUser.surname,
                            email: $scope.data.infUser.email
                        };
                    }
                    else{
                        objectContactUs = {
                            language: $scope.data.language,
                            subject: $scope.contactUs.subject,
                            message: $scope.contactUs.message,
                            name: $scope.contactUs.name,
                            email: $scope.contactUs.email
                        };
                    }
                    var parameter = objectContactUs;
                    
                    jQuery.ajax({
                        type: "POST",
                        url: 'wp-admin/admin-ajax.php',
                        data:{
                             'action':'send_mail_by_language',
                             'fn':'get_latest_posts',
                             'parameter': parameter
                             },
                        dataType: 'JSON',
                        success:function(data){       
                            
                            if(data){
                                $scope.contactUs.subject = '';
                                $scope.contactUs.message = '';
                                $scope.contactUs.name = '';
                                $scope.contactUs.email = '';

                                DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your message was sent successfully.'
                                };
                                $scope.data.modalDialogs.messageModal = 
                                        UtilsService.showModalMessageAuto($uibModal, "",  "main/modalMessage.html", "ModalMessageCtrl", "");
                                $scope.unableButtonContactUs = false;
                            }else{
                                errorMessage();
                            }
                        },
                        error: function(errorThrown){
                            errorMessage();
                            $scope.unableButtonContactUs = false;
                            validFormContactUs = true;
                            console.log(errorThrown);
                        }
                    });
                }
            };      
    });
