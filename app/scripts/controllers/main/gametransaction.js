'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainGametransactionctrlCtrl
 * @description
 * # MainGametransactionctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('GameTransactionCtrl', 
    function ($scope, $q,  MatrixService, UtilsService, $uibModal, I18N, DataService, WPService, MainMatrixService) {
             $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            
            $scope.currentDateFrom = $scope.currentDateTo = UtilsService.getCurrentDate();
            UtilsService.bootstrapdatetimepicker('#dateFromGT', '#dateToGT');
            
            var validFormGT = false;
            var clearWatchR = $scope.$watch(function () {
                if ($("#form_game_transaction").load()) {
                    
                    $("#form_game_transaction").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function(form){
                            validFormGT = true;
                            $scope.searchGameTransaction();
                        }
                    });
                    clearWatchR();
                }
            });

            $scope.getGameTransactions = function (startDate, endDate) {
                $scope.casinoBonuses = [];
                MainMatrixService.getInstance().getGameCasinoBonuses($q).then(
                        function (success) {
                            var grantedDate = "";
                            var dateArray = "";
                            
                            dateArray = startDate.split("-");
                            startDate = new Date(dateArray[0], dateArray[1], dateArray[2]); //Year, Month, Date
                            dateArray = endDate.split("-");
                            endDate = new Date(dateArray[0], dateArray[1], dateArray[2]);

                            angular.forEach(success.kwargs.bonuses, function (bonus) {
                                try{
                                    grantedDate = bonus.grantedDate;
                                    dateArray = grantedDate.split("T");
                                    grantedDate = dateArray[0];
                                    dateArray = grantedDate.split("-");
                                    grantedDate = new Date(dateArray[0], dateArray[1], dateArray[2]);

                                    if (grantedDate <= startDate && grantedDate >= endDate) {
                                        $scope.casinoBonuses.push(bonus);
                                    }
                                }catch(err){
                                    console.log("Error: " + err.message);
                                }
                            });
                        }, function (error) { console.log("error", error); }
                );
            };

            $scope.searchGameTransaction = function () {
                if(validFormGT){
                    $scope.getGameTransactions($scope.currentDateFrom, $scope.currentDateTo);
                }
            };
            $scope.getGameTransactions($scope.currentDateFrom, $scope.currentDateTo);
  });
