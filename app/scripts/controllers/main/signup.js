'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainSignupCtrl
 * @description
 * # MainSignupCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('SignUpCtrl',
                function ($rootScope, $scope, $q, MatrixService, UtilsService, $uibModal, I18N, DataService, WPService,
                        MainMatrixService, $location, MatrixCasinoService, $sce, $route, $base64) {
                    $scope.data = DataService;
                    $scope.connection = MatrixService.getInstance();
                    $scope.i18n = I18N[DataService.language];
                    $scope.menuLogedUser = [];
                    $scope.menuLogedUserMoney = [];
                    $scope.UserName = $scope.i18n.username;
                    $scope.UserPassword = $scope.i18n.password;
                    $scope.UserSignUp = $scope.i18n['sign-up'];
                    $scope.UserLogin = $scope.i18n.login;
                    $scope.UserForgotPassword = $scope.i18n['forgot-password'];
                    $scope.data.loguinUserPopup = false;
                    var balanceState = false;
                    $scope.iovationBlackBox = '';
                    $scope.unableButtonLogin = false;

                    $scope.$on('updated-balance', function (event, data) {
                        setTimeout(function () { // Delay to update balances
                            balanceState = false;
                            updateBalance(data.data);
                        }, 5000);
                    });

                    // To refresh the language
                    $scope.renderlanguage = localStorage.getItem('language');
                    $rootScope.$on('change-language', function (event, data) {
                        if ($scope.renderlanguage !== data.data) {
                            $scope.data = DataService;
                            $scope.i18n = I18N[localStorage.getItem('language')];
                            $scope.renderlanguage = data.data;
                            $scope.UserSignUp = $scope.i18n['sign-up'];
                            getMenuLang();
                            getMenuLangMoney();

                        }
                    });
                    // end refresh language

                    var updateBalance = function (response) {
                        var balance = response;
                        var realmoney = parseFloat(balance.realmoney);
                        var bonusmoney = parseFloat(balance.bonusmoney);
                        DataService.infUser.totalBalance = (realmoney + bonusmoney).toFixed(2);
                        DataService.infUser.totalToWithdraw = (realmoney - bonusmoney).toFixed(2);
                        balanceState = true;
                        $scope.$apply();
                    };

                    $scope.OpenLogin = function () {
                        $scope.data = DataService;
                        $scope.i18n = I18N[DataService.language];
                        $scope.UserName = $scope.i18n.username;
                        $scope.UserPassword = $scope.i18n.password;
                        $scope.UserSignUp = $scope.i18n['sign-up'];
                        $scope.UserLogin = $scope.i18n.login;
                        $scope.UserForgotPassword = $scope.i18n['forgot-password'];

                        if ($scope.data.loguinUserPopup == false) {
                            $('#loginBox').show();
                            $scope.data.loguinUserPopup = true;
                            $scope.password = '';
                        } else {
                            if ($scope.data.loguinUserPopup == true) {
                                $('#loginBox').hide();
                                $scope.data.loguinUserPopup = false;
                            }
                        }
                    };

                    $scope.$on('closeConnection', function (event, data) {
                        var promiseEMConnection = MatrixService.everymatrixConnection($q, $scope);
                        promiseEMConnection.then(
                                function (success) {
                                    $scope.i18n
                                }, function (error) {
                        }
                        );
                    });
                    $('#messageLoadingLogin').hide();
                    $scope.login = function () {
                        if ($scope.usernameOrEmail !== undefined || $scope.password !== undefined) {
                            $('#contentSignupMenuMobile').hide();
                            $('#messageLoadingLogin div').show();
                            $scope.unableButtonLogin = true;

                            var parameters = {
                                usernameOrEmail: $scope.usernameOrEmail,
                                password: $scope.password,
                                iovationBlackBox: DataService.iovationBlackBox,
                                culture: localStorage.getItem("language")
                            };

                            var promiseLogin = MatrixService.login(parameters, $q);
                            promiseLogin.then(
                                    function (success) {
                                        $scope.data.isLogged = true;
                                        localStorage.setItem("isLogin", 1);
                                        localStorage.setItem("isLogged", true);
                                        document.cookie = "_ln1="+$scope.usernameOrEmail;
                                        
                                        var stringCredentials = '{"usr":"'+$scope.usernameOrEmail+'", "pw":"'+$scope.password+'"}';
                                        localStorage.setItem("_ln", $base64.encode(stringCredentials));
                                        
                                        localStorage.setItem("isLogged", true);
                                        UtilsService.getCmsSessionID($q, MainMatrixService, DataService, $sce);

                                        UtilsService.getFavorites($q, MatrixCasinoService, DataService);
                                        DataService.gamesSection.games = [];
                                        
                                        getSessionInfLocal();

                                        $(".signUpSectionMobile .accessLogin").show();
                                        $scope.usernameOrEmail = "";
                                        $scope.password = "";
                                        $scope.unableButtonLogin = false;

                                        var location = window.location.href;
                                        var arrayLocation = location.split("/");
                                        var loginInGameSection = false;

                                        for (var index in arrayLocation) {
                                            if (arrayLocation[index] === I18N[DataService.language]["gamelang"]) {
                                                loginInGameSection = true;
                                                break;
                                            }
                                            else
                                                loginInGameSection = false;
                                        }

                                        if (loginInGameSection) {
                                            var currSrc = $("#gameArea").attr("src");
                                            $("#gameArea").attr("src", currSrc);
                                        }
                                    }, function (error) {
                                DataService.allDepositPayments = [];
                                var parameters = {
                                    filterByCountry: '',
                                    currency: DataService.defaultCurrency,
                                    culture: localStorage.getItem("language")
                                };
                                UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                                //$.unblockUI();
                                $scope.unableButtonLogin = false;
                                var message = '';
//                        if($scope.password === '' || $scope.usernameOrEmail === ''){
//                            message = 'The login failed. Username or Password is empty, please fill these fields.';
//                        }else{
                                message = error.kwargs.desc;
                                //}
                                DataService.contentModalMessage = {
                                    title: $scope.i18n['error'],
                                    className: 'errorMessage',
                                    message: message
                                };
                                $scope.data.modalDialogs.messageModal =
                                        UtilsService.showModalMessageAuto($uibModal, "", 'main/modalMessage.html', 'ModalMessageCtrl', "");
                                $scope.password = "";
                            }
                            );
                        }
                    };

                    var getSessionInfLocal = function () {
                        var promiseSessionInfo = MatrixService.getSessionInfo($q);
                        promiseSessionInfo.then(
                                function (success) {
                                    var languageByIp = UtilsService.getLenguageCountry(success.userCountry);
                                    localStorage.setItem("language", languageByIp.langCode);
                                    localStorage.setItem("countryCode", languageByIp.countryCode);

                                    UtilsService.getSportURL(DataService, $sce);
                                    var location = window.location.pathname;
                                    UtilsService.loadPageByLanguage(location, languageByIp.langCode, $location, DataService, I18N, $route);

                                    $scope.data.infUser = success;
                                    DataService.allDepositPayments = [];
                                    var parameters = {
                                        filterByCountry: $scope.data.infUser.userCountry,
                                        currency: $scope.data.infUser.currency,
                                        culture: localStorage.getItem("language")
                                    };
                                    UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                                    MatrixService.listenBalancesChanges(DataService.infUser, $scope);
                                    UtilsService.getAvailableWithdraw(MatrixService, DataService, $q);
                                    UtilsService.getAvailableWithdrawPayments(MainMatrixService, $q, DataService);

                                    WPService.getMenu("menuLogedUser").success(function (res) {
                                        if (res.length !== 0) {
                                            $scope.menuLogedUser = setIdentifier(res);
                                        }
                                    });
                                }, function (error) {
                            console.log(error);
                        }
                        );
                    };

                    var showAccountDetailsModal = function () {
                        if (UtilsService.isAppleDevice()) {
                            UtilsService.fixScrollModalApple();
                        }
                        UtilsService.showModalMessage($uibModal, 'Details',
                                'main/myAccountDetails.html', 'AccountDetailsCtrl', 'large-modal');
                    };

                    $scope.openModal = function (option) {

                        switch (option) {
                            case 'SignIn':
                                {
                                    $('#contentSignupMenuMobile').hide();
                                    $('#loginBox').hide();
                                    $scope.data.loguinUserPopup = false;

                                    $scope.data.modalDialogs.modalDialogBox =
                                            UtilsService.showModalMessageAuto($uibModal, '', 'main/registerUser.html',
                                                    'RegisterUserCtrl', 'large-modal');
                                }
                                break;
                            case 'Forgot Password':
                                {
                                    UtilsService.showModalMessage($uibModal, '', 'main/forgotPassword.html',
                                            'ForgotPasswordCtrl', '"login modal"');
                                }
                                break;
                        }
                    };

                    $scope.displayWithdraw = function () {
                        /*$.blockUI({
                            message: $('#messageLoadingLogin'),
                            css: {
                                border: 'none',
                                padding: '15px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '10px',
                                '-moz-border-radius': '10px',
                                opacity: .7,
                                color: '#fff',
                                'font-size': '40px',
                                'font-weight': 'bold',
                                left: '25%',
                                width: '45%'
                            }
                        });*/
                        UtilsService.functionWithdraw(MainMatrixService, $uibModal,
                                "payments/withdrawPayment.html", $q, DataService, 'WithdrawPaymentCtrl', 'bank controller');
                    };
                    $scope.displayDeposit = function () {
                        $scope.data.modalDeposit = "0";
                        $scope.data.modalDialogs.modalDepositPaymentDialog =
                                UtilsService.showModalMessageAuto($uibModal, "0",
                                        "payments/depositPaymentsModal.html", 'DepositPaymentsModalCtrl', 'large-modal');
                    };

                    $scope.modalMenu = function (option) {
                        switch (option) {
                            case 'My details':
                                $scope.data.tabName = 'profile';
                                showAccountDetailsModal();
                                break;
                            case 'Balance details':
                                $scope.data.tabName = 'balance';
                                showAccountDetailsModal();
                                break;
                            case 'Transactions':
                                $scope.data.tabName = 'transaction';
                                showAccountDetailsModal();
                                break;
                            case 'Bonuses':
                                $scope.data.tabName = 'bonuses';
                                showAccountDetailsModal();
                                break;
                            case 'KYC':
                                $scope.data.tabName = 'kyc';
                                showAccountDetailsModal();
                                break;
                            case 'Limits':
                                $scope.data.tabName = 'limits';
                                showAccountDetailsModal();
                                break;
                            case 'Logout':
                        
                                //Clean data when is not mobile device
                                if (!UtilsService.isMobileDevice()) {
                                    DataService.allDepositPayments = [];
                                }
                                DataService.allTransactionHistory = [];
                                var parameters = {
                                    filterByCountry: '',
                                    currency: DataService.defaultCurrency
                                };
                                UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                                var promiseLogout = MatrixService.getInstance().logout($q);
                                promiseLogout.then(
                                        function (success) {
                                            localStorage.removeItem("isLogin");
                                            localStorage.setItem("isLogged", false);
                                            UtilsService.getSportURL(DataService, $sce);

                                            $('#table-jackpots').vTicker('remove');
                                            $('#table-winner').vTicker('remove');
                                            $('#last-winners').vTicker('remove');
                                            $scope.data.isLogged = false;
                                            DataService.isLogged = false;
                                            $scope.password = '';
                                            $('#loginBox').hide();
                                            $(".signUpSectionMobile .accessLogin").hide();
                                            $scope.data.loguinUserPopup = false;
                                            
                                            if(localStorage.getItem("openMobileGame")) 
                                                localStorage.removeItem("openMobileGame");
                                            if(localStorage.getItem("returnMobilegame"))
                                                localStorage.removeItem("returnMobilegame")
                                            if(localStorage.getItem("_ln"))
                                                localStorage.removeItem("_ln");
                                            
                                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                                $('.accessLogin').hide();
                                                $('.infoAccess').hide();
                                                $('.infoAccess2').hide();
                                                $('#contentSignupMenuMobile').hide();
                                            }
                                            var location = window.location.href;
                                            var arrayLocation = location.split("/");
                                            var logoutInGameSection = false;

                                            for (var index in arrayLocation) {
                                                if (arrayLocation[index] === "game") {
                                                    logoutInGameSection = true;
                                                    break;
                                                }
                                                else
                                                    logoutInGameSection = false;
                                            }

                                            if (logoutInGameSection) {
                                                var currSrc = $("#gameArea").attr("src");
                                                $("#gameArea").attr("src", currSrc);
                                            }
                                            
                                        }, function (error) {
                                    console.log(error);
                                }
                                );
                                
                                if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                                    UtilsService.getNewIovationBlackBox(DataService);
                                }
                                break;

                            case '/my-details':
                                $scope.data.tabName = 'profile';
                                showAccountDetailsModal();
                                break;
                            case '/balance-details':
                                $scope.data.tabName = 'balance';
                                showAccountDetailsModal();
                                break;
                            case '/transactions':
                                $scope.data.tabName = 'transaction';
                                showAccountDetailsModal();
                                break;
                            case '/bonuses':
                                $scope.data.tabName = 'bonuses';
                                showAccountDetailsModal();
                                break;
                            case '/kyc':
                                $scope.data.tabName = 'kyc';
                                showAccountDetailsModal();
                                break;
                            case '/limits':
                                $scope.data.tabName = 'limits';
                                showAccountDetailsModal();
                                break;
                            case '/logout':
//                                $.blockUI({
//                                    message: "Loading...",
//                                    css: {
//                                        border: 'none',
//                                        padding: '15px',
//                                        backgroundColor: '#000',
//                                        '-webkit-border-radius': '10px',
//                                        '-moz-border-radius': '10px',
//                                        opacity: .7,
//                                        color: '#fff',
//                                        'font-size': '40px',
//                                        'font-weight': 'bold',
//                                        left: '25%',
//                                        width: '45%'
//                                    }
//                                });
                                //Clean data when is not mobile device
                                if (!UtilsService.isMobileDevice()) {
                                    DataService.allDepositPayments = [];
                                }
                                DataService.allTransactionHistory = [];
                                var parameters = {
                                    filterByCountry: '',
                                    currency: DataService.defaultCurrency,
                                    culture: localStorage.getItem("language"),
                                    iovationBlackBox: DataService.iovationBlackBox
                                };
                                UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                                var promiseLogout = MatrixService.getInstance().logout($q);
                                promiseLogout.then(
                                        function (success) {
                                            $scope.data.isLogged = false;
                                            localStorage.removeItem("isLogin");

                                            localStorage.setItem("isLogged", false);
                                            UtilsService.getSportURL(DataService, $sce);

                                            $('#table-jackpots').vTicker('remove');
                                            $('#table-winner').vTicker('remove');
                                            $('#last-winners').vTicker('remove');

                                            $scope.password = '';
                                            $('#loginBox').hide();
                                            $(".signUpSectionMobile .accessLogin").hide();
                                            $scope.data.loguinUserPopup = false;
                                            
                                            if(localStorage.getItem("openMobileGame")) 
                                                localStorage.removeItem("openMobileGame");
                                            if(localStorage.getItem("returnMobilegame"))
                                                localStorage.removeItem("returnMobilegame")
                                            if(localStorage.getItem("_ln"))
                                                localStorage.removeItem("_ln");
                                            
                                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                                $('.accessLogin').hide();
                                                $('.infoAccess').hide();
                                                $('.infoAccess2').hide();
                                                $('#contentSignupMenuMobile').hide();
                                            }
                                            var location = window.location.href;
                                            var arrayLocation = location.split("/");
                                            var logoutInGameSection = false;

                                            for (var index in arrayLocation) {
                                                if (arrayLocation[index] === "game") {
                                                    logoutInGameSection = true;
                                                    break;
                                                }
                                                else
                                                    logoutInGameSection = false;
                                            }

                                            if (logoutInGameSection) {
                                                var currSrc = $("#gameArea").attr("src");
                                                $("#gameArea").attr("src", currSrc);
                                            }
                                            DataService.gamesSection.games = [];
                                            if (localStorage.getItem("gameCategory") == 'favourite') {
                                                $scope.data.clickFavourite = false;
                                                localStorage.setItem("gameCategory", "VIDEOSLOTS");
                                                DataService.gamesSection.selectedCategory = [localStorage.getItem("gameCategory")];
                                            }
                                            DataService.gamesSection.favorite = [];
                                            DataService.gamesSection.favouriteGames = [];
                                            localStorage.setItem('favorites', '');
                                            
                                            if(localStorage.getItem("sportsDesktop")){
                                                var parameterLogout = {
                                                    "sessionId": DataService.cmsSessionID,
                                                    "username": DataService.credentialsUser.usr
                                                }; 
                                                jQuery.ajax({
                                                    type: "POST",
                                                    url: cyberPlayLocalized.urlhome+'logoutSports/logoutAjax.php',
                                                    dataType: 'text',
                                                    data: {'parameter': parameterLogout},
                                                    success: function (data) {
                                                        var dataSplit = data.split(" ");

                                                        for(var i in dataSplit){
                                                            if(dataSplit[i].search("sessionsLoggedout") >= 0){
                                                                var stateLoggedout = dataSplit[i].split("=");
                                                                var stateValue = stateLoggedout[1].split('"');
                                                                if(stateValue[1] == '1'){
                                                                    console.log("CLOSE SESSION TRUE -> ", stateValue[1]);
                                                                    var lang = 'lang=' + localStorage.getItem("language").toLowerCase() + '_' + localStorage.getItem("countryCode");
                                                                    var urlSportsDesktop = cyberPlayLocalized.spostUrlDesktop + '?' + lang+"&currentSession=anonymous";
                                                                    $scope.data.sportsMethod.desktopUrlWithoutLoggin = $sce.trustAsResourceUrl(urlSportsDesktop);
                                                                    
                                                                    //$.unblockUI();
                                                                }
                                                            }
                                                        }
                                                    },
                                                    error: function (errorThrown) {
                                                        console.log("Error", errorThrown);
                                                        /*$.unblockUI();*/
                                                    }
                                                });
                                            }

                                            //delete stateLogin and cmsSessionID 
                                            localStorage.removeItem("stateLogin");
                                            document.cookie = "cms=";
                                            document.cookie = "stateLogin=false";
                                            localStorage.setItem("isLogin", 0);
                                            document.cookie = "_ln1=";
                                            var location = window.location.pathname;
                                            UtilsService.loadPageByLanguage(location, localStorage.getItem("language"), $location, DataService, I18N, $route);
                                        }, function (error) {
                                    console.log(error);
                                }
                                );
                                
                                if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                                    UtilsService.getNewIovationBlackBox(DataService);
                                }
                                break;
                        }
                    };

                    $scope.clickPayment = function (name) {
                        if (name === 'Deposit' || name === "/deposit") {
                            $scope.data.modalDialogs.modalDepositPaymentDialog =
                                    UtilsService.showModalMessageAuto($uibModal, "deposit modal",
                                            "payments/depositPaymentsModal.html", 'DepositPaymentsModalCtrl', 'large-modal');

                        }
                        else {
                            $scope.data.modalDialogs.modalConfirmationPayment =
                                    UtilsService.showModalMessageAuto($uibModal, '', "payments/withdrawPayment.html", 'WithdrawPaymentCtrl');
                        }
                    };


                    var getMenuLang = function () {
                        WPService.getMenuLang("menuLogedUser", localStorage.getItem("language")).success(function (result) {
                            $scope.menuLogedUser = result;
                        });
                    };
                    
                    getMenuLang();

                    var getMenuLangMoney = function () {
                        WPService.getMenuLang("menuLogedUserMoney", localStorage.getItem("language")).success(function (result) {

                            $scope.menuLogedUserMoney = result;//changeTitle(result);

                        });
                    }
                    getMenuLangMoney();

                    $("#single-button").click(function () {
                        WPService.getMenuLang("menuLogedUser", localStorage.getItem("language")).success(function (result) {
                            $scope.menuLogedUser = result;
                        });
                        getMenuLang();
                        getMenuLangMoney();
                    });

                    $("#money-button").click(function () {
                        WPService.getMenuLang("menuLogedUser", localStorage.getItem("language")).success(function (result) {
                            $scope.menuLogedUser = result;
                        });
                        getMenuLang();
                        getMenuLangMoney();

                    });


                    function setIdentifier(menu) {
                        for (var i = 0; i < menu.length; i++) {
                            var titleMenu = menu[i].title;
                            menu[i].identifier = $scope.i18n[titleMenu];
                        }
                        ;

                        return menu;
                    }

                    function changeTitle(menu) {
                        for (var i = 0; i < menu.length; i++) {
                            var titleMenu = menu[i].title;
                            menu[i].identifier = $scope.i18n[titleMenu];
                        }
                        ;

                        return menu;
                    }

                    function timerIncrement() {
                        UtilsService.initIdleCounter = UtilsService.initIdleCounter + 1;

                        if (UtilsService.initIdleCounter > 30 && $scope.data.isLogged) {
                            MatrixService.getInstance().logout($q).then(
                                    function (success) {
                                        localStorage.setItem("isLogged", false);
                                        UtilsService.getSportURL(DataService, $sce);

                                        if ($scope.data.showSesionExpired) {
                                            $.alert({
                                                title: 'Your Session is expired!!',
                                                content: 'Login again, please',
                                                backgroundDismiss: false,
                                                confirmButton: 'Ok',
                                                theme: 'supervan',
                                                confirm: function () {
                                                    $scope.data.isLogged = false;
                                                    $scope.data.showSesionExpired = true;
                                                    $location.path("/" + $scope.data.language.toLowerCase() + "/casino");

                                                }
                                            });
                                            $scope.data.showSesionExpired = false;
                                        }
                                        DataService.gamesSection.games = [];
                                        if (localStorage.getItem("gameCategory") == 'favourite') {
                                            $scope.data.clickFavourite = false;
                                            localStorage.setItem("gameCategory", "VIDEOSLOTS");
                                            DataService.gamesSection.selectedCategory = [localStorage.getItem("gameCategory")];
                                        }
                                        DataService.gamesSection.favorite = [];
                                        DataService.gamesSection.favouriteGames = [];
                                        localStorage.setItem('favorites', '');
                                        //delete stateLogin and cmsSessionID 
                                        localStorage.removeItem("stateLogin");
                                        document.cookie = "cms=";
                                        document.cookie = "stateLogin=false";
                                        
                                        if(localStorage.getItem("openMobileGame")) 
                                            localStorage.removeItem("openMobileGame");
                                        if(localStorage.getItem("returnMobilegame"))
                                            localStorage.removeItem("returnMobilegame")
                                        if(localStorage.getItem("_ln"))
                                            localStorage.removeItem("_ln");
                                        
                                    }, function (error) {
                                console.log(error);
                            }
                            );
                        }
                    }
                    ;

                    $(document).ready(function () {
                        var tInterval = setInterval(timerIncrement, 120000);
                        $(this).mousemove(function (e) {
                            UtilsService.initIdleCounter = 0;
                        });
                        $(this).keypress(function (e) {
                            UtilsService.initIdleCounter = 0;
                        });
                        $scope.$watch(function () {
                            if (balanceState) {
                                UtilsService.initIdleCounter = 0;
                                balanceState = false;
                            }
                        });
                    });


                    // basic configurations must be on page before snare.js   
                    var io_bbout_element_id = 'iovationBlackBox';
                    var io_install_stm = false;
                    var io_exclude_stm = 12;
                    var io_install_flash = false;
                    var io_enable_rip = true;

                    var sent = false;

                    var timeoutId;
                    var clearWatchIovation = $scope.$watch(function () {
                        if ($scope.data.iovation.javaScriptUrl) {
                            var urlFile = $scope.data.iovation.javaScriptUrl;
                            var script = document.createElement('script');
                            script.type = "text/javascript";
                            script.src = urlFile;
                            document.head.appendChild(script);
                            timeoutId = setInterval(useBlackboxString, 5000);
                            clearWatchIovation();

                        }
                    });

                    function useBlackboxString(intervalCount) {
                        if (typeof ioGetBlackbox !== 'function') {
                            return;
                        }

                        var bbData = ioGetBlackbox();

                        send_bb(bbData.blackbox);

                        if (bbData.finished) {
                            clearTimeout(timeoutId);
                            document.getElementById('iovationBlackBox').value = bbData.blackbox;
                            $scope.iovationBlackBox = bbData.blackbox;
                            DataService.iovationBlackBox = bbData.blackbox;
                            //console.log("DataService.iovationBlackBox ", DataService.iovationBlackBox);
                        }
                    }
                    //timeoutId = setInterval(useBlackboxString, 5000);


                    function send_bb(bb) { // function to process the blackbox
                        if (sent)
                            return;
                        // process blackbox
                        // send blackboc to the methods which requires Iovation check
                        sent = true;
                    }


                });
