'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainCountriesctrlCtrl
 * @description
 * # MainCountriesctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
        .controller('CountriesCtrl', function ($scope, DataService, I18N, UtilsService, $location, MainMatrixService, $q, $route) {
            $scope.data = DataService;

            $scope.i18n = I18N[DataService.language];
            $scope.languageI18n = "";
            if ($scope.i18n['language'] !== undefined) {
                $scope.languageI18n = $scope.i18n['language'];
            }

            var orderFlags = [];

            var EU = {
                code: "EU",
                name: "EU"
            };
            orderFlags[0] = EU;

            $scope.filterCountries = function (element) {

                var res = false;
                if (element.code === 'AT' || element.code === 'GB' || element.code === 'NO'
                        || element.code === 'SE' || element.code === 'FI' || element.code === 'DE'
                        || element.code === 'CA' || element.code === 'AU' || element.code === 'NZ') {
                    res = true;
                }
                return res;
            };

            $scope.$watch(function () {
                var i;
                for (i = 0; i < $scope.data.countries.length; i++) {
                    switch ($scope.data.countries[i].code) {
                        case "UE":
                            orderFlags[0] = null;
                            break;
                        case "NO":
                            orderFlags[1] = $scope.data.countries[i];
                            break;
                        case "SE":
                            orderFlags[2] = $scope.data.countries[i];
                            break;
                        case "FI":
                            orderFlags[3] = $scope.data.countries[i];
                            break;
                            //case "UK":
                        case "GB":
                            orderFlags[4] = $scope.data.countries[i];
                            break;
                        case "DE":
                            orderFlags[5] = $scope.data.countries[i];
                            break;
                        case "CA":
                            orderFlags[6] = $scope.data.countries[i];
                            break;
                        case "AU":
                            orderFlags[7] = $scope.data.countries[i];
                            break;
                        case "NZ":
                            orderFlags[8] = $scope.data.countries[i];
                            break;
                    }
                }
                $scope.data.orderFlags = orderFlags;
            });

            $scope.getClassCountry = function (countryCode) {
                return "flag-icon flag-icon-" + countryCode.toLowerCase();
            };

            $scope.getLanguage = function (countryCode) {
                var res = "";

                switch (countryCode) {
                    case "AT":
                            res = "DE";
                        break;
                    case "GB":
                            res = "UK";
                        break;
                    case "NO":
                            res = "NO";
                        break;
                    /*case "SE":
                            res = "SV";
                        break;*/
                    case "SE":
                            res = "SE";
                        break;    
                    case "FI":
                            res = "FI";
                        break;
                    case "DE":
                            res = "DE";
                        break;
                    case "CA":
                            res = "CA";
                        break;
                    case "AU":
                            res = "AU";
                        break;
                    case "NZ":
                            res = "NZ";
                        break;
                    default:
                        res = "EN";
                }
                return res;
            };

            $scope.changeLanguage = function (newLang, newCountryCode) {

                $('#table-jackpots').vTicker('remove');
                $('#table-winner').vTicker('remove');
                $('#last-winners').vTicker('remove');

                localStorage.setItem("language", newLang);
                localStorage.setItem("countryCode", newCountryCode);
                DataService.language=newLang;
                $scope.i18n = I18N[DataService.language]; 
                
                var location = window.location.pathname; 
                UtilsService.loadPageByLanguage(location, newLang, $location, DataService, I18N, $route);
            };

            $scope.showListCountries = function () {
                $('#panelSlideCountries').toggle('slide', {direction: "down"}, 'slow');
                $('#buttonSlideCountries').hide('slide', {direction: "down"}, 'slow');
            };

            $scope.hidePanelCountries = function () {
                $('#panelSlideCountries').toggle('slide', {direction: "down"}, 'slow');
                $('#buttonSlideCountries').show('slide', {direction: "down"}, 'slow');
            };
        });
