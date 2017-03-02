'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainMainheaderCtrl
 * @description
 * # MainMainheaderCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('MainHeaderCtrl', 
      function ($scope, $q, MainMatrixService, UtilsService, DataService, $location, MatrixService) {
            UtilsService.putDefaultLocalStorageData();
            $scope.images = cyberPlayLocalized.images;

            var promiseEMConnection = MainMatrixService.getInstance().everymatrixConnection($q, $scope);
            promiseEMConnection.then(
                function(success) {
                    resumeSessionLocal();        
                    
                    MainMatrixService.getInstance().getDefaultData(DataService, $q);
                    $scope.$broadcast('enableConnection', {
                        value: true 
                    });
                }, function(error) { }
            );
             
            function resumeSessionLocal(){
                var promiseResumeService = MainMatrixService.getInstance().resumeSession($q);
                promiseResumeService.then(
                    function(success) {
                        DataService.isLogged = true;
                        getSessionInfLocal();
                        MatrixService.reviewStatus = true; 
                        MatrixService.stateLogin= true;
                        UtilsService.getAvailableWithdraw(MatrixService, DataService, $q);
                        UtilsService.getAvailableWithdrawPayments(MainMatrixService, $q, DataService);
                        
                    }, function(error) {
                        DataService.isLogged = false;
                        MatrixService.stateLogin= false;
                        MatrixService.reviewStatus = true;

                        DataService.allDepositPayments = [];
                        var parameters = {
                            filterByCountry: '', 
                            currency: DataService.defaultCurrency,
                            culture: localStorage.getItem("language")
                        };
                        UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                        console.log(error);
                    }
                );
            };
            
            function getSessionInfLocal(){
                var promiseSessionInf = MainMatrixService.getInstance().getSessionInfo($q, $scope);
                promiseSessionInf.then(
                    function(success) {
                        DataService.infUser = success;
                        DataService.allDepositPayments = [];
                        var parameters = {
                            filterByCountry: DataService.infUser.userCountry,
                            currency: DataService.infUser.currency,
                            culture: localStorage.getItem("language")
                        };
                        
                        UtilsService.loadPayments($q, DataService, MainMatrixService, parameters);
                        $scope.$broadcast('loadInfUser', {
                            value: true 
                        });
                        MatrixService.listenBalancesChanges(DataService.infUser, $scope);
                    }, function(error) { 
                    }
                );
            };
            
            var location = $location.$$path.split("/"); 
            if(location[1] === "game"){
                DataService.section = "game"; 
            }else{
                DataService.section = "home";
            }
            $scope.data = DataService;
            
  });
