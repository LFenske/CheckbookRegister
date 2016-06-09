'use strict';

angular.module('checkbook.controllers', ['ui.bootstrap'])

    .controller('RegisterController', [
        '$rootScope',
        '$scope',
        '$uibModal',
        'loginService',
        'accountService',
        'entryService',
        function(
            $rootScope,
            $scope,
            $uibModal,
            loginService,
            accountService,
            entryService) {

            ///// Handle the filter.  When display_all is true,
            ///// all entries are displayed; when false, only
            ///// uncleared entries are displayed.

            // setFilterFunc: Turn the filter on or off.
            var setFilterFunc = function(display_all) {
                $scope.display_all = display_all;
                // Used by register.html.
                $scope.filterFunc = display_all ? function(){return true;} : true;
                $scope.filterText = display_all ? "All" : "Uncleared";
            };

            // display_all defaults to true.
            setFilterFunc(true);

            // toggleFilt is called from a register.html button.
            $scope.toggleFilt = function() {
                setFilterFunc(! $scope.display_all);
            };


            ///// Handle login state.

            // Log out.
            $scope.logout = function() {
                $scope.setLogged_in(false);
            };

            // Opening a form is similar in all cases.  This is the common code.
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
            // Need to open a form from a different controller.
            $rootScope.openForm = $scope.openForm;

            // The following are all the forms openable from the main page.

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

            $scope.openSelectAccountModal = function() {
                $scope.openForm(
                    'templates/selectaccountmodal.html',
                    'AccountSelectController');
            };

            $scope.openEntryForm = function() {
                $scope.openForm(
                    'templates/entryform.html',
                    'EntryFormController');
            };


            ///// Handle selecting and displaying an account.

            // setAccounted has to be before setLogged_in or there's
            // an error.  TODO Doesn't make sense.

            // Set the accounted boolean indicating an account has
            // been selected.  Used in register.html to selectively
            // display elements.  If one has been selected, find the
            // account identifier and name.
            $scope.setAccounted = function(p, acctId) {
                $scope.accounted = p;
                if ($scope.accounted) {
                    accountService.acctId = acctId;
                    // Search through the accountData for the name of
                    // this account.
                    $scope.acctname = "unknown name";
                    for (var ix=0; ix<$rootScope.accountData.length; ix++) {
                        var acct = $rootScope.accountData[ix];
                        if (acct.id === acctId) {
                            console.log("match");
                            $scope.acctname = acct.acctname;
                        }
                    }
                    console.log("acctId: "+accountService.acctId);
                    // Store this acctId as the most recently used, as
                    // a default for next login.
                    accountService.get();
                    if (loginService.info.recent !== acctId) {
                        loginService.update({recent:acctId});
                    }
                    // Retrieve all entries for this account.
                    entryService.getEntries($scope.setEntries);
                }
            };
            // This needs to be called from a callback.  $scope didn't
            // work inside the function if called as
            // $scope.setAccounted() from the callback.  TODO Why?
            accountService.setAccounted = $scope.setAccounted;

            // Set the logged_in boolean for use in register.html to
            // selectively display elements.  If true, set the
            // username and custId, and retrieve user information,
            // i.e. most recently used account.
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
            // Default to not logged in.
            $scope.setLogged_in(false);
            // Need to call this from another controller.
            loginService.setLogged_in = $scope.setLogged_in;

            // Default "account" is set to create a new account.
            $scope.accountSelected = "add";

            // selectAccount is called from another controller.
            $rootScope.selectAccount = function(accountSelected) {
                if (accountSelected) {
                    $scope.accountSelected = accountSelected;
                }
                console.log("selectAccount accountSelected: "+JSON.stringify($scope.accountSelected));
                $scope.setAccounted(true, $scope.accountSelected);
            };

            // Store the accountData once it's retrieved from the server.
            // Also, call setAccounted again with current values so
            // that the account name can be set properly now that we
            // have the data.
            $scope.setAccountData = function(data) {
                $rootScope.accountData = data;
                console.log("setAccountData: "+JSON.stringify(data));
                $scope.setAccounted($scope.accounted, accountService.acctId);
            };

            // Retrieve the list of accounts from the server.  Call
            // setAccountData once we have it.
            $rootScope.getAccountList = function() {
                accountService.getAccountList($scope.setAccountData);
            };


            ///// Handle the clearcode and clearing/unclearing an entry.

            // Default clearcode is "X" for now.
            $scope.clearcode = "X";

            // Set the new clearcode and store it on the server if
            // it's different from before.
            $scope.setClearcode = function(newClearcode) {
                $scope.clearcode = newClearcode;
                if (accountService.info.clearcode !== newClearcode) {
                    accountService.update({clearcode:newClearcode});
                }
            };
            // We need to call this from another controller.
            accountService.setClearcode = $scope.setClearcode;

            // selectClearCode is called from register.html, which
            // sets clearcode directly.
            $scope.selectClearcode = function() {
                $scope.setClearcode($scope.clearcode);
            };

            // Change an entry between being marked as cleared and not.
            // Adjust cleared balance.
            // Used by register.html.
            $scope.toggleCleared = function(lineno) {
                if ($scope.entries[lineno].cleared) {
                    // This entry was cleared; unclear it.
                    $scope.entries[lineno].cleared = "";
                    $scope.cleared -= $scope.entries[lineno].amount;
                } else {
                    // This entry was uncleared; clear it with clearcode.
                    $scope.entries[lineno].cleared = $scope.clearcode;
                    $scope.cleared += $scope.entries[lineno].amount;
                }
                // Save new cleared value in the server.
                entryService.update($scope.entries[lineno].id, {cleared: $scope.entries[lineno].cleared});
                console.log("toggleCleared: "+lineno+" = "+$scope.entries[lineno].cleared);
            };


            ///// Handle entries.

            // setEntries: A new set of entries has been retrieved.
            // Load them into $scope.entries by lineno, effectively
            // sorting them.  Then, compute total balance and cleared
            // balance, and balance for each line.
            $scope.setEntries = function(data) {
                var ix;
                console.log("setEntries: "+JSON.stringify(data));
                // Sort data into entries.
                $scope.entries = [];
                for (ix=0; ix<data.length; ix++) {
                    var d=data[ix];
                    $scope.entries[d.lineno] = d;
                }
                // Compute various balances.
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
                        // Set balance on this entry.
                        e.balance = $scope.balance;
                        console.log("balance: "+$scope.balance+", e: "+JSON.stringify(e));
                    }  else {
                        // We found an empty line.  Give it defaults.
                        $scope.entries[ix] = {lineno: ix, amount: 0};
                    }
                }
                console.log("balance: "+$scope.balance);
                console.log("cleared: "+$scope.cleared);
                console.log("$scope.entries: "+JSON.stringify($scope.entries));
            };

            // appendEntry adds an entry to the end of the list.  This
            // is only used in entryFormController after the entry has
            // been saved in the server, but we need the local $scope.
            $rootScope.appendEntry = function(e) {
                $scope.entries[e.lineno] = e;
                $scope.balance += e.amount;
                if (e.cleared) {
                    $scope.cleared += e.amount;
                }
                e.balance = $scope.balance;
            };

        }])  // RegisterController

// Handle the login and create-user forms.
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

            // login authenticates user credentials (in loginData) and
            // saves the access_token for later use to allow access to
            // all the data in the server.
            $scope.login = function() {
                $uibModalInstance.close();
                loginService.login($scope.loginData).then(
                    function(response) {
                        // Successful authentication.
                        loginService.access_token = response.id;
                        loginService.setLogged_in(true, $scope.loginData.username, response.userId);
                        console.log("login succeeded: "+JSON.stringify(response));
                        console.log("access_token: "+loginService.access_token);
                        $rootScope.getAccountList();
                    },
                    function(response) {
                        // Authentication failed.  TODO Tell the user.
                        console.log("login failed: "+JSON.stringify(response));
                    }
                );
                console.log("login form: "+JSON.stringify($scope.loginData));
            };

            // createUser saves user credentials (from createUserData)
            // into the server, but only if the usename is unused.
            $scope.createUser = function() {
                $uibModalInstance.close();
                // Count number of existing users with this username.
                loginService.count($scope.createUserData.username)
                    .then(
                        function(response) {
                            if (response.count === 0) {
                                // Good, not a duplicate name.
                                loginService.createUser($scope.createUserData);
                                console.log("createUser: "+JSON.stringify($scope.createUserData));
                            } else {
                                // username is already in use.  TODO Tell the user.
                                console.log("createUser: user already exists "+response.count+" time(s)");
                            }
                        },
                        function(response) {
                            // What went wrong?  TODO Tell the user.
                            console.log("loginService.count failed: "+JSON.stringify(response));
                        }
                    );
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // LoginFormController

// Handle the account creation form.
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

            // createAccount saves new account information (from
            // createAccountData) into the server, but only if the
            // account name is not yet used by this user.
            $scope.createAccount = function() {
                $uibModalInstance.close();
                // Count number of existing accounts for this user
                // with this acctname.
                accountService.count($scope.createAccountData.acctname)
                    .then(
                        function(response) {
                            if (response.count === 0) {
                                // Good, not a duplicate name.
                                accountService.createAccount(
                                    $scope.createAccountData,
                                    function() { $rootScope.getAccountList(); });
                                console.log("createAccount: "+JSON.stringify($scope.createAccountData));
                            } else {
                                // This user already has an account with this name.  TODO Tell them.
                                console.log("createAccount: account already exists "+response.count+" time(s)");
                            }
                        },
                        function(response) {
                            // What went wrong?  TODO Tell the user.
                            console.log("accountService.count failed: "+JSON.stringify(response));
                        }
                    );
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // AccountFormController

// Handle the account selection form.
    .controller('AccountSelectController', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        function(
            $rootScope,
            $scope,
            $uibModalInstance) {

            // selectAccount selects the given account, using a
            // function in another controller.
            $scope.selectAccount = function(acctId) {
                $uibModalInstance.dismiss('selected');
                $rootScope.selectAccount(acctId);
            };

            // Open the create account form, using common code in
            // another controller.  Don't dismiss the account
            // selection form, so we can use it immediately after
            // creating an account to select the new account, or
            // create another one.
            $scope.openCreateAccountForm = function() {
                $rootScope.openForm(
                    'templates/createaccountform.html',
                    'AccountFormController');
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // AccountSelectController

// Handle the create-entry form.
    .controller('EntryFormController', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'entryService',
        'accountService',
        function(
            $rootScope,
            $scope,
            $uibModalInstance,
            entryService,
            accountService) {

            // Amounts can be entered as positive or negative in the
            // form, we don't care.  Return 0 if no amount is given.
            var abs = function(x) { return x ? (x>0 ? x : -x) : 0; };

            $scope.entryData = {};

            // save stores the new entry (from entryData) in the
            // server.  First, compute the amount field from credit
            // and debit (credits become positive amounts, debits
            // become negative, 0 doesn't display), and set the lineno
            // field.
            $scope.save = function() {
                console.log("form entry: "+JSON.stringify($scope.entryData));
                $uibModalInstance.close();
                $scope.entryData.amount = abs($scope.entryData.credit) - abs($scope.entryData.debit);
                $scope.entryData.lineno = accountService.info.nextline;
                // Increment nextline; this one is now in use.
                accountService.info.nextline++;
                accountService.update({nextline:accountService.info.nextline});
                // Store new entry in the server.
                entryService.createEntry($scope.entryData, $rootScope.appendEntry);
                console.log("form entry: "+JSON.stringify($scope.entryData));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])  // EntryFormController

;
