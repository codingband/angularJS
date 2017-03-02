'use strict';

/**
 * @ngdoc directive
 * @name cyberplayerThemeV20App.directive:news/contentNews
 * @description
 * # news/contentNews
 */
angular.module('cyberplayerThemeV20App')
  .directive('contentNews', function () {
      return {
            restrict: 'A', // attribute
            controller: 'ContentNewsCtrl',
            templateUrl: cyberPlayLocalized.views+'views/news/contentNews.html'
        };
  });
