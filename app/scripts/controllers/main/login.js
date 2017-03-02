'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainLoginctrlCtrl
 * @description
 * # MainLoginctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('LoginCtrl',
                function ($scope, $q, MainMatrixService, MatrixService, UtilsService, DataService, $uibModal, I18N, $location,
                        MatrixCasinoService, $sce, $base64, $route) {
                    $scope.data = DataService;
                    $scope.i18n = I18N[DataService.language];
                    $scope.unableButton = false;
                    
                    if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                        UtilsService.getNewIovationBlackBox(DataService);
                    }
                    
                    var validForm = false;
                    var clearWatchR = $scope.$watch(function () {
                        if ($("#form_login").load()) {
                            $("#form_login").validate({
                                errorClass: "errorMessageFormValidation",
                                submitHandler: function (form) {
                                    validForm = true;
                                    $scope.loginPage();
                                }
                            });
                            clearWatchR();
                        }
                    });

                    if (localStorage.getItem("method") != null && localStorage.getItem("method") != '' && 
                            (localStorage.getItem("method") == 'login' || localStorage.getItem("method") == 'logindeposit') ||
                            localStorage.getItem("method") == 'loginplay'){
                        localStorage.setItem("mobileLogin", "open");
                    }

                    $scope.loginPage = function () {
                        if (validForm) {
                            $scope.unableButton = true;
                            var parameters = {
                                usernameOrEmail: $scope.usernameOrEmail,
                                password: $scope.password,
                                culture: localStorage.getItem("language"),
                                iovationBlackBox: DataService.iovationBlackBox
                            };
                            
                            var promiseLogin = MatrixService.login(parameters, $q);
                            promiseLogin.then(
                                    function (success) {
                                        $scope.data.isLogged = true;

                                        document.cookie = "_ln1="+$scope.usernameOrEmail;

                                        var stringCredentials = '{"usr":"'+$scope.usernameOrEmail+'", "pw":"'+$scope.password+'"}';
                                        localStorage.setItem("_ln", $base64.encode(stringCredentials));
                                        
                                        localStorage.setItem("isLogin",1);
                                        localStorage.setItem("isLogged", true);

                                        UtilsService.getFavorites($q, MatrixCasinoService, DataService);
                                        DataService.gamesSection.games = [];
                                        
                                        getSessionInfLocal();
                                    },
                                    function (error) {
                                        $scope.unableButton = false;
                                        localStorage.setItem("isLogged", false);
                                        
                                        $('.spinner-login').hide();
                                        $scope.password = '';
                                        DataService.contentModalMessage = {
                                            title: $scope.i18n['error'],
                                            className: 'errorMessage',
                                            message: error.kwargs.desc
                                        };

                                        $scope.data.modalDialogs.messageModal =
                                                UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");

                                        DataService.allDepositPayments = [];
                                        var parameters = {
                                            filterByCountry: '',
                                            currency: DataService.defaultCurrency,
                                            culture: localStorage.getItem("language"),
                                            iovationBlackBox: DataService.iovationBlackBox
                                        };
                                        UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                                        console.log(error);
                                    }
                            );
                        }
                    };
                    $scope.closeModalDialog = function () {
                        $(document).unbind("contextmenu.namespace");
                        localStorage.removeItem("mobileLogin");
                        localStorage.removeItem("msports");
                        localStorage.removeItem("method");
                        
                        UtilsService.modalDialog.close();
                    };
                    
                    var getSessionInfLocal = function () {
                        var promiseSessionInfo = MatrixService.getSessionInfo($q);
                        promiseSessionInfo.then(
                                function (success) {
                                    var languageByIp = UtilsService.getLenguageCountry(success.userCountry);
                                    getCmsSessionID(languageByIp);
                                    localStorage.setItem("language", languageByIp.langCode);
                                    localStorage.setItem("countryCode", languageByIp.countryCode);
                                    
                                    $scope.data.infUser = success;
                                    DataService.allDepositPayments = [];
                                    
                                    var parameters = {
                                        filterByCountry: $scope.data.infUser.userCountry,
                                        currency: $scope.data.infUser.currency,
                                        culture: localStorage.getItem("language"),
                                        iovationBlackBox: DataService.iovationBlackBox
                                    };
                                    UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                                    UtilsService.getAvailableWithdraw(MatrixService, DataService, $q);
                                    UtilsService.getAvailableWithdrawPayments(MainMatrixService, $q, DataService);
                                    
                                    MatrixService.listenBalancesChanges(DataService.infUser, $scope);
                                }, function (error) {
                                    $scope.unableButton = false;
                                    console.log(error);
                                }
                        );
                    };
                    
                    var playGameMobile = function(gameId, liveGame){
                        var promiseLaunchUrl = MatrixCasinoService.getInstance().getLauncUrl($q, gameId, 
                            DataService.isLogged, liveGame, I18N[DataService.language]);
                            promiseLaunchUrl.then(
                                function (success) {
                                  if(success.kwargs.url == null){
                                    DataService.contentModalMessage = {
                                            title: "Message",
                                            className: "errorMessage",
                                            message: "The game is not available for your country."
                                        };
                                        $scope.data.modalDialogs.messageModal = 
                                        UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                                  }else{
                                    window.location = success.kwargs.url;
                                  }
                                    DataService.mobile.openGame = true;
                                }, function (error) {
                                    console.log(error);});
                    };
                    
                    var playLiveGame = function(tableId){
                        var urlLive =''+$scope.i18n[$scope.data.gamesSection.categoryLive.code];
                        var urlLiveCasino=urlLive.replace(/\s/g, '');
                        $location.path(DataService.language.toLowerCase() + "/" + urlLiveCasino.toLowerCase() + "/" + tableId);
                    };
                    
                    var getCmsSessionID = function(languageByIp){
                        MainMatrixService.getInstance().getCmsSessionID($q).then(
                            function(result){
                                DataService.cmsSessionID = result.kwargs.cmsSessionID;
                                document.cookie = "cms="+result.kwargs.cmsSessionID;
                                document.cookie = "isLogged=true";

                                UtilsService.getSportURL(DataService, $sce);
                                
                                $scope.unableButton = false;
                                $('.spinner-login').hide();
                                
                                UtilsService.modalDialog.close();
                                var location = window.location.pathname;
                                
                                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                    switch(localStorage.getItem("method")){
                                        case 'login':
                                            if($scope.data.sportsMethod.login){
                                                localStorage.removeItem("method");
                                                localStorage.removeItem("mobileLogin");
                                                $scope.data.sportsMethod.login = false;
                                                window.location = $scope.data.sportsMethod.urlMobileWindow;
                                            }
                                            break;
                                        case 'logindeposit':
                                            localStorage.removeItem("method");
                                            localStorage.removeItem("mobileLogin");
                                            $location.path('/' + localStorage.getItem("language").toLowerCase() + "/payments");
                                            break;
                                        case 'loginplay':
                                            if(localStorage.getItem("game")){
                                                var gameId = localStorage.getItem("game");
                                                localStorage.removeItem("method");
                                                localStorage.removeItem("game");
                                                localStorage.removeItem("mobileLogin");
                                                var liveGame = '';
                                                playGameMobile(gameId, liveGame);
                                            }
                                            break;
                                        case null:
                                            if(DataService.gamesSection.slugMobileGame != '' && 
                                                    localStorage.getItem("gameCategory") != "live"){
                                                playGameMobile(DataService.gamesSection.slugMobileGame);
                                            }else{
                                                if(DataService.gamesSection.idLiveGame != '' && localStorage.getItem("gameCategory") == "live"){
                                                    var liveGame = 'game-live';
                                                    playGameMobile(DataService.gamesSection.idLiveGame, liveGame);
                                                }else{
                                                    var location = window.location.pathname;
                                                    UtilsService.loadPageByLanguage(location, languageByIp.langCode, $location ,DataService, I18N, $route);
                                                }
                                            }
                                            break;
                                    }
                                }else{
                                    if(DataService.gamesSection.idLiveGame != '' && localStorage.getItem("gameCategory") == "live"){
                                        playLiveGame(DataService.gamesSection.idLiveGame);
                                    }else
                                        UtilsService.loadPageByLanguage(location, languageByIp.langCode, $location ,DataService, I18N, $route);
                                }
                            },
                            function(error){
                                $scope.unableButton = false;
                                document.cookie = "_ln1=";
                            }
                            );
                    };
                });