'use strict';

angular.module('checkbook.controllers', ['ui.bootstrap'])

    .controller('RegisterController', [
        '$rootScope',
        '$scope',
        '$uibModal',
//        'entries',
//        'misc',
        function(
            $rootScope,
            $scope,
            $uibModal) {

//            var misc    = "misc"   ;
//            var entries = "entries";
//
//            console.log("misc = "+JSON.stringify(misc));
//            console.log("entries = "+JSON.stringify(entries));
//            $rootScope.entries = entries;
//            $rootScope.misc    = misc;
//
//            var balance    = $rootScope.misc.balance;
//            $rootScope.cleared = $rootScope.misc.balance;
//            for (var i=$rootScope.misc.next_id-1; i>=0; i--) {
//                $rootScope.entries[i].balance = balance;
//                balance -= $rootScope.entries[i].amount;
//                if ($rootScope.entries[i].cleared === "") {
//                    $rootScope.cleared -= $rootScope.entries[i].amount;
//                }
//            }

            var setFilterFunc = function(display_all) {
                $rootScope.display_all = display_all;
                $rootScope.filterFunc = display_all ? function(){return true;} : true;
                $rootScope.filterText = display_all ? "All" : "Uncleared";
            };

            setFilterFunc(true);

            $rootScope.toggleFilt = function() {
                setFilterFunc(! $rootScope.display_all);
            };

            $rootScope.openEntryForm = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/entryform.html',
                    controller: 'EntryFormController',
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $rootScope.selected = selectedItem;
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $rootScope.openLoginForm = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/loginform.html',
                    controller: 'LoginFormController',
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $rootScope.selected = selectedItem;
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $rootScope.openCreateForm = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/createform.html',
                    controller: 'LoginFormController',
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $rootScope.selected = selectedItem;
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $rootScope.setLogged_in = function(p, name) {
                $scope.logged_in = p;
                if ($scope.logged_in) {
                    $scope.username = name;
                } else {
                    $scope.accounted = false;
                }
            };

            $rootScope.setLogged_in(false);

        }])  // controller

    .controller('EntryFormController', [
        '$rootScope',
        '$uibModalInstance',
        function(
            $rootScope,
            $uibModalInstance) {

            var abs = function(x) { return x ? (x>0 ? x : -x) : 0; };

            $rootScope.entryData = {};

            $rootScope.save = function() {
                $uibModalInstance.close();
                $rootScope.entryData.desc = $rootScope.entryData.description;
                $rootScope.entryData.amount = abs($rootScope.entryData.credit) - abs($rootScope.entryData.debit);
                $rootScope.entries.push($rootScope.entryData);
                console.log("form entry: "+JSON.stringify($rootScope.entryData));
            };

            $rootScope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // controller

    .controller('LoginFormController', [
        '$rootScope',
        '$uibModalInstance',
        'loginService',
        function(
            $rootScope,
            $uibModalInstance,
            loginService) {

            $rootScope.loginData = {};
            $rootScope.createData = {};

            $rootScope.login = function() {
                $uibModalInstance.close();
                loginService.login($rootScope.loginData).then(
                    function(response) {
                        $rootScope.access_token = response.id;
                        $rootScope.setLogged_in(true, $rootScope.loginData.username);
                        console.log("login succeeded: "+JSON.stringify(response));
                        console.log("access_token: "+$rootScope.access_token);
                    },
                    function(response) {
                        console.log("login failed: "+JSON.stringify(response));
                    }
                );
                console.log("login form: "+JSON.stringify($rootScope.loginData));
            };

            $rootScope.logout = function() {
                $rootScope.setLogged_in(false);
            };

            $rootScope.createuser = function() {
                $uibModalInstance.close();
                loginService.createuser($rootScope.createData);
                console.log("create: "+JSON.stringify($rootScope.createData));
            };

            $rootScope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // controller

;
