'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/mainMatrixService
 * @description
 * # common/mainMatrixService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
  .factory('MainMatrixService', function (DataService, MatrixCasinoService, MatrixSportsService, MatrixService) {
    var matrixService = "";
    if(DataService.playSection === "casino")
        matrixService = MatrixCasinoService;
    else if(DataService.playSection === "sports")
        matrixService = MatrixSportsService;
    else 
        matrixService =  MatrixService;

    return matrixService;
  });
