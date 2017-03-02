'use strict';
/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainErrorpage404Ctrl
 * @description
 * # MainErrorpage404Ctrl
 * Controller of the cyberplayerThemeV20App
 */ 
angular.module('cyberplayerThemeV20App')
  .controller('Error404Ctrl',    
   function ($rootScope, $scope, $uibModal, $q, $routeParams, $location, $base64, $sce) {
        window.prerenderReady = false;
        //$scope.data.Error404=false;
        var heightPage= $( window ).height();
        $("#contentError404").height(heightPage - 60);
  });
