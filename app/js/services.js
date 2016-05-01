'use strict';

angular.module('checkbook.services', ['ngResource'])

    .constant('baseURL', 'http://towanda.dsl.frii.com:3000/')

    .service('registerFactory', [
        '$resource',
        'baseURL',
        function(
            $resource,
            baseURL) {
            this.getEntries = function() {
                return $resource(baseURL+'entries/:id',
                                 null,
                                 {'update': {method: 'PUT'}});
            };

            this.getMisc    = function() {
                return $resource(baseURL+'misc/:id',
                                 null,
                                 {'update': {method: 'PUT'}});
            };

        }])

;
