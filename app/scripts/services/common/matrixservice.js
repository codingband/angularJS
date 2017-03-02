'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/matrixService
 * @description
 * # common/matrixService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
        .factory('MatrixService', function ($http) {
            var MatrixService = {
                stateConnection: false,
                sessionConnection: "",
                requestConnection: false,
                stateLogin: false,
                sessionInformation: "",
                reviewStatus: false,
                everymatrixConnection: function ($q, $scope) {
                    
                    var WEBSOCKET_API_URL = cyberPlayLocalized.wss;
                    var DOMAIN_PREFIX = 'http://www.cyberplay.com';

                    var deferred = $q.defer();

                    var connection = new autobahn.Connection({url: WEBSOCKET_API_URL, realm: DOMAIN_PREFIX});

                    connection.onopen = function (session) {
                        MatrixService.stateConnection = true;
                        MatrixService.sessionConnection = session;
                        MatrixService.requestConnection = false;
                        MatrixService.sessionConnection.subscribe('/sessionStateChange', function (args, kwargs, details) {
                            console.log('Event is fired with data = %o', kwargs);
                            if (kwargs.code === 3 || kwargs.code === 1) {
                                $.alert({
                                    title: 'Your Session is expired!',
                                    content: 'Login again, please',
                                    backgroundDismiss: false,
                                    confirmButton: 'Ok',
                                    theme: 'supervan',
                                    confirm: function () {
                                        window.location = cyberPlayLocalized.urlhome + "/" + localStorage.getItem("language").toLowerCase() + "/casino";
                                    }
                                });
                            }
                            if (kwargs.code === 5) {
                                $.alert({
                                    title: 'Session is terminated because pre-set limitation time is reached',
                                    content: 'Login again, please',
                                    backgroundDismiss: false,
                                    confirmButton: 'Ok',
                                    theme: 'supervan',
                                    confirm: function () {
                                        window.location = cyberPlayLocalized.urlhome + "/" + localStorage.getItem("language").toLowerCase() + "/casino";
                                    }
                                });
                            }
                            if (kwargs.code === 6) {
                                $.alert({
                                    title: 'Session is terminated because self-exclusion is enabled',
                                    content: 'Login again, please',
                                    backgroundDismiss: false,
                                    confirmButton: 'Ok',
                                    theme: 'supervan',
                                    confirm: function () {
                                        window.location = cyberPlayLocalized.urlhome + "/" + localStorage.getItem("language").toLowerCase() + "/casino";
                                    }
                                });
                            }
                        });

                        
                        MatrixService.sessionID = session._id;
                        deferred.resolve(session);
                    };

                    connection.onclose = function () {
                        console.log("onclose");
                        MatrixService.stateConnection = false;

                        $scope.$broadcast('closeConnection', {
                            value: true
                        });
                    };

                    if (!MatrixService.requestConnection && !MatrixService.stateConnection) {
                        MatrixService.requestConnection = true;
                        connection.open();
                    } else {
                        deferred.resolve(MatrixService.sessionConnection);
                    }

                    return deferred.promise;
                },
                
                getCmsSessionID: function($q){
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user#getCmsSessionID", []).then(
                            function(result){
                                deferred.resolve(result);
                            },function(error){
                                deferred.reject(error);
                                console.log("Error", error)
                            }
                    );
                    return deferred.promise;
                },
                loginWithCmsSessionID: function($q, parameters){
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user#loginWithCmsSessionID", [], parameters).then(
                            function(result){
                                deferred.resolve(result);
                            },function(error){
                                deferred.reject(error);
                                console.log("Error", error)
                            }
                    );
                    return deferred.promise;
                },
                resumeSession: function ($q, $scope) {
                    var deferred = $q.defer();
                    if (localStorage.getItem("lastSession")) {
                        var id = localStorage.getItem("lastSession");
                        var parameters = {
                            sessionID: id
                        };
                        MatrixService.sessionConnection.call("/user#resumeLogin", [], parameters).then(
                                function (result) {
                                    MatrixService.stateLogin = true;
                                    localStorage.setItem("lastSession", MatrixService.sessionConnection.id);
                                    deferred.resolve(result);
                                }
                        , function (error) {
                            localStorage.removeItem("lastSession");
                            MatrixService.stateLogin = false;
                            console.log(error, 'Error resumenSession');
                            deferred.reject(error);
                            localStorage.removeItem("stateLogin");
                            localStorage.removeItem("isLogged");
                            localStorage.removeItem("favorites");
                            localStorage.removeItem("isLogin");
                            localStorage.removeItem("type_method");
//                            $.alert({
//                                title: 'Your Session is closed!',
//                                content: 'Login again, please',
//                                backgroundDismiss: false,
//                                confirmButton: 'Ok',
//                                theme: 'supervan',
//                                confirm: function () {
//                                    console.log("Close resumeSession")
//                                }
//                            });
                        }
                        );
                    } else {
                        deferred.reject('ERROR NO SESSION ACTIVE');
                    }
                    return deferred.promise;
                },
                login: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user#login", [], parameters).then(
                            function (result) {
                                if (result.kwargs.isEmailVerified === true) {
                                    MatrixService.stateLogin = true;
                                    localStorage.setItem("lastSession", MatrixService.sessionID);
                                    deferred.resolve(result);
                                } else {
                                    MatrixService.stateLogin = false;
                                    deferred.reject('Email is not verified, please verify before to login.');
                                }
                            }, function (error) {
                        MatrixService.stateLogin = false;
                        deferred.reject(error);
                    }

                    );
                    return deferred.promise;
                },
                basicConfig: function ($q){
                    var deferred = $q.defer();
                    
                    MatrixService.sessionConnection.call("/user/basicConfig#get").then(
                        function (result) {
                             deferred.resolve(result);
                        }, function (error) { 
                            deferred.reject(error);
                        }        
                    );
                    return deferred.promise;  
                },
                impersonatedLogin: function (parameters, $q){
                    var deferred = $q.defer();
                    
                    MatrixService.sessionConnection.call("/user#impersonatedLogin",[], parameters).then(
                            function (result) {
                                 MatrixService.stateLogin = true;
                                 localStorage.setItem("lastSession", MatrixService.sessionID);
                                 deferred.resolve(result);
                                 
                            }, function (error) { //console.log(" impersonatedError");
                            MatrixService.stateLogin = false;
                            deferred.reject(error);
                    }
                            
                    );
                    return deferred.promise;
                    
                },
                listenBalancesChanges: function (infUser, $scope) {

                    var socket = io("https://balance.viks.com", {query: "username=" + infUser.username});
                    socket.on('new-balance', function (data) {
                        $scope.$broadcast('updated-balance', {
                            data: data
                        });
                    });
                    socket.on("disconnect", function () {
                        console.log("client disconnected from server");

                    });
//                        socket.on("error", function(){
//                            socket = io("https://balance.viks.com", { query: "username="+infUser.username });
//                        });

                },
                logout: function ($q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user#logout").then(
                            function (result) {
                                MatrixService.stateLogin = false;
                                deferred.resolve(result);
                            }, function (error) {
                        MatrixService.stateLogin = true;
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                logoutAfterTime: function ($q) {
                    var deferred = $q.defer();
                    var parameters = {seconds: 30};
                    MatrixService.sessionConnection.call("/user/test#setSessionLimitationSeconds", [], parameters).then(
                            function (result) {
                                MatrixService.stateLogin = false;
                                deferred.resolve(result);
                            }
                    , function (error) {
                        MatrixService.stateLogin = true;
                        deferred.reject(error);
                    }
                    );

                    return deferred.promise;
                },
                registerUser: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#register", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getSessionInfo: function ($q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user#getSessionInfo").then(
                            function (result) {
                                deferred.resolve(result.kwargs);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getWatchBalance: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#watchBalance", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                forgotPassword: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/pwd#sendResetPwdEmail", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                verificationKeyForgotPassword: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/pwd#isResetPwdKeyAvailable", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                resetPassword: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/pwd#reset", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getGameTransactions: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#getGamingAccounts", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getCountries: function ($q, DataService, languageCode) {
                    var deferred = $q.defer();
                    var parameters = {
                        expectRegions: true,
                        filterByCountry: '',
                        excludeDenyRegistrationCountry: true,
                        culture: localStorage.getItem("language")
                    };
                    MatrixService.sessionConnection.call("/user/account#getCountries", [], parameters).then(
                            function (result) {
                                DataService.countries = result.kwargs.countries;
                                DataService.currentIPCountry = result.kwargs.currentIPCountry;
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            }
                    );
                    return deferred.promise;
                },
                getProfile: function ($q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#getProfile").then(
                            function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject('ERROR getProfile');
                            });
                    return deferred.promise;
                },
                updateProfile: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#updateProfile", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            });
                    return deferred.promise;
                },
                changePassword: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/pwd#change", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            });
                    return deferred.promise;
                },
                sendNewEmail: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/email#sendVerificationEmailToNewMailbox", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            });
                    return deferred.promise;
                },
                verifyNewEmail: function (key, $q, email) {
                    var deferred = $q.defer();
                    if (typeof key !== 'undefined') {
                        var parameters = {
                            "key": key,
                            "email": email
                        };

                        MatrixService.sessionConnection.call("/user/email#verifyNewEmail", [], parameters).then(
                                function (result) {
                                    deferred.resolve(result);
                                }
                        , function (error) {
                            deferred.reject(error);
                        }
                        );
                    } else {

                    }
                    return deferred.promise;
                },
                //payments
                getCategorizedPaymentMethods: function ($q, parameters) {

                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call(
                            "/user/deposit#getCategorizedPagmentMethods", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            }
                    );
                    return deferred.promise;
                },
                getDepositPaymentMethods: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call(
                            "/user/deposit#getPaymentMethods", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            }
                    );
                    return deferred.promise;
                },
                getPaymentMethodFields: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/deposit#getPaymentMethodCfg", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                preparePayCreditCard: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/deposit#prepare", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                confirmDeposit: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/deposit#confirm", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getTransactionInfo: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/deposit#getTransactionInfo", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                   getTransactionInfo });
                    return deferred.promise;
                },
                registerPayCard: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/deposit#registerPayCard", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getWithdrawPaymentMethods: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#getPaymentMethods", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getWithdrawPaymentMethodCfg: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#getPaymentMethodCfg", [], parameters).then(
                            function (result) {
                                //WPService.fieldsWithdrawPayment = result.kwargs.fields;
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                withdrawRegisterPayCard: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#registerPayCard", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                withdrawPrepare: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#prepare", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                confirmWithdraw: function (parameter, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#confirm", [], parameter).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getTransactionInfoWithdraw: function ($q, parameters) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#getTransactionInfo", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                   getTransactionInfo });
                    return deferred.promise;
                },
                //end payments
                getCurrencies: function ($q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#getCurrencies").then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getPhonePrefixes: function ($q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/account#getPhonePrefixes").then(
                            function (result) {
                                deferred.resolve(result);
                            }
                    , function (error) {
                        deferred.reject(error);
                    }

                    );
                    return deferred.promise;
                },
                verifyEmail: function (key, $q) {
                    var deferred = $q.defer();
                    if (typeof key !== 'undefined') {
                        var language = '';
                        if (localStorage.getItem("language") === 'SV')
                            language = 'SE';
                        else
                            language = localStorage.getItem("language");
                    
                        var parameters = {
                            verificationCode: key,
                            culture: localStorage.getItem("language")
                        };

                        MatrixService.sessionConnection.call("/user/account#activate", [], parameters).then(
                                function (result) {
                                    deferred.resolve(result);
                                }
                        , function (error) {
                            deferred.reject(error);
                        }
                        );
                    } else {

                    }
                    return deferred.promise;
                },
                getGameCasinoBonuses: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/bonus#getGrantedBonuses", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                applyBonus: function (parameter, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/bonus#apply", [], parameter).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getGameCasinoBonusesById: function ($q, bonusCode) {
                    var defered = $q.defer();
                    MatrixService.sessionConnection.call("/user#getApplicableBonuses", [], bonusCode).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                getTransactionHistory: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user#getTransactionHistory", [], parameters).then(
                            function (result) {
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    }
                    );
                    return deferred.promise;
                },
                getCfg: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/coolOff#getCfg", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                enable: function (parameters, $q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/coolOff#enable", [], parameters).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                getLimits: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/limit#getLimits", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                setDepositLimit: function (parameters, $q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/limit#setDepositLimit", [], parameters).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                removeDepositLimit: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/limit#removeDepositLimit", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                setWageringLimit: function (parameters, $q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/limit#setWageringLimit", [], parameters).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                removeWageringLimit: function ($q) {
                    var defered = $q.defer();
                    MatrixService.sessionConnection.call("/user/limit#removeWageringLimit", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                setLossLimit: function (parameters, $q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/limit#setLossLimit", [], parameters).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                removeLossLimit: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/limit#removeLossLimit", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                getRealityCheckCfg: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/realityCheck#getCfg", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                setRealityCheck: function (parameters, $q) {
                    var defered = $q.defer();
                    MatrixService.sessionConnection.call("/user/realityCheck#set", [], parameters).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                getRealityCheck: function ($q) {
                    var defered = $q.defer();

                    MatrixService.sessionConnection.call("/user/realityCheck#get", [], {}).then(
                            function (result) {
                                defered.resolve(result);
                            }, function (error) {
                        defered.reject(error);
                    }
                    );

                    return defered.promise;
                },
                getDefaultData: function (DataService, $q) {
                    var language = '';
                    if (localStorage.getItem("language") === 'SV') language = 'SE';
                    else language = localStorage.getItem("language");
                    
                    var promiseCurrencies = MatrixService.getCurrencies($q);
                    promiseCurrencies.then(
                            function (success) {
                                DataService.isLoadedCurrencies = true;
                                DataService.currencies = success.kwargs;
                            }, function (error) {
                    }
                    );

                    var promiseCountries = MatrixService.getCountries($q, DataService, language);
                    promiseCountries.then(
                            function (success) {
                                DataService.isLoadedCountries = true;
                            }, function (error) {
                    }
                    );

                    var promisePhonePrefixes = MatrixService.getPhonePrefixes($q);
                    promisePhonePrefixes.then(
                            function (success) {
                                DataService.isLoadedprefixes = true;
                                DataService.prefixes = success.kwargs;
                            }, function (error) {
                    }
                    );
                },
                getPendingWithdrawals: function ($q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#getPendingWithdrawals").then(
                            function (result) {
                                console.log(result);
                                deferred.resolve(result);
                            }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                rollbackWithdrawals: function (parameters, $q) {
                    var deferred = $q.defer();
                    MatrixService.sessionConnection.call("/user/withdraw#rollback", [], parameters).then(
                            function (result) {
                                console.log(result);
                                deferred.resolve(result);
                            }, function (error) {
                        console.log(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getInstance: function () {
                    return MatrixService;
                }
            };

            return MatrixService;
        });
