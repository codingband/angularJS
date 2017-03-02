'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainAboutuspost1ctrlCtrl
 * @description
 * # MainAboutuspost1ctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('AboutUsPost1Ctrl', 
    function ($scope, $http, $q, WPService, MainMatrixService, DataService, UtilsService) {
        $scope.data = DataService; 
        var culture = UtilsService.getCorrectlanguageCode();
        var promiseCountries = MainMatrixService.getInstance().getCountries($q, DataService, culture);
        promiseCountries.then(
            function(success) {
                loadContent(DataService.currentIPCountry);
            }, function(error) { 
                console.log("error", error);
            }
        );

        var loadContent = function(currentIpCountry){
            WPService.getSinglePostInCategory("About Us", "About Us 1").success(function (res) {
                for(var index in res){
                    var country = res[index].title.split("-");
                    if(currentIpCountry === 'GB'){
                      currentIpCountry = 'UK';
                    }
                    if(currentIpCountry === 'UK' && country[1] === currentIpCountry){
                        $scope.post1 = res[index];
                        $scope.post1.title = country[0];
                    }
                    if(currentIpCountry !== 'UK' && country[1] === 'noUK'){
                        $scope.post1 = res[index];
                        $scope.post1.title = country[0];
                    }
                } 

            });
        };    
  });
