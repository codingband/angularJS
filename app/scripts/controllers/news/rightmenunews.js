'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:RightmenunewsCtrl
 * @description
 * # NewsRightmenunewsCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('RightMenuNewsCtrl', function ($scope, $http, $q, WPService, MatrixService,MatrixCasinoService ,UtilsService, DataService,$uibModal, I18N) {
                                          
              $scope.i18n = I18N[DataService.language];
      //add 
       $scope.data = DataService;
        var lengthWiners = 0;
        var countWinners = 0;
        DataService.lastedWinners = [];
        
        var culture = UtilsService.getCorrectlanguageCode();
        
         var clearWatchWinners = $scope.$watch(function(scope) {
                if (DataService.lastedWinners.length === lengthWiners && lengthWiners > 0) {
                  countWinners++;
                  if (countWinners === 2) {
                    $('#last-winners').vTicker({
                      speed: 500,
                      pause: 3000,
                      showItems: 4,
                      animation: true,
                      mousePause: true,
                      direction: 'up',
                      padding: 0
                    });
                    clearWatchWinners();
                  }
                }
              });
      // $scope.$on('enableConnection', function(event, data) {
        var promiseRecentWinners = MatrixCasinoService.getRecentWinners($q, culture);
         promiseRecentWinners.then(
                        function(result) {
                          DataService.lastedWinners = [];
                          lengthWiners = result.kwargs.winners.length;
                          angular.forEach(result.kwargs.winners, function(winner) {
                            DataService.lastedWinners.push(winner);
                          });
                        }, function(error) {
                  console.log("Error", error);
                }
                );
      // });
      
  });
