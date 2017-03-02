'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:RegisterUserCtrl
 * @description
 * # RegisterUserCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('RegisterUserCtrl', function ($base64, $scope, $location, $q, $uibModal, MainMatrixService, 
            UtilsService, DataService, I18N, WPService) {

            $scope.i18n = I18N[DataService.language];
            var culture = UtilsService.getCorrectlanguageCode();
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }
                    
            var affiliateMC = getCookie('btag');
            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ')
                        c = c.substring(1);
                    if (c.indexOf(name) == 0)
                        return c.substring(name.length, c.length);
                }
                return "";
            }

            var cadena = $base64.encode('w00t');
            var affiliateM = localStorage.getItem("btag");
            $scope.days = [];
            $scope.months = [];
            $scope.years = [];
            $scope.data = DataService;
            
            if($scope.data.currentIPCountry === ""){
                $scope.data.currentIPCountry = localStorage.getItem("countryCode");
            }
            
            $scope.user = {
                day: '',
                month: '',
                year: '',
                phonePrefix: '',
                country: '',
                password: '',
                mobile: '',
                currency: '',
                firstname: '',
                lastname: '',
                city: '',
                address: '',
                zip: '',
                question: '',
                answer: '',
                gender: '',
                username: '',
                email: '',
                offlineCode: ''
            };
             
            var str = navigator.appVersion+"";
            var patt = /iPhone|iPad/g;
            var isAppleDevice = patt.test(str);    
            $scope.unable = false;
            var validForm = false;
            var clearWatchR = $scope.$watch(function () {
                if(isAppleDevice){
                    $("#containerImageBanner").addClass("hidden-sm");
                    $("#browserId").addClass("scrolladd");
                    $('body').css('overflow','hidden');
                    $('body').css('position','fixed');
                   
               }else{
                  $("#containerImageBanner").removeClass("hidden-sm"); 
               }
          
                if ($("#form_user").load()) {
                    $scope.data.modalDialogs.modalDialogBox.opened.then(function () {
                        UtilsService.allowOnlyNumbers('#txtNumeric');
                    });
                  $.validator.addMethod("strongPW",
                        function(value) {
                            var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
                
                          if (mediumRegex.test(value)){
                                return true;
                              }else{
                                return false;
                              }
                    });
                    
                    $("#form_user").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function(form){
                            validForm = true;
                            $scope.registerUser();
                        }
                    });
                    clearWatchR();
                }
            });
            
            WPService.getBannersAllLanguages("Register banner").success(function (res) {
                $scope.bannerImage = res[0];
            });

            $scope.getDataDropDown = function () {
                UtilsService.getDaysMonthsYears();
                $scope.days = UtilsService.days;
                $scope.months = UtilsService.months;
                $scope.years = UtilsService.years;
            };

            $scope.displayTemsConditions = function () {
                var modalTerms = "/rules";
                $location.path('/' + DataService.language.toLowerCase() + modalTerms);
                $scope.closeModalDialog();
            };

            $scope.closeModalDialog = function () {
                if(isAppleDevice){
                    $('body').css('overflow','');
                    $('body').css('position','static');
                }
                $scope.data.modalDialogs.modalDialogBox.close();
            };

            $scope.registerUser = function () {
                if(validForm){
                    var affilateValue = '';
                    if ($scope.user.phonePrefix === '')
                    $scope.user.phonePrefix = $("#phonePrefix").val();
                    if ($scope.user.country === '')
                        $scope.user.country = $("#country").val();

                    $scope.user.gender = $('input[name=registerGender]:checked').val();
                    
                    var month = ($scope.user.month < 10) ? '0' + $scope.user.month : $scope.user.month;
                    var day = ($scope.user.day < 10) ? '0' + $scope.user.day : $scope.user.day;
                    var birthDate = $scope.user.year + '-' + month + '-' + day;
                    
                    var offlineCode = '';
                    var offlineCodeUser = $scope.user.offlineCode.trim().toUpperCase();
                    
                    if(offlineCodeUser === ''){
                        if(affiliateM !== null){
                            affilateValue = affiliateM;
                        }
                    }else{
                        if(offlineCodeUser.search('4U') > -1 && offlineCodeUser.search('4U') === 0){
                            affilateValue = offlineCodeUser;
                            offlineCode = offlineCodeUser;
                        }else{
                            if(affiliateM !== null){
                                affilateValue = affiliateM;
                                offlineCode = offlineCodeUser;
                            }else{
                                offlineCode = offlineCodeUser;
                            }
                        }
                    }
                    
                    if( affiliateM === null){
                       affilateValue=DataService.defaultBtag; 
                    }
                    
                    var parameters = {
                        email: $scope.user.email,
                        password: $scope.user.password,
                        country: $scope.user.country,
                        region: 1167, 
                        personalID: "",
                        mobilePrefix: $scope.user.phonePrefix, 
                        mobile: $scope.user.mobile,
                        phonePrefix: "",
                        phone: "",
                        currency: $scope.user.currency,
                        title: "Mr.",
                        firstname: $scope.user.firstname,
                        surname: $scope.user.lastname,
                        birthDate: birthDate,
                        city: $scope.user.city,
                        address1: $scope.user.address,
                        address2: "",
                        postalCode: $scope.user.zip,
                        language: "en",
                        securityQuestion: $scope.user.question,
                        securityAnswer: $scope.user.answer,
                        acceptNewsEmail: true,
                        acceptSMSOffer: true,
                        gender: $scope.user.gender,
                        username: $scope.user.username,
                        affiliateMarker: affilateValue,
                        emailVerificationURL: cyberPlayLocalized.urlhome + DataService.language.toLowerCase() + "/casino" + "/verification-email/",
                        culture: localStorage.getItem("language"),
                        iovationBlackBox:DataService.iovationBlackBox
                    };
                    $scope.unable = true;
                    $scope.hideDiv();
                    var encript = $base64.encode($scope.user.password);
                    
                    MainMatrixService.getInstance().registerUser(parameters, $q).then(
                            function (result) {
                                $scope.unable = false;
                                validForm = false;
                                $scope.showDiv();
                                $scope.data.modalDialogs.modalDialogBox.close();
                                localStorage.setItem("id", encript);
            //******************Start IMPORTANT offlineCode
                                if(offlineCode !== ''){
                                    var userRegisterDate = UtilsService.getCurrentDate()+'T'+UtilsService.getCurrentTime()+'.000Z';
                                    document.cookie="userRegisterDate="+userRegisterDate;
                                    document.cookie = "offlineCode="+offlineCode;
                                }
            //******************End IMPORTANT offlineCode 
                                var pathHTMLModal = 'main/emailVerificationNeeded.html';
                                $scope.data.modalDialogs.emailVerif = UtilsService.showModalMessageAuto($uibModal, '', pathHTMLModal,
                                        'EmailVerificationNeededCtrl', '');
                            }
                        , function (error) {
                            $scope.unable = false;
                            validForm = false;
                            $scope.showDiv();
                            DataService.contentModalMessage = {
                                title: $scope.i18n['error'],
                                className: 'errorMessage',
                                message: "Error: " + error.kwargs.desc + ", Try again please"
                            };
                            $scope.data.modalDialogs.messageModal =
                                    UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                        }); 
                }
            };
            
            $scope.getDataDropDown();

            $scope.hideDiv = function () {
                $('.contentSpinnerRegister').show();
            };

            $scope.showDiv = function () {
                $('.contentSpinnerRegister').hide();
            };

        });
