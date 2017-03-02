'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/dataService
 * @description
 * # common/dataService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
        .factory('DataService', function () {
            var getLanguage = function(){
                var langPath = window.location.pathname.split("/");
                var codeLang = '';
                if(langPath[1].length === 2 && typeof langPath[2] !== 'undefined'  && langPath[2].length > 0){
                    
                    switch (langPath[1].toUpperCase()) {
                        case 'DE': codeLang = 'DE'; break;
                        case 'FI': codeLang = 'FI'; break;
                        case 'NO': codeLang = 'NO'; break;
                        //case 'SV': codeLang = 'SV'; break;
                        case 'SE': codeLang = 'SE'; break;
                        case 'EN': codeLang = 'EN'; break;
                        case 'UK': codeLang = 'UK'; break;
                        case 'CA': codeLang = 'CA'; break;
                        case 'AU': codeLang = 'AU'; break;
                        case 'NZ': codeLang = 'NZ'; break;
                        default: codeLang = 'EN';
                    }
                    if (localStorage.getItem("language") !== codeLang) {
                        localStorage.setItem("language", codeLang);
                    }
                }else{
                    codeLang = 'EN'
                }
                
                return codeLang;
            }
            
            var DataService = {
                depositenellerT: "0",
                errorTransfer: "",
                cscNumberSelectedT: "",
                bonusCodeT: "",
                amountTo: "0",
                modalDeposit: "",
                defaultLang: "EN",
                imageFolder: cyberPlayLocalized.images,
                modalLimit: '',
                currencies: [],
                countries: [],
                orderFlags: [],
                prefixes: [],
                gameVendors: [],
                sortByProvider: false,
                sortByNewIn: false,
                displayAllGamesCategory: false,
                newInFilderCategories:[],
                isLogged: false,
                openLogin: false,
                showLive: false,
                loguinUserPopup: false,
                infUser: "",
                section: "",
                loadmore: 16,
                pageIndex: 1,
                urlLanguageGame:"slot",
                urlGameType:"VIDEO SLOTS",
                urlInitGame:'',
                clicLoadmore:false,
                playSection: localStorage.getItem("playSection") !== "" ? localStorage.getItem("playSection") : "",
                gamesSection: {
                    categories: [],
                    selectedDisplay: "grid",
                    selectedCategory: [localStorage.getItem("gameCategory") ? localStorage.getItem("gameCategory") : 'VIDEOSLOTS'],
                    selectedOrder: '',
                    games: [],
                    gamesTmp: [],
                    gamesLoadMore: [],
                    selectedFilterValue: '',
                    favouriteGames: [],
                    allGames: [],
                    currentIndexPagination: 1,
                    pageSize: 16,
                    loadMorePage: 16,
                    unableLoadMore: false,
                    favorite: [],
                    sizeCategory:0,
                    pageGameModule: 16,
                    loadMoresPageQuantity:1,
                    presLoadMore:false,
                    gameSavePaginator:[],
                    pageActualGamelive:1,
                    categoryLive:{
                        code: 'live-casino',
                        name: 'live',
                        isVisible: false
                    },
                    lengthFavourite: 0,
                    sortBy: '',
                    slugMobileGame: '',
                    idLiveGame: '',
                    gameAvailableByCountry: false
                },
                selectedCountryCode: localStorage.getItem("countryCode") ? localStorage.getItem("countryCode") : 'GB',
                language: localStorage.getItem("language") ? localStorage.getItem("language") : getLanguage(),
                defaultCurrency: 'EUR',
                allWithdrawPayments: [],
                allDepositPayments: [],
                email: '',
                withdrawPaymentCodeDefault: 'Bank',
                withdrawBankPayment: {},
                tabName: 'profile',
                urlTpl: '',
                allTransactionHistory: [],
                betslipSystem: [],
                bettingSlip: [],
                liveMatchesMenu: [],
                stateSelectedBet: false,
                paymentsSection: {
                    optionName: "",
                    optionWithdraw: "",
                    optionBank: ""
                },
                wallet: {
                    accountID: "",
                    securityID: ""
                },
                prepaidCards: {
                    voucherNumber: ""
                },
                modalDialogs: {
                    modalConfirmationPayment: "",
                    modalDepositPaymentDialog: "",
                    modalCancelDialog: "",
                    modalDialogBox: "",
                    messageModal: "",
                    modalCreditcard: ""
                },
                passKey: "",
                winners: [],
                reasons: [],
                periods: [],
                externalPaymentsForm: {
                    skrillForm: "",
                    registeredCreditCard: "",
                    newCreditCard: "",
                    depositWithoutAmountForm: "",
                    fundSendForm: ""
                },
                pidDeposit: "",
                mobile: {openGame: false},
                codeResetPassword: '',
                codeRegisterEmail: '',
                codeNewEmail: '',
                stopvticker: {
                    stopJackpots: '0',
                    stopWinners: '0'
                },
                offlinevalues: {
                    offlineCode: '',
                    userRegisterDate: '',
                    firstDeposit: false
                },
                sportsMethod:{
                    login: false,
                    deposit: false,
                    logout: false,
                    urlDesktop: '',
                    urlMobile: '',
                    urlMobileWindow: '',
                    mobileUrlWithoutLoggin: '',
                    mobileUrlWithoutLogginWindow:'',
                    transactionFailed: false
                },
                cultureGroupId: '',
                cmsSessionID:'',
                iovation:{
                    "enabled": false,
                    "javaScriptUrl": ''
                },
                accountStatementDates:{
                    "dateStart": '',
                    "dateEnd": ''
                },
                showSesionExpired:true,
                credentialsUser: {
                    usr: '',
                    pw: ''
                },
                iovationBlackBox: '',
                isGameinNewInCategory:true,
                defaultBtag:'654532_9F3C50474F964DE58CDB6C86E437B8A3',
                openMessagegame: false,
                anonymousFunMode:''
            };
            return DataService;
        });
