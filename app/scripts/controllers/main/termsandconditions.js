'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainTermsandconditionsCtrl
 * @description
 * # MainTermsandconditionsCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('TermsAndConditionsCtrl', function ($scope, $http, $q, WPService, MainMatrixService, UtilsService, DataService, $uibModal) {
    
        $scope.data = DataService; 
        $scope.data.stateTermsConditions = false;
        var culture = UtilsService.getCorrectlanguageCode();
        
        if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
            UtilsService.getNewIovationBlackBox(DataService);
        }
        var promiseCountries = MainMatrixService.getInstance().getCountries($q, DataService, culture);
        promiseCountries.then(
            function(success) {
                loadContent(DataService.currentIPCountry);
                //loadContent();
            }, function(error) { 
                console.log("error", error);
            }
        );

        var loadContent = function(currentIpCountry){
            WPService.getSinglePostInCategoryAllTagLanguage("Help", "Help Rules").success(function (res) {
            //WPService.getSinglePostInCategory("Help", "Help Rules").success(function (res) {
                for(var index in res){
                    var country = res[index].title.split("-");
                     if(currentIpCountry === 'GB'){
                      currentIpCountry = 'UK';
                    }
                    if(currentIpCountry === 'UK' && country[1] === currentIpCountry){
                        $scope.help = res[index];
                        $scope.help.title = country[0];
                        $scope.data.stateTermsConditions = true;
                    }
                    if(currentIpCountry !== 'UK' && country[1] === 'noUK'){
                        $scope.help = res[index];
                        $scope.help.title = country[0];
                        $scope.data.stateTermsConditions = true;
                    }
                } 

            });
        };    
    
    
  });
