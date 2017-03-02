'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/wpService
 * @description
 * # common/wpService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
  .factory('WPService', function ($http, DataService) {
    var WPService = {};
        
        var defaultURL = cyberPlayLocalized.urlhome;
        
        function getLanguageForPost(){
           //change for seo SV to SE
            var languageGetPost = "";
            if(DataService.language == "SE"){
               languageGetPost = "SV";
            }else{
               languageGetPost = DataService.language; 
            }
            //languageGetPost = DataService.language;
            return languageGetPost;
        };
        
        WPService.getMenu = function (registernavmenu) {
            
            
            if (getLanguageForPost() == "UK" || getLanguageForPost() == "CA" || getLanguageForPost() == "AU" || getLanguageForPost() == "NZ") {
                var menus = defaultURL + 'wp-json/menu-locations/' + registernavmenu + '_' + 'EN';
                return $http.get(menus).success(function (res) {
                    return res;
                });
            } else {
                var menus = defaultURL + 'wp-json/menu-locations/' + registernavmenu + '_' + getLanguageForPost();
                return $http.get(menus).success(function (res) {
                    return res;
                });
            }
        };

        WPService.getMenuLang = function (registernavmenu, lang) {
            lang =  lang == "SE" ? "SV" : lang;
            
            var menus = defaultURL + 'wp-json/menu-locations/' + registernavmenu + '_' + lang;
            return $http.get(menus).success(function (res) {
                return res;
            });
        };

        WPService.sendEmailByLang = function (registernavmenu, lang) {
            lang =  lang == "SE" ? "SV" : lang;
            var path = 'contact-us/';
            return $http.post({
                method: 'POST',
                url: path,
                data: registernavmenu
            }).success(function (res) {
                return res;
            });
        };

        WPService.getSliders = function (section) {
            if (section === "slider-casino") {
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
                        case 'SV':
                            codeLang = 'SV';
                            break;
                        case 'SE':
                            codeLang = 'SV';
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
                var slider = defaultURL + 'wp-json/posts/?filter[tag]=' + codeLang
                        + '&filter[category_name]=' + section;

                return $http.get(slider).success(function (res) {
                    return res;
                });
            }
            else {
                if (getLanguageForPost() == "UK" || getLanguageForPost() == "CA" || getLanguageForPost() == "AU" || getLanguageForPost() == "NZ") {
                    var slider = defaultURL + 'wp-json/posts/?filter[tag]=' + 'EN'
                            + '&filter[category_name]=' + section;

                    return $http.get(slider).success(function (res) {
                        return res;
                    });
                } else {
                    var slider = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                            + '&filter[category_name]=' + section;

                    return $http.get(slider).success(function (res) {
                        return res;
                    });
                }
            }
        };

        WPService.getBannersAllLanguages = function (section) {
            //If the correct the value is show by laguage tag for all.
            //If it dont get the value is show by default in English.
            if (DataService.language !== "") {

                var slider = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                            + '&filter[category_name]=' + section;

                return $http.get(slider).success(function (res) {
                    return res;
                });

            } else {
                var slider = defaultURL + 'wp-json/posts/?filter[tag]=' + 'EN'
                            + '&filter[category_name]=' + section;

                return $http.get(slider).success(function (res) {
                    return res;
                });
            }
        };

        WPService.getGameInf = function (category_name) {
            if (getLanguageForPost() == "UK" || getLanguageForPost() == "CA" || getLanguageForPost() == "AU" || getLanguageForPost() == "NZ") {
                var post = defaultURL + 'wp-json/posts/?filter[tag]=' + 'EN'
                        + '&filter[category_name]=game'
                        + '&filter[category_name]=' + category_name;

                return $http.get(post).success(function (res) {
                    return res;
                });
            } else {
                var post = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                        + '&filter[category_name]=game'
                        + '&filter[category_name]=' + category_name;

                return $http.get(post).success(function (res) {
                    return res;
                });
            }
        };

        WPService.getBlogs = function () {
           /* if (DataService.language == "UK" || DataService.language == "CA" || DataService.language == "AU" || DataService.language == "NZ") {
                var slider = 'wp-json/posts/?filter[tag]=' + 'EN'
                        + '&filter[category_name]=blog';

                return $http.get(slider).success(function (res) {
                    return res;
                });
            } else {*/
                var slider = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                        + '&filter[category_name]=blog';

                return $http.get(slider).success(function (res) {
                    return res;
                });
            /*}*/
        };

        WPService.getSinglePostInCategory = function (a, b) {
            if (getLanguageForPost() == "UK" || getLanguageForPost() == "CA" || getLanguageForPost() == "AU" || getLanguageForPost() == "NZ") {

                var url = defaultURL + 'wp-json/posts/?filter[tag]=' + 'EN'
                        + '&filter[category_name]=' + a + '&filter[category_name]=' + b + '';
                return $http.get(url).success(function (res) {
                    return res;
                });

            } else {
                var url = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                        + '&filter[category_name]=' + a + '&filter[category_name]=' + b + '';
                return $http.get(url).success(function (res) {
                    return res;
                });
            }
        };

        WPService.getSinglePostInCategoryIncludeUK = function (a, b) {
            if (getLanguageForPost() == "CA" || getLanguageForPost() == "AU" || getLanguageForPost() == "NZ") {

                var url = defaultURL +'wp-json/posts/?filter[tag]=' + 'EN'
                        + '&filter[category_name]=' + a + '&filter[category_name]=' + b + '';
                return $http.get(url).success(function (res) {
                    return res;
                });

            } else {
                var url = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                        + '&filter[category_name]=' + a + '&filter[category_name]=' + b + '';
                return $http.get(url).success(function (res) {
                    return res;
                });
            }
        };

        WPService.getSinglePostInCategoryAllTagLanguage = function (a, b) {
            //If it dont get the value is show by default in English.
            //If the correct the value is show by laguage tag for all.
            if (DataService.language === "") {

                var url = defaultURL + 'wp-json/posts/?filter[tag]=' + 'EN'
                        + '&filter[category_name]=' + a + '&filter[category_name]=' + b + '';
                return $http.get(url).success(function (res) {
                    return res;
                });

            } else {
                var url = defaultURL + 'wp-json/posts/?filter[tag]=' + getLanguageForPost()
                        + '&filter[category_name]=' + a + '&filter[category_name]=' + b + '';
                return $http.get(url).success(function (res) {
                    return res;
                });
            }
        };

        WPService.getPostsInCategoryWithAllTags = function (a, b) {
            var url = defaultURL + 'wp-json/posts/?filter[category_name]=' + a + '&filter[category_name]=' + b + '';
            return $http.get(url).success(function (res) {
                return res;
            });
        }; 

        return WPService; 
  });
