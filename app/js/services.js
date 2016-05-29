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

            this.createuser = function(data) {
                return $resource(baseURL+'/Customers').save(data);
            };

            this.login = function(data) {
                return $resource(baseURL+'/Customers/login').save(data).$promise;
            };

            this.logout = function() {
                return $resource(baseURL+'/Customers/logout');
            };

        }])

;
