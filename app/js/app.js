angular.module('checkbook', [
    'ui.router',
    'checkbook.controllers',
    'checkbook.services',
])

    .run(function() {
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cb.register', {
                url: '/cb/register',
                views: {
                    'mainContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterController',
                        resolve: {
                            entries: ['registerFactory', function(registerFactory) {
                                return registerFactory.query();
                            }],
                        },
                    },
                },
            })
        
        $urlRouterProvider.otherwise('/cb/register');
    })

;
