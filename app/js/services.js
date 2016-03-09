'use strict';

angular.module('checkbook.services', ['ngResource'])

    .constant('baseURL', 'http://localhost:3000/')

    .service('registerFactory', [
        '$resource',
        'baseURL',
        function(
            $resource,
            baseURL) {
            return $resource(baseURL+'entries/:id', null, {
                'update': {
                    method: 'PUT',
                }
            });
        }])

;
