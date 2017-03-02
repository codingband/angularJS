'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:NewsContentnewsCtrl
 * @description
 * # NewsContentnewsCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('ContentNewsCtrl', function ($scope, $http, $q, WPService, MatrixService, UtilsService, DataService,$uibModal, I18N) {
    $scope.i18n = I18N[DataService.language];
  });
