'use strict';

angular.module('checkbook.controllers', ['ui.bootstrap'])

    .controller('RegisterController', [
        '$rootScope',
        '$scope',
        '$uibModal',
//        'entries',
//        'misc',
        function(
            $scope,
            $localscope,
            $uibModal) {

//            var misc    = "misc"   ;
//            var entries = "entries";
//
//            console.log("misc = "+JSON.stringify(misc));
//            console.log("entries = "+JSON.stringify(entries));
//            $scope.entries = entries;
//            $scope.misc    = misc;
//
//            var balance    = $scope.misc.balance;
//            $scope.cleared = $scope.misc.balance;
//            for (var i=$scope.misc.next_id-1; i>=0; i--) {
//                $scope.entries[i].balance = balance;
//                balance -= $scope.entries[i].amount;
//                if ($scope.entries[i].cleared === "") {
//                    $scope.cleared -= $scope.entries[i].amount;
//                }
//            }

            var setFilterFunc = function(display_all) {
                $scope.display_all = display_all;
                $scope.filterFunc = display_all ? function(){return true;} : true;
                $scope.filterText = display_all ? "All" : "Uncleared";
            };

            setFilterFunc(true);

            $scope.toggleFilt = function() {
                setFilterFunc(! $scope.display_all);
            };

            $scope.openEntryForm = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/entryform.html',
                    controller: 'EntryFormController',
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $scope.selected = selectedItem;
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $scope.openLoginForm = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/loginform.html',
                    controller: 'LoginFormController',
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $scope.selected = selectedItem;
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $scope.openCreateForm = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/createform.html',
                    controller: 'LoginFormController',
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $scope.selected = selectedItem;
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $scope.setLogged_in = function(p, name) {
                $localscope.logged_in = p;
                if ($localscope.logged_in) {
                    $localscope.username = name;
                } else {
                    $localscope.accounted = false;
                }
            };

            $scope.setLogged_in(false);

        }])  // controller

    .controller('EntryFormController', [
        '$rootScope',
        '$uibModalInstance',
        function(
            $scope,
            $uibModalInstance) {

            var abs = function(x) { return x ? (x>0 ? x : -x) : 0; };

            $scope.entryData = {};

            $scope.save = function() {
                $uibModalInstance.close();
                $scope.entryData.desc = $scope.entryData.description;
                $scope.entryData.amount = abs($scope.entryData.credit) - abs($scope.entryData.debit);
                $scope.entries.push($scope.entryData);
                console.log("form entry: "+JSON.stringify($scope.entryData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // controller

    .controller('LoginFormController', [
        '$rootScope',
        '$uibModalInstance',
        'loginService',
        function(
            $scope,
            $uibModalInstance,
            loginService) {

            $scope.loginData = {};
            $scope.createData = {};

            $scope.login = function() {
                $uibModalInstance.close();
                loginService.login($scope.loginData).then(
                    function(response) {
                        $scope.access_token = response.id;
                        $scope.setLogged_in(true, $scope.loginData.username);
                        console.log("login succeeded: "+JSON.stringify(response));
                        console.log("access_token: "+$scope.access_token);
                    },
                    function(response) {
                        console.log("login failed: "+JSON.stringify(response));
                    }
                );
                console.log("login form: "+JSON.stringify($scope.loginData));
            };

            $scope.logout = function() {
                $scope.setLogged_in(false);
            };

            $scope.createuser = function() {
                $uibModalInstance.close();
                loginService.createuser($scope.createData);
                console.log("create: "+JSON.stringify($scope.createData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // controller

;
