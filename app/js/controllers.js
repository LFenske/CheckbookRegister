'use strict';

angular.module('checkbook.controllers', [])

    .controller('RegisterController', [
        '$scope',
        'entries',
        function(
            $scope,
            entries) {

            $scope.entries = entries;
        }])

;
