'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/utilsService
 * @description
 * # common/utilsService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
        .factory('UtilsService', function ($http) {
            var UtilsService = {
                modalDialog: '',
                days: [],
                months: [],
                years: []
            };

            UtilsService.putDefaultLocalStorageData = function () {

                var playSection = localStorage.getItem("playSection");
                if (!playSection) {
                    localStorage.setItem("playSection", "");
                }
            };

            UtilsService.addLanguageLS = function () {

                var language = localStorage.getItem("language");
                var countryCode = localStorage.getItem("countryCode");

                var onSuccess = function (location) {
                    var languageByIp = UtilsService.getLenguageCountry(location.country.iso_code);

                    if (!language) {
                        localStorage.setItem("language", languageByIp.langCode);
                    }
                    if (!countryCode) {
                        localStorage.setItem("countryCode", languageByIp.countryCode);
                    }

                };

                var onError = function (error) {
                    console.log("onError in geoip2", error);
                    localStorage.setItem("language", "EN");
                    localStorage.setItem("countryCode", "GB");
                };

                geoip2.country(onSuccess, onError);

            };

             UtilsService.getLenguageCountry = function (country_code) {

                var languageByIp = {
                    countryCode: '',
                    langCode: ''
                };
                    switch (country_code) {
                        case 'NO':
                            languageByIp.countryCode = 'NO';
                            languageByIp.langCode = 'NO';
                            break;
                        case 'SE':
                            languageByIp.countryCode = 'SE';
                            //languageByIp.langCode = 'SV';
                            languageByIp.langCode = 'SE';
                            break;
                        case 'FI':
                            languageByIp.countryCode = 'FI';
                            languageByIp.langCode = 'FI';
                            break;
                        case 'AT':
                            languageByIp.countryCode = 'AT';
                            languageByIp.langCode = 'DE';
                            break;
                        case 'DE':
                            languageByIp.countryCode = 'DE';
                            languageByIp.langCode = 'DE';
                            break;
                        case 'GB':
                            languageByIp.countryCode = 'GB';
                            languageByIp.langCode = 'UK';
                            break;
                        case 'CA':
                            languageByIp.countryCode = 'CA';
                            languageByIp.langCode = 'CA';
                            break;
                        case 'AU':
                            languageByIp.countryCode = 'AU';
                            languageByIp.langCode = 'AU';
                            break;
                        case 'NZ':
                            languageByIp.countryCode = 'NZ';
                            languageByIp.langCode = 'NZ';
                            break;
                        default:
                            languageByIp.countryCode = country_code;
                            languageByIp.langCode = 'EN';
                            break;
                    }
                return languageByIp;
            };

            UtilsService.getCountryByLanguage = function (language_code) {

                var countryByLanguage = {
                    countryCode: '',
                    langCode: ''
                };
                switch (language_code) {
                    case 'NO': countryByLanguage.countryCode = 'NO'; countryByLanguage.langCode = 'NO'; break;
                    //case 'SV': countryByLanguage.countryCode = 'SE'; countryByLanguage.langCode = 'SV'; break;
                    case 'SE': countryByLanguage.countryCode = 'SE'; countryByLanguage.langCode = 'SE'; break;
                    case 'FI': countryByLanguage.countryCode = 'FI'; countryByLanguage.langCode = 'FI'; break;
                    case 'DE': countryByLanguage.countryCode = 'DE'; countryByLanguage.langCode = 'DE'; break;
                    case 'UK': countryByLanguage.countryCode = 'GB'; countryByLanguage.langCode = 'UK'; break;
                    case 'CA': countryByLanguage.countryCode = 'CA'; countryByLanguage.langCode = 'CA'; break;
                    case 'AU': countryByLanguage.countryCode = 'AU'; countryByLanguage.langCode = 'AU'; break;
                    case 'NZ': countryByLanguage.countryCode = 'NZ'; countryByLanguage.langCode = 'NZ'; break;
                    case 'DE': countryByLanguage.countryCode = 'AT'; countryByLanguage.langCode = 'DE'; break;
                    default: countryByLanguage.countryCode = 'AU'; countryByLanguage.langCode = 'EN'; break;
                }
                return countryByLanguage;
            };

            UtilsService.showModalMessage = function ($uibModal, message, tpl, controller, window) {
                UtilsService.modalDialog = $uibModal.open({
                    templateUrl: 'views/' + tpl,
                    controller: controller,
                    windowClass: window,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        message: function () {
                            return message;
                        }
                    }
                });
            };

            UtilsService.showModalMessageAuto = function ($uibModal, message, tpl, controller, window) {
                var modalDialog = $uibModal.open({
                    templateUrl: 'views/' + tpl,
                    controller: controller,
                    windowClass: window,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        message: function () {
                            return message;
                        }
                    }
                });

                return modalDialog;
            };

            UtilsService.getDaysMonthsYears = function () {
                var x = 1;
                var i = 0;
                var date = new Date();
                var year = date.getFullYear();

                //Days
                for (i = x; i <= 31; i++) {
                    UtilsService.days[i - 1] = i;
                }
                //Months
                for (i = x; i <= 12; i++) {
                    UtilsService.months[i - 1] = i;
                }
                //Years
                x = 0;
                for (i = year - 18; i >= year - 99; i--) {
                    UtilsService.years[x] = i;
                    x++;
                }
            };

            UtilsService.formatNamesCategories = function (oldCategories, DataService) {
                var categories = [];
                for (var index in oldCategories) {
                    if (oldCategories[index] === 'VIDEOSLOTS')
                        categories[0] = {name: oldCategories[index], img: '', code: oldCategories[index]};

                    if (oldCategories[index] === 'CLASSICSLOTS')
                        categories[1] = {name: 'CLASSIC SLOTS', img: '', code: oldCategories[index]};

                    if (oldCategories[index] === 'TABLEGAMES')
                        categories[2] = {name: 'TABLE GAMES', img: '', code: oldCategories[index]};

                    if (oldCategories[index] === 'VIDEOPOKERS')
                        categories[3] = {name: 'VIDEO POKER', img: '', code: oldCategories[index]};

                    if (oldCategories[index] === 'JACKPOTGAMES')
                        categories[4] = {name: 'JACKPOT', img: DataService.imageFolder + '/jackpots.png', code: oldCategories[index]};

                    if (oldCategories[index] === 'LOTTERY')
                        categories[5] = {name: 'LOTTERY', img: '', code: oldCategories[index]};
                    else
                        categories[5] = {name: '', img: '', code: ''};

                    if (oldCategories[index] === 'SCRATCHCARDS')
                        categories[6] = {name: 'SCRATCH CARDS', img: '', code: oldCategories[index]};
                    else
                        categories[6] = {name: '', img: '', code: ''};

                    if (oldCategories[index] === 'OTHERGAMES')
                        categories[7] = {name: 'OTHER GAMES', img: '', code: oldCategories[index]};
                }
                return categories;
            };
            //payments

            UtilsService.loadPayments = function ($q, DataService, MainMatrixService, parameters) {

                MainMatrixService.getInstance().getCategorizedPaymentMethods($q, parameters).then(
                        function (res) {
                            loadFilterPayments(res.kwargs.categories);
                        }, function (error) {
                    console.log("ERROR: categorize Payments", error);
                }
                );

                var loadFilterPayments = function (paymentsList) {
                    DataService.allDepositPayments = [];
                    DataService.allWithdrawPayments = [];

                    for (var indexCategory in paymentsList) {
                        var payments = paymentsList[indexCategory].paymentMethods;
                        for (var index in payments) {
                            var paymentDeposit = {};
                            var paymentWithdraw = {};
                            if (payments[index].supportWithdrawal) {
                                paymentWithdraw = loadObjectPaymentHardcode(indexCategory, index, payments, paymentsList);
                                if (paymentWithdraw.code !== undefined) {
                                    DataService.allWithdrawPayments.push(paymentWithdraw);
                                }
                            }
                            paymentDeposit = loadObjectPayment(indexCategory, index, payments, paymentsList);
                            DataService.allDepositPayments.push(paymentDeposit);
                        }
                    }

                    var bankTransfer = {
                        codeCategory: 'Bank Transfer',
                        nameCategory: 'Instant banking',
                        code: 'BankTransfer',
                        //depositFee: '2%, min 1 EUR, max 10 EUR',
                        depositFee: 'free',
                        depositLimit: {
                            currency: "EUR",
                            max: 10000,
                            min: 50
                        },
                        depositProcessingTime: "3-5 days",
                        icon: cyberPlayLocalized.images + 'payments/banktransfer.png',
                        name: 'Bank Transfer'
                    };
                    DataService.allWithdrawPayments.push(bankTransfer);


                    if (DataService.isLogged) {
                        sortDepositPayments(DataService);
                    }

                };
            };

            function loadObjectPayment(indexCat, indexPayment, payments, paymentsList) {
                var objectPayment =
                        {
                            codeCategory: paymentsList[indexCat].code,
                            nameCategory: paymentsList[indexCat].name,
                            code: payments[indexPayment].code,
                            depositFee: payments[indexPayment].depositFee,
                            depositLimit: payments[indexPayment].depositLimit,
                            depositProcessingTime: payments[indexPayment].depositProcessingTime,
                            icon: payments[indexPayment].icon,
                            name: payments[indexPayment].name,
                            supportWithdrawal: payments[indexPayment].supportWithdrawal
                        };
                return objectPayment;
            };
            UtilsService.valuesObjectWithdraw = function (paymentMethods) {
                var valuesWithdraw = {};
                var payCard = '';
                if (paymentMethods.payCard) {
                    payCard = paymentMethods.payCard;
                }
                valuesWithdraw = {
                    code: paymentMethods.code,
                    icon: paymentMethods.icon,
                    withdrawDesc: paymentMethods.withdrawDesc,
                    withdrawFee: paymentMethods.withdrawFee,
                    payCard: payCard,
                    withdrawLimit: paymentMethods.withdrawLimit,
                };
                return valuesWithdraw;
            };
            UtilsService.getAvailableWithdrawPayments = function (MainMatrixService, $q, DataService) {
                var parameters = {
                    currency: DataService.infUser.currency,
                    includeAll: true,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };
                MainMatrixService.getInstance().getWithdrawPaymentMethods($q, parameters).then(
                        function (result) {

                            var paymentMethods = result.kwargs.paymentMethods;
                            var visa = false, bank = false, visaElectron = false, visaDebit = false;
                            DataService.dawWithdraw = [];
                            DataService.WithdrawVisa = [];
                            DataService.WithdrawBank = {};
                            DataService.WithdrawVisaDebit = [];
                            DataService.WithdrawVisaElectron = [];
                            DataService.WithdrawNeteller = [];
                            DataService.WithdrawSkrill = [];
                            DataService.WithdrawOnlyAmountField = [];

                            for (var i in paymentMethods) {
                                var values = {};
                                switch (paymentMethods[i].code) {
                                    case "VISA":
                                        if (!visa) {
                                            values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                            visa = true;
                                        }
                                        DataService.WithdrawVisa.push(paymentMethods[i]);
                                        break;
                                    case "VISA_Debit":
                                        if (!visaDebit) {
                                            values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                            visaDebit = true;
                                        }
                                        DataService.WithdrawVisaDebit.push(paymentMethods[i]);
                                        break;
                                    case "VISA_Electron":
                                        if (!visaElectron) {
                                            values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                            visaElectron = true;
                                        }
                                        DataService.WithdrawVisaElectron.push(paymentMethods[i]);
                                        break;
                                    case "Bank":
                                        if (!bank) {
                                            values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                            var parameters = {
                                                paymentMethodCode: "Bank",
                                                payCardID: "",
                                                culture: localStorage.getItem("language"),
                                                iovationBlackBox: DataService.iovationBlackBox
                                            };
                                            MainMatrixService.getInstance().getWithdrawPaymentMethodCfg(parameters, $q).then(
                                                    function (result) {
                                                        DataService.WithdrawBank = result.kwargs;
                                                        var userCountryName = '';

                                                        for (var i in DataService.countries) {
                                                            if (DataService.infUser.userCountry === DataService.countries[i].code)
                                                                userCountryName = DataService.countries[i].name;
                                                        }

                                                        getWithdrawPaymentFields(userCountryName, result.kwargs.fields);
                                                    }, function (error) {
                                                console.log("ERROR", error);
                                            }
                                            );
                                            bank = true;
                                        }
                                        break;
                                    case "Neteller":
                                        values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                        DataService.WithdrawNeteller.push(paymentMethods[i]);
                                        break;
                                    case "Skrill":
                                        values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                        DataService.WithdrawSkrill.push(paymentMethods[i]);
                                        break;
//                                    case "Trustly":
//                                        values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);                                     
//                                        DataService.WithdrawOnlyAmountField.push(paymentMethods[i]);
//                                        break; 
                                    default:
                                        values = UtilsService.valuesObjectWithdraw(paymentMethods[i]);
                                        break;
                                }
//                            }
                                if (values.code) {
                                    DataService.dawWithdraw.push(values);
                                }
                            }
                        }, function (error) {
                    console.log("w-error", error);
                }
                );
                var getWithdrawPaymentFields = function (userCountryName, fieldsWithdrawPayment) {
                    DataService.withDrawBankField = [];
                    var countriesFields = fieldsWithdrawPayment.payCardID.countries;
                    for (var index in countriesFields) {
                        if (userCountryName === countriesFields[index].name) {
                            for (var keyValue in countriesFields[index].registrationFields) {
                                var field = {
                                    key: keyValue,
                                    values: countriesFields[index].registrationFields[keyValue]
                                };
                                DataService.withDrawBankField.push(field);
                            }
                        }
                    }
                };
            };
            UtilsService.functionWithdraw = function (MainMatrixService, $uibModal,
                    htmlFile, $q, DataService, controllerName, message) {

                var userCountry = '';
                var parametersW = {
                    currency: "USD",
                    includeAll: true,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };

                MainMatrixService.getInstance().getWithdrawPaymentMethods($q, parametersW).then(
                        function (success) {
                            var withdrawPaymentMethodw = success.kwargs.paymentMethods;
                            var payCard = [];
                            var codeBank, icon, name, withdrawDesc, withdrawFee = '';
                            var withdrawLimit = {};
                            var objectBank = {};
                            for (var index in withdrawPaymentMethodw) {
                                if (withdrawPaymentMethodw[index].code === 'Bank') {
                                    codeBank = withdrawPaymentMethodw[index].code;
                                    icon = withdrawPaymentMethodw[index].icon;
                                    name = withdrawPaymentMethodw[index].name;
                                    withdrawDesc = withdrawPaymentMethodw[index].withdrawDesc;
                                    withdrawFee = withdrawPaymentMethodw[index].withdrawFee;
                                    withdrawLimit = {
                                        currency: withdrawPaymentMethodw[index].withdrawLimit.currency,
                                        max: withdrawPaymentMethodw[index].withdrawLimit.max,
                                        min: withdrawPaymentMethodw[index].withdrawLimit.min
                                    };
                                    var statePayCardId = false;

                                    for (var key in withdrawPaymentMethodw[index]) {
                                        if (key === 'payCard')
                                            statePayCardId = true;
                                    }
                                    if (statePayCardId) {
                                        payCard.push(withdrawPaymentMethodw[index].payCard);
                                    }
                                }
                                if (payCard.length > 0) {
                                    objectBank = {
                                        code: codeBank,
                                        icon: icon,
                                        name: name,
                                        withdrawDesc: withdrawDesc,
                                        withdrawFee: withdrawFee,
                                        withdrawLimit: withdrawLimit,
                                        payCard: payCard
                                    };
                                } else {
                                    objectBank = {
                                        code: codeBank,
                                        icon: icon,
                                        name: name,
                                        withdrawDesc: withdrawDesc,
                                        withdrawFee: withdrawFee,
                                        withdrawLimit: withdrawLimit,
                                        payCard: payCard
                                    };
                                }
                            }
                            DataService.withdrawBankPayment = objectBank;
                            getProfile();
                        }, function (error) {
                    console.log("w-error", error);
                }
                );

                var getProfile = function () {
                    MainMatrixService.getInstance().getProfile($q).then(
                            function (success) {
                                DataService.codeProfileCountry = success.kwargs.fields.country;
                                DataService.fullNameUser = success.kwargs.fields.firstname + ' ' + success.kwargs.fields.surname;
                                if (DataService.countries.length === 0)
                                    loadAllCountries();
                                else
                                    withdrawPaymentsFields();
                            }, function (error) {
                        console.log(error)
                    }
                    );
                }
                var loadAllCountries = function () {
                    MainMatrixService.getInstance().getCountries($q, DataService, UtilsService.getCorrectlanguageCode()).then(
                            function (success) {
                                withdrawPaymentsFields();
                            }, function (error) {
                        console.log(error)
                    }
                    );
                }

                var withdrawPaymentsFields = function () {
                    for (var index in DataService.countries) {
                        if (DataService.codeProfileCountry == DataService.countries[index].code) {
                            DataService.countryNameProfile = DataService.countries[index].name;
                            userCountry = DataService.countries[index].name;
                            var parameters = {
                                paymentMethodCode: DataService.withdrawPaymentCodeDefault,
                                payCardID: '',
                                culture: localStorage.getItem("language"),
                                iovationBlackBox: DataService.iovationBlackBox
                            };
                            MainMatrixService.getInstance().getWithdrawPaymentMethodCfg(parameters, $q).then(
                                    function (success) {
                                        DataService.fieldsWithdrawPayment = success.kwargs.fields;
                                        getWithdrawPaymentFields(success.kwargs.fields);
                                    }, function (error) {
                                console.log("--error", error);
                            }
                            );
                        }
                    }
                };

                var getWithdrawPaymentFields = function (fieldsWithdrawPayment) {
                    DataService.withDrawBankField = [];
                    var countriesFields = fieldsWithdrawPayment.payCardID.countries;
                    for (var index in countriesFields) {
                        if (userCountry === countriesFields[index].name) {
                            for (var keyValue in countriesFields[index].registrationFields) {
                                var field = {
                                    key: keyValue,
                                    values: countriesFields[index].registrationFields[keyValue]
                                };
                                DataService.withDrawBankField.push(field);
                            }
                            DataService.modalDialogs.modalConfirmationPayment =
                                    UtilsService.showModalMessageAuto($uibModal, message, htmlFile, controllerName);
                        }
                    }
                };
            };
            UtilsService.getCorrectlanguageCode = function () {
                var language = '';
                if (localStorage.getItem("language") === 'SV')
                    language = 'SE';
                else
                    language = localStorage.getItem("language");
            }
            //favourite section
            UtilsService.getFavorites = function ($q, MatrixCasinoService, DataService) {
                var promiseFavorites = MatrixCasinoService.getInstance().getFavorites($q);
                promiseFavorites.then(
                        function (result) {
                            DataService.gamesSection.favorite = [];
                            DataService.gamesSection.favouriteGames = [];
                            var i, k;
                            var favouritegames = [];
                            DataService.gamesSection.lengthFavourite = result.kwargs.favorites.length;

                            for (i = 0, k = -1; i < result.kwargs.favorites.length; i++) {
                                DataService.gamesSection.favorite.push(result.kwargs.favorites[i].id);
                                if (i % 16 === 0) {
                                    k++;
                                    favouritegames[k] = [];
                                }
                                if (result.kwargs.favorites[i].type == "game") {
                                    result.kwargs.favorites[i].game['slug'] = result.kwargs.favorites[i].id;
                                    favouritegames[k].push(result.kwargs.favorites[i].game);
                                }
                                if (result.kwargs.favorites[i].type == "table")
                                    favouritegames[k].push(result.kwargs.favorites[i].table);
                            }
                            localStorage.setItem('favorites', escape(DataService.gamesSection.favorite.join(',')));
                            DataService.gamesSection.favouriteGames = favouritegames;
                        }, function (error) {
                    console.log(error);
                });
            };

            UtilsService.addToFavorites = function (DataService, slug, MatrixCasinoService, $q) {

                if (isNaN(slug)) {
                    var parameters = {
                        anonymousUserIdentity: '',
                        type: "game",
                        id: slug,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                } else {
                    var parameters = {
                        anonymousUserIdentity: '',
                        type: "table",
                        id: slug,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                }
                var promiseFavorites = MatrixCasinoService.addToFavorites($q, parameters);
                promiseFavorites.then(
                        function (success) {
                            DataService.gamesSection.favorite.push(slug);
                            localStorage.setItem('favorites', escape(DataService.gamesSection.favorite.join(',')));
                        }, function (error) {
                    console.log("login error", error);
                });
            };

            UtilsService.removeFromFavorites = function (DataService, slug, MatrixCasinoService, $q, index) {
                if (isNaN(slug)) {
                    var parameters = {
                        anonymousUserIdentity: '',
                        type: "game",
                        id: slug,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                } else {
                    var parameters = {
                        anonymousUserIdentity: '',
                        type: "table",
                        id: slug,
                        culture: localStorage.getItem("language"),
                        iovationBlackBox: DataService.iovationBlackBox
                    };
                }
                var promiseFavorites = MatrixCasinoService.removeFromFavorites($q, parameters);
                promiseFavorites.then(
                        function (success) {
                            DataService.gamesSection.favorite.splice(index, 1);
                            localStorage.setItem('favorites', escape(DataService.gamesSection.favorite.join(',')));
                            if (DataService.gamesSection.favorite.length == 0 && localStorage.getItem("gameCategory") == 'favourite') {
                                UtilsService.getFavorites($q, MatrixCasinoService, DataService);
                            }
                        }, function (error) {
                    console.log("login error", error);
                });
            };

            UtilsService.getAvailableWithdraw = function (MatrixService, DataService, $q) {
                var balanceParameters = {
                    expectBalance: true,
                    expectBonus: true,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };
                MatrixService.getInstance().getGameTransactions(balanceParameters, $q)
                        .then(function (res) {
                            var totalWithdraw = 0;
                            var amountBonus = 0;
                            for (var index in res.kwargs.accounts) {
                                if (!res.kwargs.accounts[index].isBonusAccount) {
                                    totalWithdraw += res.kwargs.accounts[index].amount;
                                }
                                if (res.kwargs.accounts[index].isBonusAccount) {
                                    amountBonus = res.kwargs.accounts[index].amount;
                                }
                            }

                            DataService.infUser["totalToWithdraw"] = totalWithdraw.toFixed(2);
                            DataService.infUser["totalBalance"] = (totalWithdraw + amountBonus).toFixed(2);
                        }, function (e) {
                            console.log(e.desc);
                        });
                MatrixService.getInstance().getProfile($q).then(
                        function (success) {
                            DataService.infUser["currencyToWhitdraw"] = success.kwargs.fields.currency;
                        }, function (error) {
                    console.log("error", error);
                }
                );
            };

            UtilsService.sendSupportMessage = function ($q, $subject, $email,
                    $name, $message, MainMatrixService, isLogged) {
                var deferred = $q.defer();
                var parameters = {};
                if (!isLogged) {
                    parameters = {
                        anonymousUserEmail: $email,
                        anonymousUserName: $name,
                        subject: $subject,
                        message: $message,
                        culture: localStorage.getItem("language")
                    };
                } else {
                    parameters = {
                        subject: $subject,
                        message: $message,
                        culture: localStorage.getItem("language")
                    };
                }

                MainMatrixService.sessionConnection.call("/user#sendEmailToSupport", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                }
                );

                return deferred.promise;
            };

            UtilsService.getCurrentDate = function () {
                var fullDate = new Date();
                //convert month and day to 2 digits
                var twoDigitMonth, twoDigitDay = 0;
                var month = fullDate.getMonth() + 1;
                if (month < 10)
                    twoDigitMonth = '0' + month;
                else
                    twoDigitMonth = month;

                if (fullDate.getDate() < 10)
                    twoDigitDay = '0' + fullDate.getDate();
                else
                    twoDigitDay = fullDate.getDate();

                var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDay;
                return currentDate;
            };

            UtilsService.getCurrentTime = function () {
                var fullDate = new Date();
                var twoDigitHour, twoDigitMin, twoDigitSec = 0;

                var hour = fullDate.getHours();
                var minute = fullDate.getMinutes();
                var second = fullDate.getSeconds();

                if (hour < 10)
                    twoDigitHour = '0' + hour;
                else
                    twoDigitHour = hour;

                if (minute < 10)
                    twoDigitMin = '0' + minute;
                else
                    twoDigitMin = minute;

                if (second < 10)
                    twoDigitSec = '0' + second;
                else
                    twoDigitSec = second;

                var currentTime = twoDigitHour + ":" + twoDigitMin + ":" + twoDigitSec;
                return currentTime;
            };

            UtilsService.fillOfflineObject = function (DataService) {
                var arrayCookie = document.cookie.split(";");
                
                for (var i in arrayCookie) {
                    var subArrayCookie = arrayCookie[i].split("=");
                    if (subArrayCookie[0].trim() === 'offlineCode') {
                        DataService.offlinevalues.offlineCode = subArrayCookie[1];
                    }
                    if (subArrayCookie[0].trim() === 'userRegisterDate') {
                        DataService.offlinevalues.userRegisterDate = subArrayCookie[1];
                    }
                    if (subArrayCookie[0].trim() === 'cms') {
                        DataService.cmsSessionID = subArrayCookie[1];
                    }
                    if (subArrayCookie[0].trim() === 'isLogged') {
                        var stageLogin = false;
                        if (subArrayCookie[1] == 'true')
                            stageLogin = true;
                        if (localStorage.getItem("sports") == 'true') {
                            DataService.isLogged = stageLogin;
                        }
                    }
                    if (subArrayCookie[0].trim() == '_ln1') {
                        DataService.credentialsUser.usr = subArrayCookie[1];
                    }
                }
            };

            UtilsService.bootstrapdatetimepicker = function (idFrom, idTo) {
                $(idFrom).datetimepicker({
                    format: 'YYYY-MM-DD',
                    icons: {
                        time: "fa fa-clock-o",
                        date: "fa fa-calendar",
                        previous: "fa fa-chevron-left",
                        next: "fa fa-chevron-right"
                    }
                });
                $(idTo).datetimepicker({
                    useCurrent: false,
                    format: 'YYYY-MM-DD',
                    icons: {
                        time: "fa fa-clock-o",
                        date: "fa fa-calendar",
                        previous: "fa fa-chevron-left",
                        next: "fa fa-chevron-right"
                    }
                });
                $(idFrom).on("dp.change", function (e) {
                    $(idTo).data("DateTimePicker").minDate(e.date);
                });
                $(idTo).on("dp.change", function (e) {
                    $(idFrom).data("DateTimePicker").maxDate(e.date);
                });
            };

            UtilsService.allowOnlyNumbers = function (idInput) {
                $(idInput).keydown(function (e) {
                    if (e.shiftKey || e.ctrlKey || e.altKey)
                        e.preventDefault();
                    else {
                        var key = e.keyCode;
                        if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) ||
                                (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                            e.preventDefault();
                        }
                    }
                });
            };
            function getUrlProvider(I18N, DataService, locationPath, newLang) {
                var providerPath = locationPath[2].split("-");
                var res = false;
                if (localStorage.getItem("sort_menu") == '/provider' &&
                        localStorage.getItem("provider") != null &&
                        localStorage.getItem("provider") == providerPath[0].toUpperCase()) {
                    res = true;
                    $location.path("/" + newLang.toLowerCase() + "/" + providerPath[0] + "-" +
                            I18N[newLang]["games-provider"]);
                }
                return res;
            };
            UtilsService.loadPageByLanguage = function (urlpathname, newLang, $location, DataService, I18N, $route) {
                var locationPath = urlpathname.split("/");

                var templateUrl = $route.current.templateUrl.split("/");

                if (locationPath.length === 2) {
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        $location.path('/' + newLang.toLowerCase());
                        location.reload();
                    } else {
                        $location.path('/' + newLang.toLowerCase());
                    }
                }
                else {
                    if (locationPath.length === 3) {
                        if (locationPath[2] === 'casino') {
                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                $location.path('/' + newLang.toLowerCase() + '/' + locationPath[2]);
                                location.reload();
                            } else {
                                $location.path('/' + newLang.toLowerCase() + '/' + locationPath[2]);
                            }
                        }
                        else {
                            var providerPath = locationPath[2].split("-");
                            if (localStorage.getItem("sort_menu") == '/provider' &&
                                    localStorage.getItem("provider") != null &&
                                    localStorage.getItem("provider").toUpperCase() == providerPath[0].toUpperCase()) {
                                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                                     $location.path("/" + newLang.toLowerCase() + "/" + providerPath[0] + "-" +
                                            I18N[newLang]["games-provider"]);
                                    location.reload();
                                  }else{
                                    $location.path("/" + newLang.toLowerCase() + "/" + providerPath[0] + "-" +
                                            I18N[newLang]["games-provider"]);
                                  }
                            }
                            else
                                $location.path('/' + newLang.toLowerCase() + '/' + locationPath[2]);
                        }
                    } else {
                        var completeLocationpath = '';
                        for (var i = 2; i < locationPath.length; i++) {
                            completeLocationpath = completeLocationpath + '/' + locationPath[i];
                        }
                        //add control for games for game real mode when login
                        if (templateUrl.length === 3) {
                            if (templateUrl[2] === "gamePage.html") {
                                $location.path('/' + newLang.toLowerCase() + completeLocationpath);
                                location.reload();
                            }else{
                                $location.path('/' + newLang.toLowerCase() + completeLocationpath);
                            }

                        } else {
                            $location.path('/' + newLang.toLowerCase() + completeLocationpath);
                        }
                    }
                }
                if (DataService.isLogged) {
                    sortDepositPayments(DataService);
                }

            };

            UtilsService.initIdleCounter = 0;

            function loadObjectPaymentHardcode(indexCat, indexPayment, payments, paymentsList) {

                var objectPayment = {};

                switch (payments[indexPayment].code) {
                    case 'VISA':
                        objectPayment =
                                {
                                    codeCategory: paymentsList[indexCat].code,
                                    nameCategory: paymentsList[indexCat].name,
                                    code: payments[indexPayment].code,
                                    //depositFee: '2%, min 1 EUR, max 10 EUR',
                                    depositFee: 'free',
                                    depositLimit: {
                                        currency: "EUR",
                                        max: 5000,
                                        min: 20
                                    },
                                    depositProcessingTime: "1-3 days",
                                    icon: payments[indexPayment].icon,
                                    name: payments[indexPayment].name,
                                    supportWithdrawal: payments[indexPayment].supportWithdrawal
                                };
                        break;
                    case 'Trustly':
                        objectPayment =
                                {
                                    codeCategory: paymentsList[indexCat].code,
                                    nameCategory: paymentsList[indexCat].name,
                                    code: payments[indexPayment].code,
                                    //depositFee: '2%, min 1 EUR, max 10 EUR',
                                    depositFee: 'free',
                                    depositLimit: {
                                        currency: "EUR",
                                        max: 10000,
                                        min: 20
                                    },
                                    depositProcessingTime: "Instant",
                                    icon: payments[indexPayment].icon,
                                    name: payments[indexPayment].name,
                                    supportWithdrawal: payments[indexPayment].supportWithdrawal
                                };
                        break;
                    case 'Skrill':
                        objectPayment =
                                {
                                    codeCategory: paymentsList[indexCat].code,
                                    nameCategory: paymentsList[indexCat].name,
                                    code: payments[indexPayment].code,
                                    //depositFee: '2%, min 1 EUR, max 10 EUR',
                                    depositFee: 'free',
                                    depositLimit: {
                                        currency: "EUR",
                                        max: 5000,
                                        min: 20
                                    },
                                    depositProcessingTime: "Instant",
                                    icon: payments[indexPayment].icon,
                                    name: payments[indexPayment].name,
                                    supportWithdrawal: payments[indexPayment].supportWithdrawal
                                };
                        break;
                    case 'Neteller':
                        objectPayment =
                                {
                                    codeCategory: paymentsList[indexCat].code,
                                    nameCategory: paymentsList[indexCat].name,
                                    code: payments[indexPayment].code,
                                    //depositFee: '2%, min 1 EUR, max 10 EUR',
                                    depositFee: 'free',
                                    depositLimit: {
                                        currency: "EUR",
                                        max: 5000,
                                        min: 20
                                    },
                                    depositProcessingTime: "Instant",
                                    icon: payments[indexPayment].icon,
                                    name: payments[indexPayment].name,
                                    supportWithdrawal: payments[indexPayment].supportWithdrawal
                                };
                        break;
                    case 'Envoy_INSTADEBiT':
                        objectPayment =
                                {
                                    codeCategory: paymentsList[indexCat].code,
                                    nameCategory: paymentsList[indexCat].name,
                                    code: payments[indexPayment].code,
                                    //depositFee: '2%, min 1 EUR, max 10 EUR',
                                    depositFee: 'free',
                                    depositLimit: {
                                        currency: "EUR",
                                        max: 10000,
                                        min: 50
                                    },
                                    depositProcessingTime: "Instant",
                                    icon: payments[indexPayment].icon,
                                    name: payments[indexPayment].name,
                                    supportWithdrawal: payments[indexPayment].supportWithdrawal
                                };
                        break;
                    default:
                        break;
                }
                return objectPayment;
            };

            function sortDepositPayments(DataService) {
                //In sortedByLang save how to be sort like the excel list.
                switch (localStorage.getItem("language")) {
                    case 'NO':
                        var sortedByLang = ["Neteller", "Skrill", "ecoPayz", "VISA", "MasterCard", "Maestro", "Paysafecard", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'SE':
                        var sortedByLang = ["Trustly", "VISA", "MasterCard", "Maestro", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "Envoy", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'SV':
                        var sortedByLang = ["Trustly", "VISA", "MasterCard", "Maestro", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "Envoy", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'FI':
                        var sortedByLang = ["Euteller", "Trustly", "VISA", "MasterCard", "Maestro", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "Envoy", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'DE':
                        var sortedByLang = ["Envoy_Sofort", "Envoy_Giropay", "Paysafecard", "Neteller", "Skrill", "ecoPayz", "Maestro", "VISA", "MasterCard", "Envoy", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'UK':
                        var sortedByLang = ["VISA", "MasterCard", "Maestro", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "Envoy", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'CA':
                        var sortedByLang = ["VISA", "MasterCard", "Maestro", "Envoy_INSTADEBiT", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'AU':
                        var sortedByLang = ["VISA", "MasterCard", "Maestro", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    case 'NZ':
                        var sortedByLang = ["VISA", "MasterCard", "Maestro", "Envoy_POLi_NewZealand", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "VISA_Debit", "VISA_Electron", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                    default:
                        var sortedByLang = ["VISA", "MasterCard", "Maestro", "Neteller", "Skrill", "ecoPayz", "Paysafecard", "Envoy", "VISA_Debit", "VISA_Electron", "Trustly", "Envoy_Sofort", "Envoy_Giropay", "Envoy_INSTADEBiT", "Envoy_POLi_NewZealand", "Euteller", "Envoy_Przelewy24", "Envoy_eKonto"];
                        break;
                }

                var orderDeposit = [];
                var i;
                for (i = 0; i < DataService.allDepositPayments.length; i++) {

                    switch (DataService.allDepositPayments[i].code) {
                        case sortedByLang[0]:
                            orderDeposit[0] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[1]:
                            orderDeposit[1] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[2]:
                            orderDeposit[2] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[3]:
                            orderDeposit[3] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[4]:
                            orderDeposit[4] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[5]:
                            orderDeposit[5] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[6]:
                            orderDeposit[6] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[7]:
                            orderDeposit[7] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[8]:
                            orderDeposit[8] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[9]:
                            orderDeposit[9] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[10]:
                            orderDeposit[10] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[11]:
                            orderDeposit[11] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[12]:
                            orderDeposit[12] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[13]:
                            orderDeposit[13] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[14]:
                            orderDeposit[14] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[15]:
                            orderDeposit[15] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[16]:
                            orderDeposit[16] = DataService.allDepositPayments[i];
                            break;
                        case sortedByLang[17]:
                            orderDeposit[17] = DataService.allDepositPayments[i];
                            break;
                    }
                }
                DataService.allDepositPayments = [];
                //filter for remove a null object
                DataService.allDepositPayments = orderDeposit.filter(Boolean);
            };

            UtilsService.getSportURL = function (DataService, $sce) {
                if (localStorage.getItem("isLogged") == 'false' || !localStorage.getItem("isLogged")) {
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        if (localStorage.getItem("language") && localStorage.getItem("language") != '' &&
                                localStorage.getItem("countryCode") && localStorage.getItem("countryCode") != '') {
                            var language = localStorage.getItem("language");
                            var country = localStorage.getItem("countryCode");

                            if(localStorage.getItem("language") == 'SE') language = 'SV';
                            if(localStorage.getItem("countryCode") == 'SE') country = 'SE';
                            
                            var lang = 'lang=' + language.toLowerCase() + '_' + country;
                            var urlSportsMobile = cyberPlayLocalized.spostUrlMobile + '?' + lang;
                            DataService.sportsMethod.mobileUrlWithoutLogginWindow = urlSportsMobile;
                            DataService.sportsMethod.mobileUrlWithoutLoggin = $sce.trustAsResourceUrl(urlSportsMobile);
                        }
                    }
                } else {
                    UtilsService.fillOfflineObject(DataService);
                    var sessionId = DataService.cmsSessionID;
                    var language = localStorage.getItem("language");
                    var country = localStorage.getItem("countryCode");
                    
                    if(localStorage.getItem("language") == 'SE') language = 'SV';
                    if(localStorage.getItem("countryCode") == 'SE') country = 'SE';
                    
                    var lang = 'lang=' + language.toLowerCase() + '_' + country;
                    var currentSession = 'currentSession=' + sessionId;
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        var urlSportsMobile = cyberPlayLocalized.spostUrlMobile + '?' + lang + '&' + currentSession;
                        DataService.sportsMethod.urlMobile = $sce.trustAsResourceUrl(urlSportsMobile);
                        DataService.sportsMethod.urlMobileWindow = urlSportsMobile;
                    } else {
                        var urlSportsDesktop = cyberPlayLocalized.spostUrlDesktop + '?' + lang + '&' + currentSession;
                        DataService.sportsMethod.urlDesktop = $sce.trustAsResourceUrl(urlSportsDesktop);
                    }
                }
            };

            UtilsService.getCmsSessionID = function ($q, MainMatrixService, DataService, $sce) {
                MainMatrixService.getInstance().getCmsSessionID($q).then(
                        function (result) {
                            DataService.cmsSessionID = result.kwargs.cmsSessionID;
                            document.cookie = "cms=" + result.kwargs.cmsSessionID;
                            document.cookie = "stateLogin=true";
                            localStorage.setItem("stateLogin", "1");
                            UtilsService.getSportURL(DataService, $sce);
                        },
                        function (error) {
                            console.log("error cms", error)
                        }
                );
            };

            function changeLoginWithCmsSessionID(MatrixService, $q, DataService) {
                var parameters = {
                    sessionID: DataService.cmsSessionID,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };
                var promiseloginWithCmsSessionID = MatrixService.loginWithCmsSessionID($q, parameters);
                promiseloginWithCmsSessionID.then(
                        function (success) {
                            //getSessionInfLocal(MatrixService, $q, DataService, MainMatrixService);
                        },
                        function (error) {
                            console.log("Error cmsSessionID", error);
                        }
                );
            }

            function getSessionInfLocal(MatrixService, $q, DataService, MainMatrixService) {
                var promiseSessionInfo = MatrixService.getSessionInfo($q);
                promiseSessionInfo.then(
                        function (success) {
                            var languageByIp = UtilsService.getLenguageCountry(success.userCountry);
                            localStorage.setItem("language", languageByIp.langCode);
                            localStorage.setItem("countryCode", languageByIp.countryCode);

                            DataService.infUser = success;
                            DataService.allDepositPayments = [];

                            var parameters = {
                                filterByCountry: DataService.infUser.userCountry,
                                currency: DataService.infUser.currency,
                                culture: localStorage.getItem("language"),
                                iovationBlackBox: DataService.iovationBlackBox
                            };
                            UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                            UtilsService.getAvailableWithdraw(MatrixService, DataService, $q);
                            UtilsService.getAvailableWithdrawPayments(MainMatrixService, $q, DataService);

                        }, function (error) {
                    console.log("-Error-getSessionInfLocal--", error);
                }
                );
            }

            UtilsService.loginMobileGame = function ($q, DataService, MatrixService, MatrixCasinoService, MainMatrixService, $sce, credentials, $base64) {
                var parameters = {
                    usernameOrEmail: credentials.usr,
                    password: credentials.pw,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };

                var promiseLogin = MatrixService.login(parameters, $q);
                promiseLogin.then(
                        function (success) {
                            DataService.isLogged = true;
                            localStorage.setItem("isLogin", 1);
                            localStorage.setItem("isLogged", true);
                            document.cookie = "_ln1="+DataService.credentialsUser.usr;
                            
                            var stringCredentials = '{"usr":"'+credentials.usr+'", "pw":"'+credentials.pw+'"}';
                            localStorage.setItem("_ln", $base64.encode(stringCredentials));
                            
                            localStorage.setItem("isLogged", true);
                            UtilsService.getCmsSessionID($q, MainMatrixService, DataService, $sce);
                            
                            UtilsService.getFavorites($q, MatrixCasinoService, DataService);
                            DataService.gamesSection.games = [];
                            UtilsService.loadGamesLocal(MatrixCasinoService, $q, DataService);
                            
                            getSessionInfLocal(MatrixService, $q, DataService, MainMatrixService);
                        },
                        function (error) {
                            console.log("---ERROR--login-----", error)
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
            };
            
            UtilsService.loadGamesLocal = function (MatrixCasinoService, $q, DataService) {
                DataService.gamesSection.selectedOrder = localStorage.getItem("sort_menu");
                
                if (localStorage.getItem("gameCategory") == 'all') {
                    DataService.gamesSection.selectedCategory = [];
                }else{
                    DataService.gamesSection.selectedCategory = [localStorage.getItem("gameCategory")];
                }
                
                var culture = UtilsService.getCorrectlanguageCode();
                var promiseGames = MatrixCasinoService.getGames($q, DataService, '', culture);
                promiseGames.then(
                        function (result) {
                        }, function (error) {
                    console.log("error", error);
                }
                );
            };

            UtilsService.isAppleDevice = function () {
                var str = navigator.appVersion + "";
                var patt = /iPhone|iPad/g;
                var isAppleDevice = patt.test(str);
                return isAppleDevice;
            };

            UtilsService.isIphoneDevice = function () {
                var str = navigator.appVersion + "";
                var patt = /iPhone/g;
                var isAppleDevice = patt.test(str);
                return isAppleDevice;
            };
            
            UtilsService.isMobileDevice = function () {
                var str = navigator.appVersion + "";
                var patt = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/g;
                var isMobileDevice = patt.test(str); 
                return isMobileDevice;
            };

            UtilsService.fixScrollModalApple = function () {
                $('body').css('overflow', 'hidden');
                $('body').css('position', 'fixed');
            };

            UtilsService.enableScrollNormal = function () {
                $('body').css('overflow', '');
                $('body').css('position', 'static');
            };
            
            UtilsService.getNewIovationBlackBox = function(DataService){     
               var sent = false;
               var timeoutId;

               var urlFile = localStorage.getItem("urlIovation");
                
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = urlFile;
                document.head.appendChild(script);

                function useBlackboxString(intervalCount) {
                    if (typeof ioGetBlackbox !== 'function') {return;}

                    var bbData = ioGetBlackbox();

                    send_bb(bbData.blackbox);

                    if (bbData.finished) {
                        clearTimeout(timeoutId);
                        DataService.iovationBlackBox = bbData.blackbox;
                        document.getElementById('iovationBlackBox').value = bbData.blackbox;
                        //console.log( "bbData.blackbox UtilS ",bbData.blackbox);
                        //return bbData.blackbox;
                    }
                }
                if(localStorage.getItem("urlIovation") !== null){
                    timeoutId = setInterval(useBlackboxString, 2000);
                }
                function send_bb( bb ) { // function to process the blackbox
                       if ( sent ) return;
                       // process blackbox
                       // send blackboc to the methods which requires Iovation check
                       sent = true;
                }
                
            };
            
            
            return UtilsService;
        });
