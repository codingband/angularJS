'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:NewsCtrl
 * @description
 * # NewsCtrl
 * Controller of the cyberplayerThemeV20App
 */

angular.module('cyberplayerThemeV20App')
        .controller('NewsCtrl', function ($scope, WPService, MatrixService, I18N, DataService, $rootScope, UtilsService) {

            $scope.connection = MatrixService.getInstance();
            $scope.i18n = I18N[DataService.language];
            
            if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                UtilsService.getNewIovationBlackBox(DataService);
            }

            $rootScope.$broadcast('change-language', {
                data: localStorage.getItem('language')
            });

            WPService.getBlogs().success(function (res) {
                for (var index in res) {
                    var dateBlog = {
                        day: '',
                        month: ''
                    };
                    var dateBlogArray = [];
                    if (res[index].extradata.date !== '')
                        dateBlogArray = res[index].extradata.date.split(';');

                    for (var i in dateBlogArray) {
                        var value = dateBlogArray[i].split(':');
                        switch (value[0].trim()) {
                            case 'day':
                                dateBlog.day = value[1].trim();
                                break;
                            case 'month':
                                dateBlog.month = value[1].trim();
                                break;
                        }
                    }
                    res[index]['dateBlog'] = dateBlog;
                }
                $scope.data.blogs = res;
            });
            //add
            //SEO get blogs and set window.prerenderReady to true
            var clearwatch = $scope.$watch(function () {
                if ($scope.data.blogs !== undefined) {
                    if ($scope.data.blogs.length > 0) { // && DataService.categories.length > 0
                        setTimeout(function () {
                            window.prerenderReady = true;
                            //console.log(window.prerenderReady);
                        }, 2000);
                        clearwatch();
                    }
                }
            });
            //End SEO



        });
