'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainHomeCtrl
 * @description
 * # MainHomeCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('HomeCtrl', function ($scope, $uibModal, $q, $routeParams, MainMatrixService, UtilsService, DataService, I18N) {
    $scope.data = DataService;  
        $scope.i18n = I18N[DataService.language];
        
        var bowerPath = cyberPlayLocalized.urlhome + '/wp-content/themes/cyberplayer-theme-v1.2/bower_components/jQuery.clientSideLogging';
        
//        $.clientSideLogging({
//            error_url: bowerPath + '/log/?type=error',   // The url to which errors logs are sent
//            info_url: bowerPath + '/log/?type=info',     // The url to which info logs are sent
//            log_url: bowerPath + '/log/?type=log',       // The url to which standard logs are sent
//            log_level: 3,                   // The level at which to log. This allows you to keep the calls to the logging in your code and just change this variable to log varying degrees. 1 = only error, 2 = error & log, 3 = error, log & info
//            native_error:false,              // Whether or not to send native js errors as well (using window.onerror).
//            hijack_console:false,            // Hijacks the default console functionality (ie: all your console.error/info/log are belong to us).
//            query_var: 'msg',               // The variable to send the log message through as.
//            client_info: {                  // Configuration for what info about the client's browser is logged.
//                location:true,              //  The url to the page on which the error occurred.
//                screen_size:true,           //  The size of the user's screen (different to the window size because the window might not be maximized)
//                user_agent:true,            //  The user agent string.
//                window_size:true            //  The window size.
//            }
//        });
        $scope.$on('enableConnection', function (event, data) {
            if(data.value){
                verifyKeyLocal();
                verifyNewEmail();
                verifyForgotPassword();
            }
        });
        
        var verifyKeyLocal = function(){
            if($routeParams.key){
                var promiseVerificationEmail = MainMatrixService.getInstance().verifyEmail($routeParams.key, $q);
                promiseVerificationEmail.then(
                    function(success) {
                        UtilsService.showModalMessage($modal, 
                            'Your email was verified successfully', 
                            'main/messageCongratulations.html', 'MessageCongratulationsCtrl');   
                    }
                    , function (error) {
                        console.log('Error verify key ', error);
                    }
                );
            }
        };
        
        var verifyNewEmail = function(){
            if($routeParams.keynewemail){
                var rute = $routeParams.keynewemail;
                var aux1 = rute.split('&key=');
                var aux2 = aux1[0].split('=');
                var email = aux2[1];
                var keynewemail = aux1[1];
                keynewemail = keynewemail.replace('"', '');
                var promiseVerificationNewEmail = MainMatrixService.getInstance().verifyNewEmail(keynewemail, $q, email);
                promiseVerificationNewEmail.then(
                    function(success){
                        UtilsService.showModalMessage($uibModal,
                                'Your email was verified successfully',
                                'main/messageEmailChanged.html', 'MessageNewEmailCtrl');
                    }, function(error){
                        console.log(error);
                    }
                );
            }
        }; 
        
        var verifyForgotPassword = function(){
            if($routeParams.keyPass){                
                var parameters = {
                    key: $routeParams.keyPass, // read the key from url
                    iovationBlackBox: DataService.iovationBlackBox
                };        
                                                                
                var promiseVerifyForgotPassword = MainMatrixService.getInstance().verificationKeyForgotPassword(parameters, $q);
                promiseVerifyForgotPassword.then(
                    function(success){
                        $scope.data.passKey = $routeParams.keyPass;
                        UtilsService.showModalMessage($uibModal,
                                'Your email was verified successfully',
                                'main/resetPassword.html', 'ResetPasswordCtrl');
                    }, function(error){
                        console.log(error);
                    }
                );
            }
        };    
  });
