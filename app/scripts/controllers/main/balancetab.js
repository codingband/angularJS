'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainBalancetabctrlCtrl
 * @description
 * # MainBalancetabctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('BalanceTabCtrl', 
    function ($scope, $q,  I18N, DataService, MainMatrixService, UtilsService) {
            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            
            $scope.availableToWithdraw = 0.00;
            $scope.casinoBonuses = 0.00;
            $scope.sportBonuses = 0.00;
            $scope.total = 0.00;
            $scope.amountBonuses= 0.00;

            $scope.parameters = {
                expectBalance: true,
                expectBonus: true,
                culture: localStorage.getItem("language"),
                iovationBlackBox: DataService.iovationBlackBox
            };

            $scope.bonusCode = {
                "type": "deposit",
                "gamingAccountID": 6036034,
                culture: localStorage.getItem("language"),
                iovationBlackBox: DataService.iovationBlackBox
            };
            
            $scope.getProfile = function () {
                MainMatrixService.getInstance().getProfile($q).then(
                        function (success) {
                            $scope.currency = success.kwargs.fields.currency;
                        }, function (error) { console.log("-error", error);}
                );
            };

            $scope.getAvailableWithdraw = function (parameters) {
                
                MainMatrixService.getInstance().getGameTransactions(parameters, $q).then(
                    function (res) {
                        angular.forEach(res.kwargs.accounts, function (account) {
                            if (!account.isBonusAccount) {
                                $scope.availableToWithdraw += account.amount;
                            }
                            if(account.isBonusAccount){
                                $scope.amountBonuses = account.amount;
                            }
                        });
                        $scope.total = $scope.availableToWithdraw + $scope.amountBonuses;
                        if ($scope.availableToWithdraw === 0) {
                            var num = $scope.availableToWithdraw;
                            $scope.availableToWithdraw = num.toFixed(2);
                        }
                    }, function (e) { console.log(e.desc);}
                );
            };

            $scope.getCasinoBonuses = function () {
                MainMatrixService.getInstance().getGameCasinoBonuses($q).then(
                    function (res) {
                        angular.forEach(res.kwargs.bonuses, function (bonus) {
                            $scope.casinoBonuses += bonus.amount;
                        });
                        //$scope.total += $scope.casinoBonuses;
                        if ($scope.casinoBonuses == 0) {
                            var num = $scope.casinoBonuses;
                            $scope.casinoBonuses = num.toFixed(2);
                        }
                    }, function (e) {console.log(e.desc); }
                );
            };

            $scope.getCodeBonuses = function () {
                MainMatrixService.getInstance().getGameCasinoBonusesById($q, $scope.bonusCode)
                        .then(function (res) {
                        }, function (e) {
                            //alert(e.desc);
                        });
            };
            $scope.getProfile();
            $scope.getCodeBonuses();
            $scope.getCasinoBonuses();
            $scope.getAvailableWithdraw($scope.parameters);
  });
