'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainHeaderCtrl
 * @description
 * # MainHeaderCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('HeaderCtrl',
                ['$rootScope', '$scope', 'WPService', 'DataService', 'UtilsService', '$uibModal', 'I18N', '$location',
                    '$base64', '$sce', 'MatrixService', '$routeParams',
                    function ($rootScope, $scope, WPService, DataService, UtilsService, $uibModal, I18N, $location,
                            $base64, $sce, MatrixService, $routeParams) {

                        $scope.connection = MatrixService.getInstance();
                        $scope.images = cyberPlayLocalized.images;
                        $scope.displaySignUpContent = false;
                        $scope.data = DataService;
                        $scope.i18n = I18N[DataService.language];
                        $scope.signUpNow = "";

                        var tagLang = "";
                        var langPath = window.location.pathname.split("/");
                        var codeLang = 'EN';
                        for (var i in langPath) {
                            switch (langPath[i].toUpperCase()) {
                                case 'DE':
                                    codeLang = 'DE';
                                    break;
                                case 'FI':
                                    codeLang = 'FI';
                                    break;
                                case 'NO':
                                    codeLang = 'NO';
                                    break;
                                case 'SE':
                                    codeLang = 'SE';
                                    break;
                                case 'EN':
                                    codeLang = 'EN';
                                    break;
                                case 'UK':
                                    codeLang = 'UK';
                                    break;
                                case 'CA':
                                    codeLang = 'CA';
                                    break;
                                case 'AU':
                                    codeLang = 'AU';
                                    break;
                                case 'NZ':
                                    codeLang = 'NZ';
                                    break;
                            }
                        }
                        DataService.language = codeLang;

                        try {
                            localStorage.setItem("language", codeLang);
                        } catch (err) {
                            console.log("casinoCtrl:", err.message);
                        }
                        if ($scope.i18n['sign-up-now'] !== undefined) {
                            $scope.signUpNow = $scope.i18n['sign-up-now'];
                        } else if ($scope.i18n['sign-up-now'] !== undefined) {
                            $scope.signUpNow = $scope.i18n['sign-up-now'];
                        }
                        var urlSportsMobile = '';
                        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                            localStorage.setItem("msports", true);
                            var watch = $scope.$watch(function(){
                                if(localStorage.getItem("language") != null && localStorage.getItem("countryCode") != null){
                                    watch();
                                    if(localStorage.getItem("isLogged") == 'false' || !localStorage.getItem("isLogged")){
                                        var language = localStorage.getItem("language");
                                        var country = localStorage.getItem("countryCode");

                                        if(localStorage.getItem("language") == 'SE') language = 'SV';
                                        if(localStorage.getItem("countryCode") == 'SE') country = 'SE';
                                        
                                        var lang = 'lang=' + language.toLowerCase() + '_' + country;
                                        urlSportsMobile = cyberPlayLocalized.spostUrlMobile + "?" + lang;
                                        $scope.data.sportsMethod.mobileUrlWithoutLoggin = $sce.trustAsResourceUrl(urlSportsMobile);
                                        //window.location = urlSportsMobile;
                                    }
                                    else{
                                        UtilsService.getSportURL(DataService, $sce);
                                        //window.location = DataService.sportsMethod.urlMobileWindow;
                                    }
                                }
                            });  
                        }
                        
                        $scope.clickMobileSports = function () {
                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                if(localStorage.getItem("isLogged") == 'false' || !localStorage.getItem("isLogged")){
                                    window.location = urlSportsMobile;
                                }else{
                                    window.location = DataService.sportsMethod.urlMobileWindow;
                                }
                            }
                            localStorage.setItem('msports', true);
                        };

                        // To refresh the language
                        $scope.renderlanguage = localStorage.getItem('language');
                        $rootScope.$on('change-language', function (event, data) {
                            if ($scope.renderlanguage !== data.data) {
                                $scope.data = DataService;
                                $scope.i18n = I18N[DataService.language];
                                $scope.renderlanguage = data.data;
                                $scope.signUpButton = $scope.i18n['sign-up'];
                                getsSubHeaderMenu();
                            }
                        });

                        $rootScope.$broadcast('change-language', {
                            data: localStorage.getItem('language'),
                        });


                        $scope.titleData = [];
                        var getsSubHeaderMenu = function () {
                            WPService.getMenuLang("subheadermenuL", localStorage.getItem("language")).success(function (result) {
                                $scope.titleData = result;
                            });

                            WPService.getMenuLang("headermenu", localStorage.getItem("language")).success(function (result) {

                                $scope.menuHeader = result;
                            });
                        }

                        getsSubHeaderMenu();

//                        WPService.getMenu("subheadermenuR").success(function (res) {
//
//                            if (res.length === 0) {
//                                WPService.getMenuLang("subheadermenuR", DataService.defaultLang).success(function (result) {
//                                    $scope.subMenuHeaderR = result;
//                                });
//                            } else {
//                                $scope.subMenuHeaderR = res;
//                            }
//                        });

                        $scope.changeSection = function (location) {
                            if (location.indexOf("/casino") > -1)
                                localStorage.setItem("playSection", "casino");
                            if (location.indexOf("/sports") > -1)
                                localStorage.setItem("playSection", "sports");

                            window.location = location;
                        };
                        $('#contentSignupMenuMobile').hide();
                        $('#messageLoadingLogin div').show();

                        $scope.loadHomePage = function () {
                          var locationUrl = window.location.pathname;
                          var locationArray = locationUrl.split("/");
                          if(locationArray.length === 2){
                             localStorage.setItem("gameCategory", "VIDEOSLOTS");
                             location.reload();
                           }else{
                             if(locationArray.length === 3 && locationArray[2] === 'casino'){
                                localStorage.setItem("gameCategory", "VIDEOSLOTS");
                                location.reload();
                             }else{
                            localStorage.setItem("playSection", "casino");
                            localStorage.setItem("gameCategory", "VIDEOSLOTS");  
                            $location.path('/' + DataService.language.toLowerCase() + '/casino');
                            }
                          }
                        };

                        $scope.openMenuMobile = function () {
                            $('#contentMainMenuMobile').show();
                            $('#contentSignupMenuMobile').css('display', 'none');

                        };

                        $scope.closeMenuMobile = function () {
                            $('#contentMainMenuMobile').hide();
                        };

                        $scope.openSignupMenu = function () {
                            $('#contentSignupMenuMobile').show();
                            $scope.displaySignUpContent = true;
                            $('#messageLoadingLogin div').hide();
                            $("#contentSignupMenuMobile .login-grid").css('display', 'block');
                            $("#contentMainMenuMobile").css('display', 'none');

                            if (!DataService.isLogged) {
                                $(".signUpSectionMobile .accessLogin").hide();
                            }
                            if (DataService.isLogged == false) {
                                $(".signUpSectionMobile .infoAccess").hide();
                                $(".signUpSectionMobile .infoAccess2").hide();
                            } else {
                                $(".signUpSectionMobile .infoAccess").show();
                                $(".signUpSectionMobile .infoAccess2").show();
                            }
                        };

                        $scope.closeSignupMenu = function () {
                            $('#contentSignupMenuMobile').hide();
                            $('#messageLoadingLogin div').show();
                            $scope.displaySignUpContent = false;
                            $('#loginBox').hide();
                            $scope.data.loguinUserPopup = false;
                        };

                        $scope.openCasino = function () {
                            $scope.closeMenuMobile();
                            event.preventDefault();
                            $location.path('/' + DataService.language.toLowerCase() + '/casino');
                        };

                        $scope.openPromotions = function () {

                            $('#table-jackpots').vTicker('remove');
                            $('#table-winner').vTicker('remove');
                            $('#last-winners').vTicker('remove');
                            $scope.closeMenuMobile();
                            event.preventDefault();
                            $location.path('/' + DataService.language.toLowerCase() + "/casino/promotions");
                        };

                        $scope.openPayments = function ($event) {
                            $('#table-jackpots').vTicker('remove');
                            $('#table-winner').vTicker('remove');
                            $('#last-winners').vTicker('remove');
                            $scope.closeMenuMobile();
                            event.preventDefault();
                            $location.path('/' + DataService.language.toLowerCase() + "/payments");
                            $event.stopPropagation();
                        };
                        $scope.openAboutUs = function ($event) {
                            $('#table-jackpots').vTicker('remove');
                            $('#table-winner').vTicker('remove');
                            $('#last-winners').vTicker('remove');

                            $scope.closeMenuMobile();

                            event.preventDefault();
                            $location.path('/' + DataService.language.toLowerCase() + "/aboutus");
                            $event.stopPropagation();
                        };
                        $scope.openBlog = function ($event) {

                            $('#table-winner').vTicker('remove');
                            $('#table-jackpots').vTicker('remove');

                            var URLactual = window.location + "";
                            var element = URLactual.split('/');
                            if (element[4] != "news") {
                                $('#last-winners').vTicker('remove');
                            }

                            $scope.closeMenuMobile();

                            event.preventDefault();
                            $location.path('/' + DataService.language.toLowerCase() + "/news");
                            $event.stopPropagation();
                        };

                        $(window).on("scroll touchmove", function () {
                            $('#main-nav').toggleClass('tiny', $(document).scrollTop() > 0);
                        });

                        $scope.openSignUp = function () {
                            $scope.closeMenuMobile();
                            $scope.data.modalDialogs.modalDialogBox =
                                    UtilsService.showModalMessageAuto($uibModal, '', 'main/registerUser.html',
                                            'RegisterUserCtrl', 'large-modal');
                        };
                    }]);
