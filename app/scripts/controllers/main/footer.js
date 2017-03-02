'use strict';

/**
 * @ngdoc function
 * @name cyberplayerThemeV20App.controller:MainFooterctrlCtrl
 * @description
 * # Footerctrl
 * Controller of the cyberplayerThemeV20App
 */
angular.module('cyberplayerThemeV20App')
  .controller('FooterCtrl', 
    function ($scope, $http, $location, $q, WPService, MainMatrixService, UtilsService, DataService, $uibModal, MatrixService) {
        UtilsService.putDefaultLocalStorageData();
        $scope.data = DataService;
        
        var verifyBasicConfig = function () {
        //check the config for iovation
            var promiseBasicConfig = MatrixService.basicConfig($q);
            promiseBasicConfig.then(
                function (success) {

                    $scope.data.iovation.enabled = success.kwargs.iovation.enabled;
                    $scope.data.iovation.javaScriptUrl = success.kwargs.iovation.javaScriptUrl;
                    localStorage.setItem("urlIovation", success.kwargs.iovation.javaScriptUrl);
                   
                   if(localStorage.getItem("urlIovation") !== "null" && DataService.iovationBlackBox === ""){
                        UtilsService.getNewIovationBlackBox(DataService);
                   }
                   
                   clearwatchinvonation();

                }, function (error) {
                    console.log(error);
                }
             );
         };
         
        var clearwatchinvonation = $scope.$watch(function () {
           
            verifyBasicConfig();  
            if($scope.data.iovation.enabled){
                clearwatchinvonation();
                
            }

        });

        $scope.urlHome = "/" + DataService.language.toLowerCase();

        $scope.langTag = "" ;
        //footer obtain images and displays them (WordPress check post)  
        
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image MasterCard").success(function (res) {
           $scope.MasterCardLogo=res[0];
         });
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image VisaElectron").success(function (res) {
           $scope.VisaElectronLogo=res[0];
         });
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image Netller").success(function (res) {
           $scope.NetllerLogo=res[0];
         });
        
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image FastBankTransfer").success(function (res) {
           $scope.FastBankTransferLogo=res[0];
         }); 
        
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image UseMyservice").success(function (res) {
           $scope.UseMyserviceLogo=res[0];
         }); 

        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image Curacao").success(function (res) {
           $scope.CuracaoLogo=res[0];
         });
        //-19
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image GamblingCommission").success(function (res) {
           $scope.GamblingCommissionLogo=res[0];
         });
        //-20
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image N18").success(function (res) {
           $scope.N18Logo=res[0];
         }); 
        //-21
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image NetEnt").success(function (res) {
           $scope.NetEntLogo=res[0];
         }); 
         //-22
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image Micrograming").success(function (res) {
           $scope.MicrogramingLogo=res[0];
         });
         //-23
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image IgtLogo2").success(function (res) {
           $scope.IgtLogo2Logo=res[0];
         });
        //-24
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image Edict").success(function (res) {
           $scope.EdictLogo=res[0];
         }); 
        //-25
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image EvolutionGaming").success(function (res) {
           $scope.EvolutionGamingLogo=res[0];
         }); 
         
         //-27
        WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image PlayGo").success(function (res) {
           $scope.PlayGoLogo=res[0];
         });

         WPService.getPostsInCategoryWithAllTags("Footer Images", "Footer Image gambleawareUK").success(function (res) {
           $scope.gambleawareUK=res[0];
         });
 
        WPService.getMenuLang("footermenu",  localStorage.getItem("language")).success(function (result) {
             $scope.menuFooter = result;                                
         });
 

        WPService.getSinglePostInCategoryAllTagLanguage("Footer", "Partner").success(function (res) {
           
            $scope.partner = res[0];
        });
        var culture = UtilsService.getCorrectlanguageCode();
        var promiseCountries = MainMatrixService.getInstance().getCountries($q, DataService, culture);
          $('#table-jackpots').vTicker('remove');
          $('#table-winner').vTicker('remove');
          $('#last-winners').vTicker('remove');
        promiseCountries.then(
            function(success) {
                loadContentAboutUs(DataService.currentIPCountry);
            }, function(error) { 
                console.log("error", error);
            }
        );

        var loadContentAboutUs = function(currentIPCountry){
            
            WPService.getSinglePostInCategoryAllTagLanguage("about-us","about-us-1").success(function (res) {
                for(var index in res){
                    var country = res[index].title.split("-");
                    if( currentIPCountry === 'GB'){
                        currentIPCountry = 'UK';
                    }
                    if(currentIPCountry === 'UK' && country[1] === currentIPCountry){
                        $scope.aboutus = res[index];
                        $scope.aboutus.title = country[0];
                        $scope.langTag = "UK";
                    }
                    if(currentIPCountry !== 'UK' && country[1] === 'noUK'){
                        $scope.aboutus = res[index];
                        $scope.aboutus.title = country[0];
                    }
                } 
            });
        };

        WPService.getSinglePostInCategoryAllTagLanguage("Footer","Disclaimer").success(function (res) {  
          $scope.payment = res[0];

        });

        WPService.getSinglePostInCategoryAllTagLanguage("Footer","Home").success(function (res) {  
          $scope.home = res[0];                      
        });


        $scope.openMenuOption = function (value, type) {
            if (type === "page") {
                if(value === "/affiliates"){
                    window.open('http://www.viksaffiliates.com', '_blank');
                }                               
                else{
                    window.location = cyberPlayLocalized.urlhome+'/'+DataService.language.toLowerCase()+value;  
                }                           
            }else{
                if (type === "modal"){
                    window.location = cyberPlayLocalized.urlhome+'/'+DataService.language.toLowerCase()+value;  
                }
                else{
                    window.location = cyberPlayLocalized.urlhome+'/'+DataService.language.toLowerCase()+value;
                }
            }
        };

        function changeTitle(menu) {
            for (var i = 0; i < menu.length; i++) {
                    var titleMenu = menu[i].title;
                    menu[i].title = $scope.i18n[titleMenu];
                    if(menu[i].url === "/affiliates"){
                        $scope.urlAffiliates = "http://www.viksaffiliates.com";
                        menu[i].url = "http://www.viksaffiliates.com";

                    }
                };

            return menu;
        }              
          
  });
