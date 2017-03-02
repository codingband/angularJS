'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainAccountstatementctrlCtrl
 * @description
 * # MainAccountstatementctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('AccountStatementCtrl', 
    function ($scope, $q,  MatrixService, UtilsService, $uibModal, I18N, DataService, WPService, MainMatrixService) {
    
            $scope.data = DataService;
            $scope.i18n = I18N[DataService.language];
            $scope.totalAmount = 0;

                       
            if($scope.data.accountStatementDates.dateStart === ""){
              $scope.currentDate = $scope.currentDateTo = UtilsService.getCurrentDate();  
            }else{ 
                $scope.currentDate = $scope.data.accountStatementDates.dateStart;
                $scope.currentDateTo = $scope.data.accountStatementDates.dateEnd;     
            }
           
            if(DataService.allTransactionHistory.length === 0 ){
                $scope.currentDate = $scope.currentDateTo = UtilsService.getCurrentDate(); 
            }
                        

            var culture = UtilsService.getCorrectlanguageCode();
           
            UtilsService.bootstrapdatetimepicker('#dateFromAS', '#dateToAS');
            
            var validForm = false;
            var clearWatchR = $scope.$watch(function () {
                if ($("#form_account_statement").load()) {
                    
                    $("#form_account_statement").validate({
                        errorClass: "errorMessageFormValidation",
                        submitHandler: function(form){
                            validForm = true;
                            $scope.searchAccountTransaction();
                        }
                    });
                    
                    clearWatchR();
                }
            });
            
            $scope.openTransactions=function(){    
                UtilsService.modalDialog.close();
            }
            
            $scope.loadAccountStatement = function (type, startDate, endDate) {
                var parameters = {
                    type: type,
                    startTime: startDate + "T00:00:00.000Z",
                    endTime: endDate + "T23:59:59.000Z",
                    pageIndex: 1,
                    pageSize: 20,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };
                
                MainMatrixService.getInstance().getTransactionHistory(parameters, $q).then(
                        function (success) {
                            if (type === "Deposit")
                                loadDepositTransaction(success.kwargs.transactions);
                            else
                                loadWithdrawTransaction(success.kwargs.transactions);
                        }, function (error) { console.log("error", error);}
                );
            };
            var loadBalance = function () {
                var balaceParameter = {
                    expectBalance: true,
                    expectBonus: true,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                }
                MainMatrixService.getInstance().getGameTransactions(balaceParameter, $q).then(
                        function (success) {
                            var amount = 0;
                            var gameTransaction = success.kwargs.accounts;
                            for (var index in gameTransaction) {
                                amount = amount + gameTransaction[index].amount;
                            }
                            $scope.totalAmount = amount.toFixed(2);
                        },
                        function (error) {console.log("error balance", error); }
                );
            }
            var loadDepositTransaction = function (depositTransaction) {
                loadBalance();
                var objectDeposit = {};
                for (var index in depositTransaction) {
                    objectDeposit = {
                        type: 'Deposit',
                        credit: depositTransaction[index].credit,
                        debit: depositTransaction[index].debit,
                        fees: depositTransaction[index].fees,
                        time: depositTransaction[index].time,
                        transactionID: depositTransaction[index].transactionID,
                        status: 'success'
                    };
                    DataService.allTransactionHistory.push(objectDeposit);
                }
            };
            var loadWithdrawTransaction = function (withdrawTransaction) {
                loadBalance();
                var objectWithdraw = {};
                for (var index in withdrawTransaction) {
                    objectWithdraw = {
                        type: 'Withdraw',
                        credit: withdrawTransaction[index].credit,
                        debit: withdrawTransaction[index].debit,
                        fees: withdrawTransaction[index].fees,
                        time: withdrawTransaction[index].time,
                        transactionID: withdrawTransaction[index].transactionID,
                        id: withdrawTransaction[index].id,
                        isRollbackAllowed: withdrawTransaction[index].isRollbackAllowed,
                        status: withdrawTransaction[index].status
                    };
                    DataService.allTransactionHistory.push(objectWithdraw);
                }
            };
            if ($scope.data.allTransactionHistory.length === 0) {
                $scope.loadAccountStatement("Deposit", $scope.currentDate, $scope.currentDate);
                $scope.loadAccountStatement("Withdraw", $scope.currentDate, $scope.currentDate);
            }

            $scope.searchAccountTransaction = function () {
               if(validForm){
                    DataService.allTransactionHistory = [];
                    $scope.loadAccountStatement("Deposit", $("#dateFrom").val(), $("#dateTo").val());
                    $scope.loadAccountStatement("Withdraw", $("#dateFrom").val(), $("#dateTo").val());
                    $scope.data.accountStatementDates.dateStart = $("#dateFrom").val();
                    $scope.data.accountStatementDates.dateEnd = $("#dateTo").val();
                }
            };
            $scope.rollbackWithdrawals = function (idRollback) {
               var parameters = {
                    'id': idRollback,
                    culture: localStorage.getItem("language"),
                    iovationBlackBox: DataService.iovationBlackBox
                };
              var promiseRollbackWithdrawals = MatrixService.rollbackWithdrawals(parameters,$q);
                promiseRollbackWithdrawals.then(
                        function(success) {
                DataService.allTransactionHistory = [];
                $scope.loadAccountStatement("Deposit", $scope.currentDate, $scope.currentDate);
                $scope.loadAccountStatement("Withdraw", $scope.currentDate, $scope.currentDate);

                           DataService.contentModalMessage = {
                            title: $scope.i18n['success'],
                            className: 'successMessage',
                            message: "Rollback withdraw was processed successful"
                        };
                        
                        $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                        UtilsService.modalDialog.close();
                        }, function(error) {
                          DataService.contentModalMessage = {
                                    title: $scope.i18n['error'],
                                    className: 'errorMessage',
                                    message: " - "+error.kwargs.desc+", Try again please"
                                };
                                $scope.data.modalDialogs.messageModal = 
                                UtilsService.showModalMessageAuto($uibModal, "",  'main/modalMessage.html', 'ModalMessageCtrl', "");
                  console.log(error);
                }
                );
            };      
  });
