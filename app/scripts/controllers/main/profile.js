'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('ProfileCtrl', function ($scope, $q, $uibModal, UtilsService, I18N, DataService, WPService, MainMatrixService) {

            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }

            $scope.days = [];
            $scope.months = [];
            $scope.years = [];
            $scope.answer = '';
            $scope.general = true;
            $scope.password = false;
            $scope.email = false;
            $scope.question = false;
            $scope.selectTab = 'general';
            $scope.phonePrefixes = [];
            $scope.countriesList = [];
            $scope.currenciesList = [];

            $scope.unableButtonUpdateProfile = false;
            $scope.unableButtonupdateUPW = false;
            $scope.validFormupdateSQ = false;
            $scope.validFormupdateEmail = false;

            $scope.questionsList = ["My favourite colour?", "My pet's name?", "My favourite bet",
                "My favourite horse?", "My favourite place?", "My favourite superhero?",
                "My favourite team?", "My middle name?", "My mother's maiden name?"];

            $scope.selectGeneral = function () {
                $scope.selectTab = 'general';
                $scope.general = true;
                $scope.password = false;
                $scope.email = false;
                $scope.question = false;
            };

            $scope.selectPassword = function () {
                $scope.selectTab = 'changePassword';
                $scope.general = false;
                $scope.password = true;
                $scope.email = false;
                $scope.question = false;
            };

            $scope.selectEmail = function () {
                $scope.selectTab = 'changeEmail';
                $scope.general = false;
                $scope.password = false;
                $scope.email = true;
                $scope.question = false;
            };

            $scope.selectQuestion = function () {
                $scope.selectTab = 'changeQuestion';
                $scope.general = false;
                $scope.password = false;
                $scope.email = false;
                $scope.question = true;
                $scope.answer = '';
                $scope.user.passwordSQ = '';
            };

            $scope.getDataDropDown = function () {
                UtilsService.getDaysMonthsYears();
                $scope.days = UtilsService.days;
                $scope.months = UtilsService.months;
                $scope.years = UtilsService.years;
                $scope.currenciesList = WPService.currenciesList;
                $scope.countriesList = WPService.countriesList;
                $scope.phonePrefixes = WPService.phonePrefixes;
            };
            
            var culture = UtilsService.getCorrectlanguageCode();

            $scope.getProfileData = function () {
                var promiseProfileLoggedUser = MainMatrixService.getInstance().getProfile($q);
                promiseProfileLoggedUser.then(
                        function (success) {
                            $scope.user = success.kwargs.fields;
                            $scope.user.mobile = Number($scope.user.mobile);

                            angular.forEach($scope.countriesList, function (country) {
                                if (country.code == $scope.user.country) {
                                    $scope.user.country = country;
                                }
                            });

                        }, function (error) {
                    console.log("-error", error);
                }
                );
            };

            var validFormUpdateProfile = false;
            var validFormupdateUsrPW = false;
            var validFormupdateSQ = false;
            var validFormupdateEmail = false;

            var clearWatchR = $scope.$watch(function (scope) {
                if ($("#profile-content").load()) {
                    UtilsService.allowOnlyNumbers('.filedNumber');

                    $("#form_Update").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function () {
                            validFormUpdateProfile = true;
                            $scope.updateUser();
                        }
                    });

                    $("#form_editPass").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function () {
                            validFormupdateUsrPW = true;
                            $scope.updateUserPass();
                        }
                    });

                    $("#form_question").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function () {
                            validFormupdateSQ = true;
                            $scope.updateSecurityQuestion();
                        }
                    });

                    $("#form_emailChange").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function () {
                            validFormupdateEmail = true;
                            $scope.updateSecurityQuestion();
                        }
                    });

                    clearWatchR();
                }

            });

            $scope.updateUser = function () {
                if (validFormUpdateProfile) {
                    $scope.unableButtonUpdateProfile = true;
                    var parameters = $scope.getParameters();
                    var promiseUpdateProfile = MainMatrixService.getInstance().updateProfile(parameters, $q);
                    promiseUpdateProfile.then(
                            function (success) {
                                $scope.unableButtonUpdateProfile = false;
                                DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: "Your Profile was edited successful."
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                                UtilsService.modalDialog.close();
                            }, function (error) {
                        $scope.unableButtonUpdateProfile = false;
                        DataService.contentModalMessage = {
                            title: $scope.i18n['error'],
                            className: 'errorMessage',
                            message: "Your Profile was not edited, try again please."
                        };

                        $scope.data.modalDialogs.messageModal =
                                UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                    }
                    );
                }
            };

            $scope.hideDiv = function () {
                $('#password-subcontainer').hide();
                $('.bodycontainer_register').css({"background-color": "#ccc"});
                $('.contentSpinnerRegister').show();
            };

            $scope.showDiv = function () {
                $('#password-subcontainer').show();
                $('.bodycontainer_register').css({"background-color": "#88b2bf"});
                $('.contentSpinnerRegister').hide();
            };

            $scope.updateUserPass = function () {
                if (validFormupdateUsrPW) {
                    $scope.unableButtonupdateUPW = true;
                    var parameters = {
                        oldPassword: $scope.user.oldPassword,
                        newPassword: $scope.user.newPassword1,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                    var promiseChangePassword = MainMatrixService.getInstance().changePassword(parameters, $q);

                    promiseChangePassword.then(
                            function (success) {
                                UtilsService.modalDialog.close();
                                DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your password was changed successfully'
                                };

                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                            }, function (error) {
                        $scope.unableButtonupdateUPW = false;
                        DataService.contentModalMessage = {
                            title: $scope.i18n['error'],
                            className: 'errorMessage',
                            message: "Error: " + error.kwargs.desc + ", Try again please"
                        };
                        $scope.data.modalDialogs.messageModal =
                                UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                    }
                    );
                }
            };

            $scope.updateSecurityQuestion = function () {
                if (validFormupdateSQ) {
                    $scope.validFormupdateSQ = true;
                    var title = ($scope.user.gender === "M") ? "Mr." : "Mrs.";
                    var parameters = {
                        email: $scope.user.email,
                        country: $scope.user.country.code,
                        region: 1167,
                        personalID: "",
                        mobilePrefix: $scope.user.mobilePrefix,
                        mobile: $scope.user.mobile.toString(),
                        phonePrefix: $scope.user.phonePrefix,
                        phone: $scope.user.phone,
                        currency: $scope.user.currency,
                        title: title,
                        firstname: $scope.user.firstname,
                        surname: $scope.user.surname,
                        birthDate: $scope.user.birthDate,
                        city: $scope.user.city,
                        address1: $scope.user.address1,
                        address2: $scope.user.address2,
                        postalCode: $scope.user.postalCode,
                        language: "en",
                        securityQuestion: $scope.user.securityQuestion,
                        securityAnswer: $scope.answer,
                        acceptNewsEmail: $scope.user.acceptNewsEmail,
                        acceptSMSOffer: $scope.user.acceptSMSOffer,
                        gender: $scope.user.gender,
                        username: $scope.user.username,
                        affiliateMarker: "",
                        culture: localStorage.getItem("language"),
                        emailVerificationURL: "http://cyberplay.lioncreeksoftware.com/aboutus.html?key=",
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                    var promiseUpdateProfile = MainMatrixService.getInstance().updateProfile(parameters, $q);
                    promiseUpdateProfile.then(
                            function (success) {
                                UtilsService.modalDialog.close();
                                DataService.contentModalMessage = {
                                    title: $scope.i18n['success'],
                                    className: 'successMessage',
                                    message: 'Your Security Question was changed successfully'
                                };
                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                            }, function (error) {
                        $scope.validFormupdateSQ = false;
                        DataService.contentModalMessage = {
                            title: $scope.i18n['error'],
                            className: 'errorMessage',
                            message: error.kwargs.desc + ", Try again please"
                        };
                        $scope.data.modalDialogs.messageModal =
                                UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                        console.log(error);
                    }
                    );
                }
            };

            $scope.getParameters = function () {
                var title = ($scope.user.gender == "M") ? "Mr." : "Mrs.";
                var parameters = {
                    "email": $scope.user.email,
                    "country": $scope.user.country.code,
                    "region": 1167,
                    "personalID": "",
                    "mobilePrefix": $scope.user.mobilePrefix,
                    "mobile": $scope.user.mobile.toString(),
                    "phonePrefix": $scope.user.phonePrefix,
                    "phone": $scope.user.phone,
                    "currency": $scope.user.currency,
                    "title": title,
                    "firstname": $scope.user.firstname,
                    "surname": $scope.user.surname,
                    "birthDate": $scope.user.birthDate,
                    "city": $scope.user.city,
                    "address1": $scope.user.address1,
                    "address2": $scope.user.address2,
                    "postalCode": $scope.user.postalCode,
                    "language": "en",
                    "securityQuestion": $scope.user.securityQuestion,
                    "securityAnswer": $scope.user.securityAnswer,
                    "acceptNewsEmail": $scope.user.acceptNewsEmail,
                    "acceptSMSOffer": $scope.user.acceptSMSOffer,
                    "gender": $scope.user.gender,
                    "username": $scope.user.username,
                    "affiliateMarker": "",
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };

                return parameters;
            };

            var publicKey = "6LcJ7e4SAAAAAOaigpBV8fDtQlWIDrRPNFHjQRqn";

            $scope.loadCaptcha = function () {
                Recaptcha.create(publicKey, "captchaId", {theme: "clean"});
            };
            $scope.sendVerificationEmailToNewMailbox = function () {
                if (validFormupdateEmail) {
                    //var absUrl = "https://help.gammatrix-dev.net/samples_v2/sample-changeemail-complete.html?WEBSOCKET_API_URL=wss%3A%2F%2Fwebapi.gm.stage.everymatrix.com%2Fv2&DOMAIN_PREFIX=http%3A%2F%2Fwww.cyberplay.com&FALLBACK_API_URL=https%3A%2F%2Ffb-webapi.gm.stage.everymatrix.com&email=$ORGINAL_EMAIL$&key=";
                    //absUrl = "http://localhost/LCSSourceCode/BE/confirmationEmail/index.html?WEBSOCKET_API_URL=wss%3A%2F%2Fwebapi.gm.stage.everymatrix.com%2Fv2&DOMAIN_PREFIX=http%3A%2F%2Fwww.cyberplay.com&FALLBACK_API_URL=https%3A%2F%2Ffb-webapi.gm.stage.everymatrix.com&email=$ORGINAL_EMAIL$&key=";
                    var id = $("#captchaId");
                    var parameters = {
                        email: $scope.user.newemail,
                        password: $scope.user.password,
                        emailVerificationURL: cyberPlayLocalized.urlhome + DataService.language.toLowerCase() + "/casino" + "/verification-newemail/&email=" + $scope.user.email + "&key=",
                        captchaPublicKey: publicKey,
                        captchaChallenge: Recaptcha.get_challenge(),
                        captchaResponse: Recaptcha.get_response(),
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                    var promiseSendNewEmail = MainMatrixService.getInstance().sendNewEmail(parameters, $q);

                    promiseSendNewEmail.then(
                        function (success) {
                            if (success.kwargs.isCaptchaEnabled) {
                                $scope.enabledCaptcha = success.kwargs.isCaptchaEnabled
                            } else {
                                UtilsService.modalDialog.close();
                                 DataService.contentModalMessage = {
                                    title: 'Send Email',
                                    className: 'errorMessage',
                                    message: 'Please review your email '+$scope.user.newemail+ 'to confirm changed email'
                                };
                        
                                $scope.data.modalDialogs.messageModal = 
                                        UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                            }
                        }, function (error) {
                            DataService.contentModalMessage = {
                                title: $scope.i18n['error'],
                                className: 'errorMessage',
                                message: error.kwargs.desc + ", Try again please"
                            };
                            $scope.data.modalDialogs.messageModal =
                                    UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                        Recaptcha.reload();
                        console.log(error);
                    }
                    );
                }
            };

            $scope.getDataDropDown();
            $scope.getProfileData();

        });
