'use strict';

angular.module('checkbook.controllers', [])

    .controller('RegisterController', [
        '$scope',
        'registerFactory',
//        'entries',
        function(
            $scope,
            registerFactory) {

//            $scope.entries = entries;

            $scope.entries = registerFactory.query(
                function(response) {
                    $scope.entries = response;
                },
                function(response) {
                    console.log("registerFactory.query() failed "+response);
                }
            );
        }])

;
