'use strict';

/**
 * @ngdoc directive
 * @name cyberplayerThemeV20App.directive:news/rightMenuNews
 * @description
 * # news/rightMenuNews
 */
angular.module('cyberplayerThemeV20App')
  .directive('rightMenuNews', function () {
        return {
            restrict: 'A', // attribute
            controller: 'RightMenuNewsCtrl',
            templateUrl: cyberPlayLocalized.views+'views/news/rightMenuNews.html'
        };
  });
