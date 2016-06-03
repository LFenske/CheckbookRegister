'use strict';

angular.module('checkbook.controllers', ['ui.bootstrap'])

    .controller('RegisterController', [
        '$rootScope',
        '$scope',
        '$uibModal',
        'loginService',
        'accountService',
        'entryService',
//        'entries',
//        'misc',
        function(
            $rootScope,
            $scope,
            $uibModal,
            loginService,
            accountService,
            entryService) {

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
                $scope.setLogged_in(false);
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

            $scope.setAccounted = function(p, acctId) {
                $scope.accounted = p;
                if ($scope.accounted) {
                    accountService.acctId = acctId;
                    console.log("acctId: "+accountService.acctId);
                    accountService.get();
                    if (loginService.info.recent !== acctId) {
                        loginService.update({recent:acctId});
                    }
                    entryService.getEntries($scope.setEntries);
                }
            };
            accountService.setAccounted = $scope.setAccounted;

            $scope.setLogged_in = function(p, name, custId) {
                $scope.logged_in = p;
                if ($scope.logged_in) {
                    $scope.username = name;
                    loginService.custId = custId;
                    console.log("username: "+$scope.username+", custId: "+loginService.custId);
                    loginService.get(
                        function() {
                            var recent = loginService.info.recent;
                            if (recent !== "") {
                                accountService.setAccounted(true, recent);
                                $scope.accountSelected = recent;
                            } else {
                                $scope.accountSelected = "add";
                            }
                        });
                } else {
                    $scope.setAccounted(false);
                }
            };
            $scope.setLogged_in(false);
            loginService.setLogged_in = $scope.setLogged_in;

            $scope.accountSelected = "add";
            $scope.selectAccount = function() {
                console.log("selectAccount accountSelected: "+JSON.stringify($scope.accountSelected));
                $scope.setAccounted(true, $scope.accountSelected);
            };

            $scope.setAccountData = function(data) {
                $scope.accountData = data;
                console.log("setAccountData: "+JSON.stringify(data));
            };

            $rootScope.getAccountList = function() {
                accountService.getAccountList($scope.setAccountData);
            };


            $scope.clearcode = "01";

            $scope.setClearcode = function(newClearcode) {
                $scope.clearcode = newClearcode;
                if (accountService.info.clearcode !== newClearcode) {
                    accountService.update({clearcode:newClearcode});
                }
            };
            accountService.setClearcode = $scope.setClearcode;

            $scope.selectClearcode = function() {
                $scope.setClearcode($scope.clearcode);
            };

            $scope.toggleCleared = function(lineno) {
                if ($scope.entries[lineno].cleared) {
                    $scope.entries[lineno].cleared = "";
                    $scope.cleared -= $scope.entries[lineno].amount;
                } else {
                    $scope.entries[lineno].cleared = $scope.clearcode;
                    $scope.cleared += $scope.entries[lineno].amount;
                }
                entryService.update($scope.entries[lineno].id, {cleared: $scope.entries[lineno].cleared});
                console.log("toggleCleared: "+lineno+" = "+$scope.entries[lineno].cleared);
                //TODO
            };


            $scope.setEntries = function(data) {
                var ix;
                console.log("setEntries: "+JSON.stringify(data));
                $scope.entries = [];
                for (ix=0; ix<data.length; ix++) {
                    var d=data[ix];
                    $scope.entries[d.lineno] = d;
                }
                $scope.balance = 0;
                $scope.cleared = 0;
                for (ix=0; ix<$scope.entries.length; ix++) {
                    var e=$scope.entries[ix];
                    if (e) {
                        console.log("balance: "+$scope.balance+", e: "+JSON.stringify(e));
                        $scope.balance += e.amount;
                        if (e.cleared) {
                            $scope.cleared += e.amount;
                        }
                        e.balance = $scope.balance;
                        console.log("balance: "+$scope.balance+", e: "+JSON.stringify(e));
                    }  else {
                        $scope.entries[ix] = {lineno: ix, amount: 0};
                    }
                }
                console.log("balance: "+$scope.balance);
                console.log("cleared: "+$scope.cleared);
                console.log("$scope.entries: "+JSON.stringify($scope.entries));
            };

            $rootScope.appendEntry = function(e) {
                e.lineno = accountService.info.nextline;
                $scope.entries[e.lineno] = e;
                accountService.info.nextline++;
                accountService.update({nextline:accountService.info.nextline});
                entryService.createEntry(e);
                $scope.balance += e.amount;
                if (e.cleared) {
                    $scope.cleared += e.amount;
                }
                e.balance = $scope.balance;
            };

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
                        loginService.setLogged_in(true, $scope.loginData.username, response.userId);
                        console.log("login succeeded: "+JSON.stringify(response));
                        console.log("access_token: "+loginService.access_token);
                        $rootScope.getAccountList();
                    },
                    function(response) {
                        console.log("login failed: "+JSON.stringify(response));
                    }
                );
                console.log("login form: "+JSON.stringify($scope.loginData));
            };

            $scope.createUser = function() {
                $uibModalInstance.close();
                loginService.count($scope.createUserData.username)
                    .then(
                        function(response) {
                            if (response.count === 0) {
                                loginService.createUser($scope.createUserData);
                                console.log("createUser: "+JSON.stringify($scope.createUserData));
                            } else {
                                console.log("createUser: user already exists "+response.count+" time(s)");
                            }
                        },
                        function(response) {
                            console.log("loginService.count failed: "+JSON.stringify(response));
                        }
                    );
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // LoginFormController

    .controller('AccountFormController', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'accountService',
        function(
            $rootScope,
            $scope,
            $uibModalInstance,
            accountService) {

            $scope.createAccountData = {};

            $scope.createAccount = function() {
                $uibModalInstance.close();
                accountService.count($scope.createAccountData.acctname)
                    .then(
                        function(response) {
                            if (response.count === 0) {
                                accountService.createAccount(
                                    $scope.createAccountData,
                                    function() { $rootScope.getAccountList(); });
                                console.log("createAccount: "+JSON.stringify($scope.createAccountData));
                            } else {
                                console.log("createAccount: account already exists "+response.count+" time(s)");
                            }
                        },
                        function(response) {
                            console.log("accountService.count failed: "+JSON.stringify(response));
                        }
                    );
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
                console.log("form entry: "+JSON.stringify($scope.entryData));
                $uibModalInstance.close();
                $scope.entryData.desc = $scope.entryData.description;
                $scope.entryData.amount = abs($scope.entryData.credit) - abs($scope.entryData.debit);
                $rootScope.appendEntry($scope.entryData);
                console.log("form entry: "+JSON.stringify($scope.entryData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // EntryFormController

;
