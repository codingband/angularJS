'use strict';

/**
 * @ngdoc filter
 * @name cyberplayerThemeV20App.filter:toTrusted
 * @function
 * @description
 * # toTrusted
 * Filter in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
  .filter('toTrusted', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
  });
