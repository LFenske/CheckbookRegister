angular.module('checkbook.services', [])

    .constant('baseURL', 'http://localhost:3000/')

    .service('registerFactory', [
        '$resource',
        'baseURL',
        function(
            $resource,
            baseURL) {
            this.getEntries = function() {
                return $resource(baseURL+'register/:id', null, {
                    'update': {
                        method: 'PUT',
                    }
                });
            };
        }])

;
