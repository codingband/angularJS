'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainTransactiontabCtrl
 * @description
 * # MainTransactiontabCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('TransactionTabCtrl', function ($scope, I18N, DataService,UtilsService) {
   
    $scope.data = DataService;
    $scope.i18n = I18N[DataService.language];

    $scope.tabName = 'accountStatement';
    $scope.changeTabTransaction = function (values) {
        $scope.tabName = values;
    };  
 
    
   
  });
