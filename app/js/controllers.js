'use strict';

angular.module('checkbook.controllers', [])

    .controller('RegisterController', [
        '$scope',
        'registerFactory',
        'entries',
        'misc',
        function(
            $scope,
            registerFactory,
            entries,
            misc) {

            console.log("misc = "+JSON.stringify(misc));
            console.log("entries = "+JSON.stringify(entries));
            $scope.entries = entries;
            $scope.misc    = misc;

            var balance = $scope.misc.balance;
            for (var i=$scope.misc.next_id-1; i>=0; i--) {
                $scope.entries[i].balance = balance;
                balance -= $scope.entries[i].amount;
            }
        }])

;
