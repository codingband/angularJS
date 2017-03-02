'use strict';

/**
 * @ngdoc service
 * @name cyberplayerThemeV20App.common/matrixSportsService
 * @description
 * # common/matrixSportsService
 * Factory in the cyberplayerThemeV20App.
 */
angular.module('cyberplayerThemeV20App')
  .factory('MatrixSportsService', function ($http, MatrixService) {
    var MatrixSportsService = {
                type: "MatrixSportsService"
            };
            
            MatrixSportsService.getDisciplines = function($q, parameters){
                var deferred = $q.defer();
                MatrixService.sessionConnection.call("/sports#disciplines",[],parameters).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                });        
                return deferred.promise;
            };
            
            MatrixSportsService.getLocations = function($q,id, object){
                var deferred = $q.defer();
                var parameters = {
                    "lang":"en",
                    "groupId":1,
                    "hoursTillLive":8,
                    "disciplineId":id
                };
                
                MatrixService.sessionConnection.call("/sports#locations", [], parameters).then(
                    function (result) {
                        if(result == null){
                            object["locations"] = [];
                        }else{
                            object["locations"] = result.kwargs;
                        }
                        deferred.resolve(object);
                    }, function (error) {
                        deferred.reject(error);
                });      
                
                return deferred.promise;
            };           
            
            MatrixSportsService.getTournaments = function($q, id, object){
                var deferred = $q.defer();
                var parameters = {
                    "lang":"en",
                    "locationId":id
                };
                
                MatrixService.sessionConnection.call("/sports#tournaments", [], parameters).then(
                    function (result) {                        
                        if(result == null){
                            object["tournaments"] = [];
                        }else{
                            object["tournaments"] = result.kwargs;
                        }
                        
                        deferred.resolve(object);
                    }, function (error) {
                        deferred.reject(error);
                });      
                
                return deferred.promise;
            }; 
            
            MatrixSportsService.getMatches = function($q, parameters){
                var deferred = $q.defer();
    
                MatrixService.sessionConnection.call("/sports#matches",[],parameters).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                });   
                
                return deferred.promise;
            };

            MatrixSportsService.getScores = function($q, parameters, object){
                var deferred = $q.defer();
    
                MatrixService.sessionConnection.call("/sports#scores",[],parameters).then(
                    function (result) {
                        if(result == null){
                            object["scores"] = [];
                        }else{
                            object["scores"] = result.kwargs;
                        }
                        deferred.resolve(object);
                    }, function (error) {
                        object["scores"] = [];
                        deferred.reject(error);
                });        
                return deferred.promise;
            };

            MatrixSportsService.getLiveCoveredMatches = function($q, parameters){
                var deferred = $q.defer();

                MatrixService.sessionConnection.call("/sports#liveCoveredMatches",[],parameters).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                });        
                return deferred.promise;
            };
            
            MatrixSportsService.getBetTypes = function($q){
                var deferred = $q.defer();
                
                MatrixService.sessionConnection.call("/sports#betTypes",[]).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                });        
                return deferred.promise;
            };
            
            MatrixSportsService.getOdds = function($q, parameters){
                var deferred = $q.defer();

                MatrixService.sessionConnection.call("/sports#odds",[],parameters).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                });        
                return deferred.promise;
            };
            
            MatrixSportsService.placeBet = function($q, parameters){
                var deferred = $q.defer();
                console.log("paa", parameters)
                MatrixService.sessionConnection.call("/sports#placeBet",[],parameters).then(
                    function (result) {
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                });        
                return deferred.promise;
            };
            
            MatrixSportsService.getDefaultData = function (DataService, $q){
                DataService.locations = [];
                var parameters = {
                    "lang":"en",
                    "groupId":1,
                    "hoursTillLive":8
                };
                var promiseAll = MatrixSportsService.getDisciplinesByLocationsByTournaments(parameters, $q, DataService);
                promiseAll.then(
                    function (result){ }, 
                    function(error){ }
                ); 
            };
            
            MatrixSportsService.getDisciplinesByLocationsByTournaments = function(parameters, $q, DataService){
                var deferred = $q.defer();
                var promiseSportsService = MatrixSportsService.getDisciplines($q, parameters);
                promiseSportsService.then(
                    function(success) {
                        DataService.disciplines = success.kwargs;
                        
                        for(var i = 0; i < DataService.disciplines.length; i++){
                            var promiseLocations = MatrixSportsService.getLocations($q,DataService.disciplines[i].model.id, DataService.disciplines[i]);
                            promiseLocations.then(
                                function(object){
                                    for(var j = 0; j < object.locations.length; j++){
                                        MatrixSportsService.getTournaments($q, object.locations[j].model.id, 
                                        object.locations[j]).then(
                                                function(result){
                                                    deferred.resolve(result);
                                                },
                                                function(error){
                                                    deferred.reject(error);
                                                    console.log("error", error);
                                                }
                                        );                                
                                    }
                                    
                                }, function(error) {
                                    console.log(error);
                                }
                            );
                        }
                    }, function(error) {
                        console.log(error);
                    }
                );
                return deferred.promise;
            };
            
            MatrixSportsService.getBetHistory = function($q, parameters) {
              var deferred = $q.defer();

              MatrixService.sessionConnection.call("/sports#betHistory", [], parameters).then(
                      function(result) {
                        deferred.resolve(result);
                      }, function(error) {
                deferred.reject(error);
              });

              return deferred.promise;
            };
            
            MatrixSportsService.getAllLiveMatches = function($q, DataService){
                var deferred = $q.defer();
                var liveParameters = {
                    lang:"en",
                    liveStatus:"LIVE",
                    virtualStatus:"BOTH"
                };
                MatrixSportsService.getDisciplines($q, liveParameters).then(
                    function(success) {
                        DataService.liveDisciplines = success.kwargs;
                        for(var i in DataService.liveDisciplines){
                            getLiveMatches(DataService.liveDisciplines[i]);
                        }
                    }, function(error) {
                        console.log(error);
                    }
                );
                var getLiveMatches = function(disciplines){
                    
                    var parameters = {
                        groupId: 1,
                        lang: "en",
                        disciplineId: disciplines.model.id,
                        liveStatus: "LIVE"
                    };
                    MatrixSportsService.getMatches($q, parameters, disciplines).then(
                        function(result){
                            if(result === null){
                                disciplines["matches"] = [];
                            }else{
                                disciplines["matches"] = result.kwargs;
                            }
                            for(var j in disciplines.matches){
                                getScores(disciplines.matches[j]);
                            }
                        },function(error){ console.log("ERROR", error);}
                    );
                };
                var getScores = function(match){

                    var parameters = {
                        matchId:match.model.id,
                        lang:"en"
                    };
                    MatrixSportsService.getScores($q, parameters, match).then(
                        function (object) {
                            deferred.resolve(object);
                        },
                        function (error) {
                            deferred.reject(error);
                            //console.log("ERROR: ", error.kwargs);
                        }
                    );
                };
                return deferred.promise;
            };
            
            MatrixSportsService.getInstance = function (){
                return angular.extend({}, MatrixService, MatrixSportsService);
            };

    return MatrixSportsService;
  });
