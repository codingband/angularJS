'use strict';

/**
 * @ngdoc overview
 * @name cyberplayerThemeV20App
 * @description
 * # cyberplayerThemeV20App
 *
 * Main module of the application.
 */
angular.module('cyberplayerThemeV20App', [
            'ngRoute',
            'ngAnimate',
            'ngAria',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngTouch',
            'ui.bootstrap',
            'base64',
            'ngOdometer'
        ])
        .config(function ($routeProvider, $locationProvider) {
            
            $locationProvider.html5Mode(true);
            //$locationProvider.hashPrefix('!');
            
            var resolveGeoIp = function($q, $http) {
                
                var deferred = $q.defer();
                var getLanguageCountry = function (country_code) {
                    var languageByIp = {
                        countryCode: '',
                        langCode: ''
                    };
                    switch (country_code) {
                        case 'NO': languageByIp.countryCode = 'NO'; languageByIp.langCode = 'NO'; break;
                        //case 'SE': languageByIp.countryCode = 'SE'; languageByIp.langCode = 'SV'; break;
                        case 'SE': languageByIp.countryCode = 'SE'; languageByIp.langCode = 'SE'; break;
                        case 'FI': languageByIp.countryCode = 'FI'; languageByIp.langCode = 'FI'; break;
                        case 'DE': languageByIp.countryCode = 'DE'; languageByIp.langCode = 'DE'; break;
                        case 'GB': languageByIp.countryCode = 'GB'; languageByIp.langCode = 'UK'; break;
                        case 'CA': languageByIp.countryCode = 'CA'; languageByIp.langCode = 'CA'; break;
                        case 'AU': languageByIp.countryCode = 'AU'; languageByIp.langCode = 'AU'; break;
                        case 'NZ': languageByIp.countryCode = 'NZ'; languageByIp.langCode = 'NZ'; break;
                        case 'AT': languageByIp.countryCode = 'AT'; languageByIp.langCode = 'DE'; break;
                        default: languageByIp.countryCode = country_code; languageByIp.langCode = 'EN'; break;
                    }
                    return languageByIp;
                }
                var onSuccess = function (location) { console.log("onSuccess");
                      localStorage.setItem("language", "");
                      var language = localStorage.getItem("language");
                      var countryCode = localStorage.getItem("countryCode");
                      var languageByIp = getLanguageCountry(location.country.iso_code);
                      
                      if (language === null || language === "") {
                          localStorage.setItem("language", languageByIp.langCode);
                      }
                      if (countryCode === null || countryCode === "") {
                          localStorage.setItem("countryCode", languageByIp.countryCode);
                      }
                      console.log("Success resolver");
                      deferred.resolve("Success");
                  };

                  var onError = function (error) {
                    console.log("onError in geoip2", error);
                    localStorage.setItem("language", "EN");
                    localStorage.setItem("countryCode", "GB");
                    deferred.resolve("error value");
                  };
        
                geoip2.country(onSuccess, onError);

                return deferred.promise;
            }
            
            $routeProvider
                    .when('/', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'home',
                        resolve: {
                                geoIp: resolveGeoIp
                              }
                    })
                    .when('/en/error404', {
                        templateUrl: 'views/main/error404.html',
                        controller: 'Error404Ctrl',
                        controllerAs: 'error'
                    })
                    .when('/:lang', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'homeLang'
                    })
                    .when('/:lang/verification-email/:key', {
                        templateUrl: 'views/main/home.html',
                        controller: 'HomeCtrl',
                        controllerAs: 'verification-email'
                    })
                    .when('/:lang/casino/verification-email/:key', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'casino/verification-email'
                    })
                    .when('/:lang/casino/verification-newemail/:keynewemail', {
                        templateUrl: 'views/main/home.html',
                        controller: 'HomeCtrl',
                        controllerAs: 'verification-newemail'
                    })
                    .when('/:lang/casino/reset-password/:keyPass', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'casino/reset-password'
                    })
                    .when('/:lang/casino', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'casino'
                    })
                    .when('/:lang/casino/promotions', {
                        templateUrl: 'views/casino/promotions.html',
                        controller: 'PromotionsCtrl',
                        controllerAs: 'promotions'
                    })
                    .when('/:lang/casino/tripVegas', {
                        templateUrl: 'views/casino/tripVegas.html',
                        controller: 'TripvegasCtrl',
                        controllerAs: 'tripvegas'
                    })
                    .when('/:lang/casino/:marketingPageName', {
                        templateUrl: 'views/casino/marketingPage.html',
                        controller: 'MarketingpageCtrl',
                        controllerAs: 'marketingpage'
                    })
                    .when('/:lang/payments', {
                        templateUrl: 'views/payments/payments.html',
                        controller: 'PaymentsCtrl',
                        controllerAs: 'payments'
                    })
                    .when('/:lang/news', {
                        templateUrl: 'views/news/home.html',
                        controller: 'NewsCtrl',
                        controllerAs: 'news'
                    })
                    .when('/:lang/:gamelang/:slug', {
                        templateUrl: 'views/casino/gamePage.html',
                        controller: 'gamePageCtrl',
                        controllerAs: 'gamePage'
                    })
                    .when('/:lang/aboutus', {
                        templateUrl: 'views/main/aboutus.html',
                        controller: 'AboutUsCtrl',
                        controllerAs: 'aboutus'
                    })
                    .when('/:lang/rules', {
                        templateUrl: 'views/main/rules.html',
                        controllerUrl: 'rulesCtrl',
                        controllerAs: 'rules'
                    })
                    .when('/:lang/security', {
                        templateUrl: 'views/main/security.html',
                        controllerUrl: 'main/securityCtrl',
                        controllerAs: 'security'
                    })
                    .when('/:lang/affiliates', {
                        templateUrl: 'views/main/affiliates.html',
                        controllerUrl: 'main/affiliatesCtrl',
                        controllerAs: 'affiliates'
                    })
                    .when('/:lang/mobile', {
                        templateUrl: 'views/main/mobile.html',
                        controller: 'mobileCtrl',
                        controllerAs: 'mobile'
                    })
                    .when('/:lang/security-page', {
                        templateUrl: 'views/main/securityPage.html',
                        controller: 'SecurityPageCtrl',
                        controllerAs: 'security-page'
                    })
                    .when('/:lang/contactus', {
                        templateUrl: 'views/main/contactUs.html',
                        controller: 'ContactUsCtrl',
                        controllerAs: 'contactus'
                    })
                    .when('/:lang/betting-rules', {
                        templateUrl: 'views/main/bettingRules.html',
                        controllerUrl: 'main/bettingRulesCtrl',
                        controllerAs: 'betting-rules'
                    })
                    .when('/:lang/rules', {
                        templateUrl: 'views/main/rules.html',
                        controller: 'RulesCtrl',
                        controllerAs: 'rules'
                    })
                    .when('/:lang/casino-bonus-terms', {
                        templateUrl: 'views/main/bonusTerms.html',
                        controller: 'BonusTermsCtrl',
                        controllerAs: 'casino-bonus-terms'
                    })
                     .when('/:lang/sports-bonus-terms', {
                        templateUrl: 'views/main/sportsBonusTerms.html',
                        controller: 'SportsBonusTermsCtrl',
                        controllerAs: 'sports-bonus-terms'
                    })
                    .when('/:lang/gamingenvironment', {
                        templateUrl: 'views/main/gamingEnviroment.html',
                        controller: 'GamingEnviromentCtrl',
                        controllerAs: 'gamingenvironment'
                    })
                    .when('/:lang/help', {
                        templateUrl: 'views/main/help.html',
                        controller: 'HelpCtrl',
                        controllerAs: 'help'
                    })
                    .when('/:GB?affid', {
                        templateUrl: 'views/marketing/gb.html',
                        controller: 'GbCtrl',
                        controllerAs: 'GB'
                    })
                    .when('/:lang/sports', {
                        templateUrl: 'views/sports/sportHome.html',
                        controller: 'SportCtrl',
                        controllerAs: 'sports/sport'
                    })
                    .when('/:lang/opentransactions', {
                        templateUrl:  'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'casino/transactions'
                    })
                    .when('/:lang/:provider', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'homeLang'
                    })
                    .when('/:lang/live-casino', {
                        templateUrl: 'views/casino/home.html',
                        controller: 'CasinoCtrl',
                        controllerAs: 'casino/live-casino'
                    })
                    .otherwise({
                        redirectTo: '/en/error404'
                    });
        });
        
