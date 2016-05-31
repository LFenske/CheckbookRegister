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
                $scope.display_all = display_all;
                $scope.filterFunc = display_all ? function(){return true;} : true;
                $scope.filterText = display_all ? "All" : "Uncleared";
            };

            setFilterFunc(true);

            $scope.toggleFilt = function() {
                setFilterFunc(! $scope.display_all);
            };

            $scope.logout = function() {
                $rootScope.setLogged_in(false);
            };

            $scope.openForm = function(templateUrl, controller) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: templateUrl,
                    controller: controller,
                });

                modalInstance.result.then(
                    function(selectedItem) {
                        $scope.selected = selectedItem;  // unused
                    },
                    function() {
                        console.log('Modal dismissed');
                    });
            };

            $scope.openLoginForm = function() {
                $scope.openForm(
                    'templates/loginform.html',
                    'LoginFormController');
            };

            $scope.openCreateUserForm = function() {
                $scope.openForm(
                    'templates/createuserform.html',
                    'LoginFormController');
            };

            $scope.openCreateAccountForm = function() {
                $scope.openForm(
                    'templates/createaccountform.html',
                    'AccountFormController');
            };

            $scope.openEntryForm = function() {
                $scope.openForm(
                    'templates/entryform.html',
                    'EntryFormController');
            };

            $rootScope.setLogged_in = function(p, name, userId) {
                $scope.logged_in = p;
                if ($scope.logged_in) {
                    $scope.username = name;
                    $scope.userId = userId;
                    console.log("username: "+$scope.username+", userId: "+$scope.userId);
                } else {
                    $scope.accounted = false;
                }
            };

            $rootScope.setLogged_in(false);

        }])  // RegisterController

// login and create user forms
    .controller('LoginFormController', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'loginService',
        function(
            $rootScope,
            $scope,
            $uibModalInstance,
            loginService) {

            $scope.loginData = {};
            $scope.createUserData = {};

            $scope.login = function() {
                $uibModalInstance.close();
                loginService.login($scope.loginData).then(
                    function(response) {
                        loginService.access_token = response.id;
                        $rootScope.setLogged_in(true, $scope.loginData.username, response.userId);
                        console.log("login succeeded: "+JSON.stringify(response));
                        console.log("access_token: "+loginService.access_token);
                    },
                    function(response) {
                        console.log("login failed: "+JSON.stringify(response));
                    }
                );
                console.log("login form: "+JSON.stringify($scope.loginData));
            };

            $scope.createuser = function() {
                $uibModalInstance.close();
                loginService.createuser($scope.createUserData);
                console.log("create: "+JSON.stringify($scope.createUserData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // LoginFormController

    .controller('AccountFormController', [
        '$scope',
        '$uibModalInstance',
        'accountService',
        function(
            $scope,
            $uibModalInstance,
            accountService) {
//TODO
            $scope.createAccountData = {};

            $scope.createaccount = function() {
                $uibModalInstance.close();
                accountService.createaccount($scope.createUserData);
                console.log("create: "+JSON.stringify($scope.createAccountData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // AccountFormController

    .controller('EntryFormController', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        function(
            $rootScope,
            $scope,
            $uibModalInstance) {

            var abs = function(x) { return x ? (x>0 ? x : -x) : 0; };

            $scope.entryData = {};

            $scope.save = function() {
                $uibModalInstance.close();
                $scope.entryData.desc = $scope.entryData.description;
                $scope.entryData.amount = abs($scope.entryData.credit) - abs($scope.entryData.debit);
                $rootScope.entries.push($scope.entryData);
                console.log("form entry: "+JSON.stringify($scope.entryData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // EntryFormController

;
