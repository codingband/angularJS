'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainClockpanelctrlCtrl
 * @description
 * # MainClockpanelctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('ClockPanelCtrl', 
    function ($scope, $q, UtilsService, MatrixService, MainMatrixService, DataService, $uibModal) {
            $scope.data = DataService;       
            $scope.hours = 0;
            $scope.minutes = 0;
            $scope.currentDay='';
            $scope.correntdn='';
            
            $scope.$watch(function(){
                var d = new Date();
                var hoursR=d.getHours();
                var minutesR=d.getMinutes();
                
                $scope.hours = hoursR;
                $scope.minutes = minutesR;
                
                var dn="PM";
                $scope.correntdn = dn;
                if ($scope.hours < 12)
                    var dn="AM";
                $scope.correntdn = dn;
                if ($scope.hours > 12)
                    $scope.hours = $scope.hours-12;
                if ($scope.hours === 0)
                    $scope.hours=12;
            
                if ($scope.minutes<=9)
                    $scope.minutes="0"+$scope.minutes;
            });     
  });
