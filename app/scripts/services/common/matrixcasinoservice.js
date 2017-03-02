'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/matrixCasinoService
 * @description
 * # common/matrixCasinoService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
        .factory('MatrixCasinoService', function ($http, MatrixService) {
            var MatrixCasinoService = {
                type: "MatrixCasinoService",
                getDefaultData: function (DataService, $q) {

                    var promiseCurrencies = MatrixService.getCurrencies($q);
                    promiseCurrencies.then(
                            function (success) {
                                DataService.isLoadedCurrencies = true;
                                DataService.currencies = success.kwargs;
                            }, function (error) {
                    }
                    );

                    var promiseCountries = MatrixService.getCountries($q, DataService);
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

                }
            };

            MatrixCasinoService.getCategoryGames = function ($q) {
                var deferred = $q.defer();
                MatrixService.sessionConnection.call("/casino#getGameCategories").then(
                        function (result) {
                            deferred.resolve(result);
                        }
                , function (error) {
                    deferred.reject(error);
                }
                );

                return deferred.promise;
            };

            MatrixCasinoService.getJackpotsGame = function ($q, DataService, languageCode) {
                var deferred = $q.defer();

                var parameters = {
                    filterByPlatform: [],
                    expectedGameFields: 1048585,
                    culture: localStorage.getItem("language")
                };

                MatrixService.sessionConnection.call("/casino#getJackpots", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                }
                );

                return deferred.promise;
            };

            var getCountry = function (DataService, module, parameters, $q) {

                if (DataService.isLogged) {
                    var promiseSessionInfo = MatrixService.getSessionInfo($q);
                    promiseSessionInfo.then(
                            function (success) {
                                var countryUser = success.userCountry;
                                getMostPopularGamesByCountry(DataService, module, parameters, countryUser);
                            }, function (error) {
                        console.log(error);
                    }
                    );
                }
                if (!DataService.isLogged) {
                    jQuery.ajax({
                        url: '//freegeoip.net/json/',
                        type: 'GET',
                        dataType: 'jsonp',
                        success: function (location) {
                            getMostPopularGamesByCountry(DataService, module, parameters, location.country_code);
                        }
                    });
                }
            };

            var getMostPopularGamesByCountry = function (DataService, module, parameters, country) {

                var category = '';
                if (parameters.filterByCategory[0] !== 'live') {
                    if (parameters.filterByCategory[0] === undefined || parameters.filterByCategory[0] === '') {
                        category = 'allgames';
                    } else {
                        category = parameters.filterByCategory[0];
                    }

                    var paramFilter = {
                        country_code: country, 
                        category: category
                    };
                    jQuery.ajax({
                        type: "POST",
                        url: 'wp-admin/admin-ajax.php',
                        data: {
                            'action': 'most_populargames',
                            'paramToFilter': paramFilter
                        },
                        dataType: 'json',
                        success: function (data) {
                            var objGames = data;
                            var gamesAll = objGames;
                            filterGames(DataService, gamesAll, module);
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            };

            var filterGames = function (DataService, gamesAll, module, loadmore) {
                
                var i, k;
                var games = gamesAll;
                var tempGames = [];

                if (loadmore !== 'loadmore') {
                    games = gamesAll;
                }
                
                if (DataService.gamesSection.selectedOrder === 'top') {
                    var value = (DataService.language + '_').toLowerCase();
                    var tempGamesByTag = [];
                    var tempObjGame = '';

                    for (var i in games) {
                        tempObjGame = games[i];
                        for (var j in tempObjGame.tags) {
                            if (tempObjGame.tags[j].indexOf(value) > -1) {
                                var tagPosition = tempObjGame.tags[j];
                                var number = tagPosition.split('_');

                                tempObjGame["topPosition"] = parseInt(number[1]);
                                tempGamesByTag.push(tempObjGame);
                            }
                        }
                    }

                    tempGamesByTag.sort(function (obj1, obj2) {
                        // Ascending: first age less than the previous
                        return obj1.topPosition - obj2.topPosition;
                    });
                    games = tempGamesByTag;
                }
                for (i = 0, k = -1; i < games.length; i++) {
                    if (i % module === 0) {
                        k++;
                        tempGames[k] = [];
                    }
                    if (DataService.infUser !== '') {
                        var isRestricted = false;
                        for (var index in games.restrictedTerritories) {
                            if (games.restrictedTerritories[index] === DataService.infUser.userCountry)
                                isRestricted = true;
                        }
                        if (!isRestricted) {
                            tempGames[k].push(games[i]);
                        }
                        
                        if(games[i].newGame){
                            var category = DataService.newInFilderCategories.indexOf(games[i].categories[0]);
                            
                            if(category === -1){
                                DataService.newInFilderCategories.push(games[i].categories[0]);
                            }
                                                    
                        }
                        
                    } else {           
                        
                        if(games[i].newGame){
                            var category = DataService.newInFilderCategories.indexOf(games[i].categories[0]);
                            
                            if(category === -1){
                                DataService.newInFilderCategories.push(games[i].categories[0]);
                            }
                                                    
                        }
                        
                        tempGames[k].push(games[i]);
                    }
                }

                if (loadmore !== 'loadmore') {
                    DataService.gamesSection.games = tempGames;

                } else {
                    if(DataService.gamesSection.games[0]!==undefined){
                        DataService.gamesSection.games[0] = DataService.gamesSection.games[0].concat(tempGames[0]);
                    }
                }
            };
            MatrixCasinoService.getGames = function ($q, DataService, loadmore, languageCode) {
                var deferred = $q.defer();
                var live = false;
                var module = DataService.gamesSection.pageGameModule;
                
                   var parameters = MatrixCasinoService.getParamentersForFilterGames(
                        DataService.gamesSection.selectedCategory,
                        DataService.gamesSection.selectedOrder, DataService.gamesSection.selectedFilterValue,
                        DataService.gameVendors.selectedOrderVendor, DataService, languageCode);
                
                if (loadmore !== 'loadmore') {
                    DataService.gamesSection.games = [];
                }
                var gamesAll = [];
                
                MatrixService.sessionConnection.call("/casino#getGames", [], parameters).then(
                        function (result) {
                            if (DataService.gamesSection.selectedOrder === '/newgame') {
                                gamesAll = result.kwargs.games;
                                gamesAll.reverse();
                            } else {
                                gamesAll = result.kwargs.games;
                            }

                            filterGames(DataService, gamesAll, module, loadmore);
                            deferred.resolve(result);
                        }, function (error) { console.log("result error", error)
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            MatrixCasinoService.getGamesTmp = function ($q, DataService, loadmore, languageCode) {
                var deferred = $q.defer();

                var module = 0;
                if (loadmore !== 'loadmore') {
                    module = 16;
                } else {
                    module = DataService.gamesSection.loadMorePage;
                }
                var parameters = MatrixCasinoService.getParamentersForFilterGamesTmp(
                        DataService.gamesSection.selectedCategory,
                        DataService.gamesSection.selectedOrder, DataService.gamesSection.selectedFilterValue,
                        DataService.gameVendors.selectedOrderVendor, languageCode);

                DataService.gamesSection.gamesTmp = [];
                DataService.gamesSection.allGames = [];

                MatrixService.sessionConnection.call("/casino#getGames", [], parameters).then(
                        function (result) {
                            if (DataService.gamesSection.selectedOrder === '/newgame') {
                                var gamesAll = result.kwargs.games;
                                gamesAll.reverse();
                            } else {
                                var gamesAll = result.kwargs.games;
                            }
                            var i, k;
                            var isCategoriesMini;
                            var stateGames = false;

                            var games = [];

                            var y, x;

                            for (y = 0; y < gamesAll.length; y++) {
                                isCategoriesMini = false;
                                if (gamesAll[y].name.indexOf("Mini") > -1) {
                                    isCategoriesMini = true;
                                    for (x = 0; x < gamesAll[y].categories.length; x++) {

                                        if (gamesAll[y].categories[x] === "MINIGAMES") {
                                            isCategoriesMini = true;
                                        }
                                    }
                                }

                                if (!isCategoriesMini) {
                                    if (gamesAll[y].thumbnail !== '') {
                                        games.push(gamesAll[y]);
                                    }
                                }
                            }

                            for (i = 0, k = -1; i < games.length; i++) {
                                if (i % module === 0) {
                                    k++;
                                    DataService.gamesSection.gamesTmp[k] = [];
                                }
                                if (DataService.infUser !== '') {
                                    var isRestricted = false;
                                    for (var index in games.restrictedTerritories) {
                                        if (games.restrictedTerritories[index] === DataService.infUser.userCountry)
                                            isRestricted = true;
                                    }
                                    if (!isRestricted) {
                                        DataService.gamesSection.gamesTmp[k].push(games[i]);
                                    }
                                } else {
                                    DataService.gamesSection.gamesTmp[k].push(games[i]);
                                }
                            }
                            deferred.resolve(result);
                        }
                , function (error) {
                    deferred.reject(error);
                }
                );
                return deferred.promise;
            };
            
            var getFields = function(){
                var FIELDS = {
                    Slug: 1, Vendor: 2, Name: 4, ShortName: 8, Description: 16, AnonymousFunMode: 32, FunMode: 64,
                    RealMode: 128, NewGame: 256, License: 512, Popularity: 1024,
                    Width: 2048, Height: 4096, Thumbnail: 8192, Logo: 16384, BackgroundImage: 32768,
                    Url: 65536, HelpUrl: 131072, Categories: 262144, Tags: 524288, Platforms: 1048576,
                    RestrictedTerritories: 2097152, TheoreticalPayOut: 4194304, BonusContribution: 8388608,
                    JackpotContribution: 16777216, FPP: 33554432, Languages: 17179869184, Limitation: 536870912,
                    Currencies: 8589934592, 
                    // live casino special fields
                    TableID: 67108864, OpenStatus: 134217728, OpeningTime: 268435456, Category: 1073741824,
                    NewTable: 2147483648, VipTable: 4294967296
                };
                return FIELDS;
            };
              
            MatrixCasinoService.getParamentersForFilterGames = function (category, orderBy, filterValue, vendorName, DataService, languageCode) {
                var FIELDS = getFields();
                var field = "";
                var order = "";
                var newGame = '';
                var vendor = [];
                var filterCountry = [];
                var sortFieldsValues = [];
                var filterByNameValue = [];
                
                if(filterValue != '') filterByNameValue = [filterValue];
                
                if (orderBy === "/mostpopular") {
                    field = FIELDS.Popularity;
                    filterCountry = [];
                    vendor = [];
                    sortFieldsValues = [{field: field, order: "DESC"}]
                } else if (orderBy === "/alphabetically") {
                    field = FIELDS.Name;
                    filterCountry = [];
                    vendor = [];
                    sortFieldsValues = [{field: field, order: "ASC"}]
                } else if (orderBy === "/provider") {
                    field = FIELDS.Vendor;
                    filterCountry = [];
                    vendor = [vendorName];
                    sortFieldsValues = [{field: field, order: "DESC"}]
                } else if (orderBy === "/newgame") {
                    field = FIELDS.NewGame;
                    order = "DESC";
                    newGame = true;
                    filterCountry = [];
                    vendor = [];
                    sortFieldsValues = []
                } else if (orderBy === "top") {
                    DataService.gamesSection.pageSize = 1000;
                    field = FIELDS.Tags;
                    filterCountry = [DataService.language];
                    vendor = [];
                    sortFieldsValues = [{field: field, order: "ASC"}];
                }
                if (category[0] === 'live') {
                    var parameters = {
                        filterByID: [],
                        filterByVendor: vendor,
                        filterByCategory: [],
                        filterByTag: filterCountry,
                        filterByPlatform: [],
                        filterByAttribute: {newGame: newGame},
                        expectedFields: FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + 
                                FIELDS.Description + FIELDS.Categories + FIELDS.Tags + FIELDS.Url + 
                                FIELDS.Thumbnail + FIELDS.FunMode + FIELDS.RealMode + FIELDS.NewGame + 
                                FIELDS.RestrictedTerritories + FIELDS.TableID + FIELDS.OpenStatus+ FIELDS.OpeningTime + 
                                FIELDS.Category + FIELDS.NewTable + FIELDS.VipTable,//34359738367,
                        expectedFormat: "array",
                        pageIndex: DataService.gamesSection.currentIndexPagination,
                        pageSize: DataService.gamesSection.pageSize,
                        sortFields: sortFieldsValues,
                        culture: localStorage.getItem("language")
                    };

                } else {
                    var parameters = {
                        filterByName: filterByNameValue, // String Array
                        filterBySlug: [], // String Array
                        filterByVendor: vendor, // String Array
                        filterByCategory: category, // String Array
                        filterByTag: filterCountry, // String Array
                        filterByAttribute: {"newGame": newGame},
                        expectedFields: FIELDS.Slug + FIELDS.Popularity + FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + 
                                FIELDS.ShortName + FIELDS.Description + FIELDS.Categories + FIELDS.Tags + FIELDS.Url + 
                                FIELDS.Thumbnail + FIELDS.FunMode + FIELDS.AnonymousFunMode+ FIELDS.RealMode + FIELDS.NewGame + FIELDS.RestrictedTerritories,
                        expectedFormat: 'array', // String
                        pageIndex: DataService.gamesSection.currentIndexPagination,
                        pageSize: DataService.gamesSection.pageSize,
                        sortFields: sortFieldsValues,
                        culture: localStorage.getItem("language")
                    };
                }

                return parameters;
            };
            MatrixCasinoService.getParamentersForFilterGamesTmp = function (category, orderBy, filterValue, vendorName, languageCode) {
                
                var FIELDS = getFields();
                
                var field = "";
                var order = "";
                var newGame = '';
                var vendor = [];
                if (orderBy === "/mostpopular") {
                    field = FIELDS.Popularity;
                    order = "DESC";
                    vendor = [];
                } else if (orderBy === "/alphabetically") {
                    field = FIELDS.Name;
                    order = "ASC";
                    vendor = [];
                } else if (orderBy === "/provider") {
                    field = FIELDS.Vendor;
                    order = "DESC";
                    vendor = [vendorName];
                } else if (orderBy === "/newgame") {
                    field = FIELDS.NewGame;
                    newGame = true;
                    order = "DESC";
                    vendor = [];
                } 
                if (category[0] === 'live') {
                    var parameters = {
                        filterByID: [],
                        filterByVendor: vendor,
                        filterByCategory: [],
                        filterByTag: [],
                        filterByPlatform: [],
                        filterByAttribute: {"newGame": newGame},
                        expectedFields: FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + 
                                FIELDS.Description + FIELDS.Categories + FIELDS.Tags + FIELDS.Url + 
                                FIELDS.Thumbnail + FIELDS.FunMode + FIELDS.RealMode + FIELDS.NewGame + 
                                FIELDS.RestrictedTerritories + FIELDS.TableID + FIELDS.OpenStatus+ FIELDS.OpeningTime + 
                                FIELDS.Category + FIELDS.NewTable + FIELDS.VipTable,//34359738367,
                        expectedFormat: "array",
                        pageIndex: 1,
                        pageSize: 0,
                        sortFields: [{field: field, order: order}],
                        culture: localStorage.getItem("language")
                    };

                } else {
                    var parameters = {
                        filterByName: [filterValue], // String Array
                        filterBySlug: [], // String Array
                        filterByVendor: vendor, // String Array
                        filterByCategory: category, // String Array
                        filterByTag: [], // String Array
                        filterByAttribute: {"newGame": newGame},
                        expectedFields: FIELDS.Slug + FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + FIELDS.Description + FIELDS.Categories + FIELDS.Tags + FIELDS.Url + FIELDS.Thumbnail + FIELDS.AnonymousFunMode+ FIELDS.FunMode + FIELDS.RealMode + FIELDS.NewGame + FIELDS.RestrictedTerritories, // Integer Number
                        expectedFormat: 'array', // String
                        pageIndex: 1,
                        pageSize: 0,
                        sortFields: [{field: field, order: order}],
                        culture: localStorage.getItem("language")
                    };
                }

                return parameters;
            };
            MatrixCasinoService.getLiveCasinoTables = function ($q, DataService, loadmore, languageCode) {
                var deferred = $q.defer();
                var module = 16;
                
                if (loadmore !== 'loadmore') {
                    DataService.gamesSection.games = [];
                }
                var parameters = MatrixCasinoService.getParamentersForFilterGames(
                        DataService.gamesSection.selectedCategory,
                        DataService.gamesSection.selectedOrder, DataService.gamesSection.selectedFilterValue,
                        DataService.gameVendors.selectedOrderVendor, DataService, languageCode);
                        
                DataService.gamesSection.allGames = [];
                MatrixService.sessionConnection.call("/casino#getLiveCasinoTables", [], parameters).then(
                        function (result) {
                            var gamesAll = result.kwargs.tables;
                            filterGames(DataService, gamesAll, module, loadmore);
                            deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                }

                );
                return deferred.promise;
            };
            MatrixCasinoService.getLiveCasinoTablesPages = function ($q, DataService, loadmore, languageCode) {
                var deferred = $q.defer();
                DataService.gamesSection.gamesTmp = [];
                DataService.gamesSection.allGames = [];
                var module = 0;
                if (loadmore !== 'loadmore') {
                    module = 16;
                } else {
                    module = DataService.gamesSection.loadMorePage;
                }
                
                var parameters = MatrixCasinoService.getParamentersForFilterGamesTmp(
                        DataService.gamesSection.selectedCategory,
                        DataService.gamesSection.selectedOrder, DataService.gamesSection.selectedFilterValue,
                        DataService.gameVendors.selectedOrderVendor, languageCode); 
                        
                MatrixService.sessionConnection.call("/casino#getLiveCasinoTables", [], parameters).then(
                        function (result) {
                            var games = result.kwargs.tables;
                            var i, k;
                            
                            for (i = 0, k = -1; i < games.length; i++) {
                                if (i % module === 0) {
                                    k++;
                                    DataService.gamesSection.gamesTmp[k] = [];
                                }
                                if (DataService.infUser !== '') {
                                    var isRestricted = false;
                                    for (var index in games.restrictedTerritories) {
                                        if (games.restrictedTerritories[index] === DataService.infUser.userCountry)
                                            isRestricted = true;
                                    }
                                    if (!isRestricted) {
                                        DataService.gamesSection.gamesTmp[k].push(games[i]);
                                    }
                                } else {
                                    DataService.gamesSection.gamesTmp[k].push(games[i]);
                                }
                            }
                            deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            
             MatrixCasinoService.getLiveExitLivenewIn = function ($q, DataService, languageCode) {
                var deferred = $q.defer();
                DataService.gamesSection.gamesTmp = [];
                DataService.gamesSection.allGames = [];
                var module = 16;
                var parameters = MatrixCasinoService.getParamentersForFilterGamesTmp(
                        ['live'],
                        DataService.gamesSection.selectedOrder, DataService.gamesSection.selectedFilterValue,
                        DataService.gameVendors.selectedOrderVendor, languageCode);
                MatrixService.sessionConnection.call("/casino#getLiveCasinoTables", [], parameters).then(
                        function (result) {
                             deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            var getCategoryAvailables = function(parameters, index, categories, typeGames, DataService){
                var nameObjectVisible = '';
                if(categories.length > index){
                    if(typeGames === 'getGames') parameters.filterByCategory = [categories[index].code];
                    
                    if(localStorage.getItem("sort_menu") == "/newgame") nameObjectVisible = "isVisibleNew";
                    else nameObjectVisible = "isVisible";
                    
                    MatrixService.sessionConnection.call("/casino#"+typeGames, [], parameters).then(
                        function (result) {
                            var games = [];
                            if(typeGames === 'getGames'){
                                games = result.kwargs.games;
                                if(games.length > 0){
                                    categories[index][nameObjectVisible] = true;
                                }else{
                                    categories[index][nameObjectVisible] = false;
                                }
                            }
                            else{
                                games = result.kwargs.tables;
                                if(games.length > 0){
                                    categories[index].isVisible = true;
                                }else{
                                    categories[index].isVisible = false;
                                }
                            }
                            getCategoryAvailables(parameters, index+1, categories, typeGames);
                        }, function (error) {
                            console.log("error", error)
                            
                        });
                }
            };
            
            MatrixCasinoService.verifyCategoryByProvider = function ($q, DataService, $scope) {
                
                var deferred = $q.defer();
                var FIELDS = getFields();
                var index = 0;
                var parameters  = {
                    filterByName: [], 
                    filterBySlug: [], 
                    filterByVendor: [DataService.gameVendors.selectedOrderVendor],
                    filterByCategory: [],
                    filterByTag: [], 
                    filterByAttribute: {},
                    expectedFields: FIELDS.Slug + FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + 
                            FIELDS.Description + FIELDS.Categories, 
                    expectedFormat: 'array', 
                    pageIndex: 1,
                    pageSize: 0,
                    sortFields: [],
                    culture: localStorage.getItem("language")
                };
                 
                var parametersLive = {
                    filterByID: [],
                    filterByVendor: [DataService.gameVendors.selectedOrderVendor],
                    filterByCategory: [],
                    filterByTag: [],
                    filterByPlatform: [],
                    filterByAttribute: {},
                    expectedFields: FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + 
                            FIELDS.Description + FIELDS.Categories,
                    expectedFormat: "array",
                    pageIndex: 1,
                    pageSize: 0,
                    sortFields: [],
                    culture: localStorage.getItem("language")
                };
                
                getCategoryAvailables(parameters, index, DataService.gamesSection.categories, 'getGames', DataService);
                getCategoryAvailables(parametersLive, index, DataService.gamesSection.categoryLive, 'getLiveCasinoTables', DataService);
                    
                DataService.gamesSection.providerCategories = DataService.gamesSection.categories;
            
                return deferred.promise;
            };
            
            MatrixCasinoService.verifyCategoryByNewIn = function ($q, DataService) {
                
                var deferred = $q.defer();
                var FIELDS = getFields();
                var index = 0;
                var parameters  = {
                    filterByName: [], 
                    filterBySlug: [], 
                    filterByVendor: [],
                    filterByCategory: [],
                    filterByTag: [], 
                    filterByAttribute: {newGame: true},
                    expectedFields: FIELDS.Slug + FIELDS.Platforms + FIELDS.Name + FIELDS.ShortName + FIELDS.Categories, 
                    expectedFormat: 'array', 
                    pageIndex: 1,
                    pageSize: 0,
                    sortFields: [],
                    culture: localStorage.getItem("language")
                };
                getCategoryAvailables(parameters, index, DataService.gamesSection.categories, 'getGames', DataService);
                return deferred.promise;
            };
            
            //search by
            MatrixCasinoService.getLiveCasinoTablesSearchBy = function ($q, DataService, languageCode) {
                var deferred = $q.defer();
                var live = true;
                var parameters = MatrixCasinoService.getParamentersForFilterGames(
                        DataService.gamesSection.selectedCategory,
                        DataService.gamesSection.selectedOrder, DataService.gamesSection.selectedFilterValue,
                        DataService.gameVendors.selectedOrderVendor, DataService, languageCode);
                DataService.gamesSection.games = [];
                MatrixService.sessionConnection.call("/casino#getLiveCasinoTables", [], parameters).then(
                        function (result) {
                            var games = result.kwargs.tables;
                            var i, k;
                            var stateGames = false;

                            for (i = 0, k = -1; i < games.length; i++) {
                                if (i % 16 === 0) {
                                    k++;
                                    DataService.gamesSection.games[k] = [];
                                }
                                if (DataService.infUser !== '') {
                                    var isRestricted = false;
                                    for (var index in games.restrictedTerritories) {
                                        if (games.restrictedTerritories[index] === DataService.infUser.userCountry)
                                            isRestricted = true;
                                    }
                                    if (!isRestricted) {
                                        var a = DataService.gamesSection.selectedFilterValue;
                                        var b = games[i].name;
                                        var b = b.toLowerCase();
                                        if (b.search(a) >= 0)
                                            DataService.gamesSection.games[k].push(games[i]);
                                    }
                                } else {
                                    var a = DataService.gamesSection.selectedFilterValue;
                                    var b = games[i].name;
                                    var b = b.toLowerCase();
                                    if (b.search(a) >= 0)
                                        DataService.gamesSection.games[k].push(games[i]);
                                }
                            }

                            if (DataService.gamesSection.games.length > 0) {
                                stateGames = true;
                            }

                            deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                }

                );
                return deferred.promise;
            };
            //Favorites
            MatrixCasinoService.addToFavorites = function ($q, parameters) {
                var deferred = $q.defer(); 
                MatrixService.sessionConnection.call("/casino#addToFavorites", [], parameters).then(
                        function (result) { 
                            deferred.resolve(result);
                        }, function (error) {
                        console.log(error);
                        deferred.reject(error);
                }
                );
                return deferred.promise;
            };

            MatrixCasinoService.removeFromFavorites = function ($q, parameters) {
                var deferred = $q.defer();
                MatrixService.sessionConnection.call("/casino#removeFromFavorites", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }
                , function (err) {
                    console.log(err);
                    deferred.reject(err);
                }
                );
                return deferred.promise;
            };

            MatrixCasinoService.getFavorites = function ($q) {
                var FIELDS = getFields();
                var expectedGameFields = FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + 
                                FIELDS.Description + FIELDS.Categories + FIELDS.Tags + FIELDS.Url + 
                                FIELDS.Thumbnail + FIELDS.FunMode + FIELDS.RealMode + FIELDS.NewGame + 
                                FIELDS.RestrictedTerritories + FIELDS.TableID + FIELDS.OpenStatus+ FIELDS.OpeningTime + 
                                FIELDS.Category + FIELDS.NewTable + FIELDS.VipTable;
                        
                var expectedTableFields = FIELDS.Platforms + FIELDS.Name + FIELDS.Vendor + FIELDS.ShortName + 
                                FIELDS.Description + FIELDS.Categories + FIELDS.Tags + FIELDS.Url + 
                                FIELDS.Thumbnail + FIELDS.FunMode + FIELDS.RealMode + FIELDS.NewGame + 
                                FIELDS.RestrictedTerritories + FIELDS.TableID + FIELDS.OpenStatus+ FIELDS.OpeningTime + 
                                FIELDS.Category + FIELDS.NewTable + FIELDS.VipTable;
                        
                var parameters = {
                    filterByPlatform: [],
                    filterByType: [],
                    anonymousUserIdentity: '',
                    expectedGameFields: expectedGameFields,
                    expectedTableFields: expectedTableFields
                };
                var deferred = $q.defer();
                MatrixService.sessionConnection.call("/casino#getFavorites", [], parameters).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            };

            MatrixCasinoService.getLauncUrl = function ($q, slug, realMoney, live, I18N) {
                var deferred = $q.defer();
                 var gameCategori = localStorage.getItem("gameCategory");
                 var urlLive =""+I18N['live-casino'].replace(/\s/g, '');
                 var language=localStorage.getItem("language");
                 if( language=='UK' || language=='CA' || language=='NZ' || language=='AU'){
                     language='EN';
                 }else{
                     if(language=='SE')
                        language='SV';
                 }
                 
                if (live == 'game-live' || live == urlLive.toLowerCase()) {
                    var parameters = {
                        tableID: slug,
                        realMoney: realMoney,
                        culture: ""+language.toLowerCase()
                    };
                }
                else {
                    var parameters = {
                        slug: slug,
                        realMoney: realMoney,
                        culture: ""+language.toLowerCase()
                    };
                }
                MatrixService.sessionConnection.call("/casino#getLaunchUrl", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }, function (error) {
                    deferred.reject(error);
                }
                );
                return deferred.promise;
            };

            MatrixCasinoService.getGameBySlug = function ($q, slug, languageCode) {
                var deferred = $q.defer();
                var parameters = {
                    "filterByName": [],
                    "filterBySlug": [
                        slug
                    ],
                    "filterByVendor": [],
                    "filterByCategory": [],
                    "filterByTag": [],
                    "filterByPlatform": [],
                    "filterByAttribute": {},
                    "expectedFields": 9193914367,
                    "expectedFormat": "map",
                    "pageIndex": "1",
                    "pageSize": "2",
                    "sortFields": [],
                    culture: localStorage.getItem("language")
                }
                MatrixService.sessionConnection.call("/casino#getGames", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }
                , function (error) {
                    deferred.reject(error);
                }
                );
                return deferred.promise;
            };
            MatrixCasinoService.getGameByID = function ($q, slug) {
                var deferred = $q.defer();
                var parameters = {
                    "filterByID": [slug],
                    "filterByVendor": [],
                    "filterByCategory": [],
                    "filterByTag": [],
                    "filterByPlatform": [],
                    "filterByAttribute": {},
                    "expectedFields": 34359738367,
                    "expectedFormat": "map",
                    "pageIndex": "1",
                    "pageSize": "2",
                    "sortFields": [],
                    culture: localStorage.getItem("language")
                };
                MatrixService.sessionConnection.call("/casino#getLiveCasinoTables", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }
                , function (error) {
                    deferred.reject(error);
                }
                );
                return deferred.promise;
            };

            MatrixCasinoService.getRecentWinners = function ($q, languageCode) {
                var deferred = $q.defer();

                var FIELDS = {Slug: 1, ShortName: 8};
                var parameters = {
                    expectedGameFields: FIELDS.Slug + FIELDS.ShortName,
                    culture: localStorage.getItem("language")
                };

                MatrixService.sessionConnection.call("/casino#getRecentWinners", [], parameters).then(
                        function (result) {
                            deferred.resolve(result);
                        }
                        , function (error) {
                            deferred.reject(error);
                        }
                );

                return deferred.promise;
            };

            MatrixCasinoService.getGameVendors = function ($q) {
                var deferred = $q.defer();

                MatrixService.sessionConnection.call("/casino#getGameVendors", []).then(
                        function (result) {
                            deferred.resolve(result);
                        }
                , function (error) {
                    deferred.reject(error);
                }
                );

                return deferred.promise;
            };

            MatrixCasinoService.getInstance = function () {
                return angular.extend({}, MatrixService, MatrixCasinoService);
            };

            return MatrixCasinoService;

        });
