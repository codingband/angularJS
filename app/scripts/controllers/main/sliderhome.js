'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainSliderhomeCtrl
 * @description
 * # MainSliderhomeCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('SliderHomeCtrl', function ($scope, $http, $q, WPService, MainMatrixService, UtilsService, DataService ) {
    WPService.getSliders('slider-home').success(function(res){
                    $scope.data.sliders = res;
    });
    
  });
