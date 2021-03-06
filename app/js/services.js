'use strict';

angular.module('checkbook.services', ['ngResource'])

    .constant('baseURL', 'http://towanda.dsl.frii.com:3000/api')

    .service('loginService', [
        '$resource',
        'baseURL',
        function(
            $resource,
            baseURL) {

            // Inter-controller and inter-service communication variables.
            this.custId = null;
            this.access_token = null;
            this.setLogged_in = function() {};

            this.createUser = function(data) {
                return $resource(baseURL+'/Customers').save(data).$promise;
            };

            this.login = function(data) {
                return $resource(baseURL+'/Customers/login').save(data).$promise;
            };

            this.logout = function() {
                return $resource(baseURL+'/Customers/logout');
            };

            this.count = function(username) {
                return $resource(baseURL+'/Customers/count?where='+JSON.stringify({username:username})).get().$promise;
            };

            // The following functions requre authentication (login).

            this.get = function(cb) {
                // Optionally call cb when current customer's data is retrieved.
                this.info = $resource(baseURL+'/Customers/'+this.custId+'?access_token='+this.access_token).get(
                    function(response) {
                        console.log('loginService.get: '+JSON.stringify(response));
                        if (cb) {
                            cb();
                        }
                    },
                    function(response) {
                        console.log('loginService.get: '+JSON.stringify(response));
                    });
            };

            this.update = function(data) {
                this.info = $resource(baseURL+'/Customers/'+this.custId+'?access_token='+this.access_token, null, {'update': {method: 'PUT'}}).update(
                    data,
                    function(response) {
                        console.log('loginService.update: '+JSON.stringify(response));
                    },
                    function(response) {
                        console.log('loginService.update: '+JSON.stringify(response));
                    });
            };

        }])

    .service('accountService', [
        '$resource',
        'loginService',
        'baseURL',
        function(
            $resource,
            loginService,
            baseURL) {

            // Inter-controller and inter-service communication variables.
            this.acctId = null;
            this.setAccounted = function() {};

            this.createAccount = function(data, cb) {
                // Call cb() when data is retrieved.
                data.custId = loginService.custId;
                console.log("accountService.createAccount: "+JSON.stringify(data));
                $resource(baseURL+'/Accounts?access_token='+loginService.access_token).save(data)
                    .$promise.then(
                        function(response) {
                            console.log("createAccount: "+JSON.stringify(response));
                            cb();
                        },
                        function(response) {
                            console.log("createAccount: "+JSON.stringify(response));
                        }
                    );
            };

            this.getAccountList = function(cb) {
                // Call cb(response) when data is retrieved.
                this.accountList = $resource(baseURL+'/Accounts?access_token='+loginService.access_token+'&filter='+JSON.stringify({where: {custId: loginService.custId}}))
                    .query(
                        function(response) {
                            console.log("getAccountList: "+JSON.stringify(response));
                            cb(response);
                        },
                        function(response) {
                            console.log("getAccountList: "+JSON.stringify(response));
                        }
                    );
            };

            this.count = function(acctname) {
                return $resource(baseURL+'/Accounts/count?where='+JSON.stringify({custId:loginService.custId,acctname:acctname})).get().$promise;
            };

            this.get = function() {
                this.info = $resource(baseURL+'/Accounts/'+this.acctId+'?access_token='+loginService.access_token).get(
                    function(response) {
                        console.log('accountService.get: '+JSON.stringify(response));
                    },
                    function(response) {
                        console.log('accountService.get: '+JSON.stringify(response));
                    });
            };

            this.update = function(data) {
                this.info = $resource(baseURL+'/Accounts/'+this.acctId+'?access_token='+loginService.access_token, null, {'update': {method: 'PUT'}}).update(
                    data,
                    function(response) {
                        console.log('accountService.update: '+JSON.stringify(response));
                    },
                    function(response) {
                        console.log('accountService.update: '+JSON.stringify(response));
                    });
            };

        }])

    .service('entryService', [
        '$resource',
        'loginService',
        'accountService',
        'baseURL',
        function(
            $resource,
            loginService,
            accountService,
            baseURL) {

            this.createEntry = function(data, cb) {
                // Optionally call cb(response) when data is retrieved.
                data.acctId = accountService.acctId;
                console.log("entryService.createEntry: "+JSON.stringify(data));
                $resource(baseURL+'/Entries?access_token='+loginService.access_token).save(data)
                    .$promise.then(
                        function(response) {
                            console.log("createEntry: "+JSON.stringify(response));
                            if (cb) {
                                cb(response);
                            }
                        },
                        function(response) {
                            console.log("createEntry: "+JSON.stringify(response));
                        }
                    );
            };

            this.getEntries = function(cb) {
                // Call cb(response) when data is retrieved.
                $resource(baseURL+'/Entries?access_token='+loginService.access_token+'&filter='+JSON.stringify({where: {acctId: accountService.acctId}}))
                    .query()
                    .$promise
                    .then(
                        function(response) {
                            console.log("getEntries pass: "+JSON.stringify(response));
                            cb(response);
                        },
                        function(response) {
                            console.log("getEntries fail: "+JSON.stringify(response));
                        }
                    );
            };

            this.update = function(entrId, data, cb) {
                // Optionally call cb(response) when data is retrieved.
                $resource(baseURL+'/Entries/'+entrId+'?access_token='+loginService.access_token, null, {'update': {method: 'PUT'}}).update(
                    data,
                    function(response) {
                        if (cb) {
                            cb(response);
                        }
                        console.log('entryService.update: '+JSON.stringify(response));
                    },
                    function(response) {
                        console.log('entryService.update: '+JSON.stringify(response));
                    });
            };

        }])

;
