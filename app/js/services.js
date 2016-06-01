'use strict';

angular.module('checkbook.services', ['ngResource'])

    .constant('baseURL', 'http://localhost:3000/api')

    .service('registerFactory', [
        '$resource',
        'baseURL',
        function(
            $resource,
            baseURL) {
            this.getEntries = function() {
                return $resource(baseURL+'/Entries/:id',
                                 null,
                                 {'update': {method: 'PUT'}});
            };

            this.getMisc    = function() {
                return $resource(baseURL+'/Miscellanea',
                                 null,
                                 {'update': {method: 'PUT'}});
            };

        }])

    .service('loginService', [
        '$resource',
        'baseURL',
        function(
            $resource,
            baseURL) {

            this.custId = null;

            this.createUser = function(data) {
                return $resource(baseURL+'/Customers').save(data);
            };

            this.setLogged_in = function() {};

            this.login = function(data) {
                return $resource(baseURL+'/Customers/login').save(data).$promise;
            };

            this.logout = function() {
                return $resource(baseURL+'/Customers/logout');
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

            this.createAccount = function(data, cb) {
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
                console.log("try getting from "+baseURL+'/Accounts?access_token='+loginService.access_token);
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

        }])

;
