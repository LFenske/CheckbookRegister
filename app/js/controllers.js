'use strict';

angular.module('checkbook.controllers', [])

    .controller('RegisterController', [
        '$scope',
        'entries',
        'misc',
        function(
            $scope,
            entries,
            misc) {

            console.log("misc = "+JSON.stringify(misc));
            console.log("entries = "+JSON.stringify(entries));
            $scope.entries = entries;
            $scope.misc    = misc;

            var balance    = $scope.misc.balance;
            $scope.cleared = $scope.misc.balance;
            for (var i=$scope.misc.next_id-1; i>=0; i--) {
                $scope.entries[i].balance = balance;
                balance -= $scope.entries[i].amount;
                if ($scope.entries[i].cleared === "") {
                    $scope.cleared -= $scope.entries[i].amount;
                }
            }

            var setFilterFunc = function(display_all) {
                $scope.display_all = display_all;
                $scope.filterFunc = display_all ? function(){return true;} : true;
                $scope.filterText = display_all ? "All" : "Uncleared";
            };

            setFilterFunc(true);

            $scope.toggleFilt = function() {
                setFilterFunc(! $scope.display_all);
            };

        }])

;
