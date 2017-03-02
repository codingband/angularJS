'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainMessagecongratulationsctrlCtrl
 * @description
 * # MainMessagecongratulationsctrlCtrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('MessageCongratulationsCtrl', 
    function ($scope,$q, MainMatrixService, UtilsService, DataService, I18N, $location, $uibModal, MatrixCasinoService, WPService, $compile) {
        $scope.data = DataService;
        $scope.images = cyberPlayLocalized.images;
        $scope.urlHome = cyberPlayLocalized.urlhome;
        $scope.closeMessage = function() {
          UtilsService.modalDialog.close();
          $location.path('/');
        };
        DataService.openLogin = true;
        $scope.openPayments = function() {
          UtilsService.modalDialog.close();
          $location.path('/'+DataService.language.toLowerCase()+"/payments");
        };
        
        WPService.getSinglePostInCategoryAllTagLanguage("Congratulations Register", "Top content and image congratulations").success(function (res) {
                $scope.topContentImage = res[0]; 
          });
          
       
       WPService.getSinglePostInCategoryAllTagLanguage("Congratulations Register", "Image and content congratulations").success(function (res) {
             $scope.ImageContent = res[0];

        });
        
          WPService.getSinglePostInCategoryAllTagLanguage("Congratulations Register", "Bottom content congratulations").success(function (res) {
                $scope.bottomContent = res[0]; 
          });


           var addHrefLink = $scope.$watch(function(){
                if($('#linkHereCongratulations').is(':visible')){
                    $('#linkHereCongratulations').attr("ng-click", "openPayments()");
                    $compile($('#linkHereCongratulations'))($scope);

                    addHrefLink();
                }

            });
            
            
            var addHrefLinkButton = $scope.$watch(function(){
                if($('#linkButtonCongratulations').is(':visible')){
                    $('#linkButtonCongratulations').attr("ng-click", "openPayments()");
                    $compile($('#linkButtonCongratulations'))($scope);

                    addHrefLinkButton();
                }

            });
  });
