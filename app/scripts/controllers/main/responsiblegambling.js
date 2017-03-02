'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainResponsiblegamblingCtrl
 * @description
 * # MainResponsiblegamblingCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('ResponsibleGamblingCtrl', function ($scope, $http, $q, WPService, MainMatrixService, UtilsService, DataService, $uibModal) {
    
        $scope.data = DataService; 
        $scope.data.stateRespGambling = false;
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
            WPService.getSinglePostInCategoryAllTagLanguage("Help", "Responsible Gambling").success(function (res) {
                for(var index in res){
                    var country = res[index].title.split("-");
                     if(currentIpCountry === 'GB'){
                      currentIpCountry = 'UK';
                    }
                    if(currentIpCountry === 'UK' && country[1] === currentIpCountry){
                        $scope.responsibleGambling = res[index];
                        $scope.responsibleGambling.title = country[0];
                        $scope.data.stateRespGambling = true;
                    }
                    if(currentIpCountry !== 'UK' && country[1] === 'noUK'){
                        $scope.responsibleGambling = res[index];
                        $scope.responsibleGambling.title = country[0];
                        $scope.data.stateRespGambling = true;
                    }
                } 

            });
        };
                       
    
  });
