'use strict';

angular.module('checkbook', [
    'ui.router',
    'checkbook.controllers',
    'checkbook.services',
])

    .run(function() {
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cb', {
                url: '/',
                views: {
                    'content': {
                        templateUrl: 'templates/register.html',
                        controller : 'RegisterController',
//                        resolve: {
//                            entries: ['registerFactory', function(registerFactory) {
//                                return registerFactory.getEntries().query();
//                            }],
//                            misc: ['registerFactory', function(registerFactory) {
//                                return registerFactory.getMisc().get({id:0}).$promise;
//                            }],
//                        },
                    },
                },
            })

            .state('cb.register', {
                url: 'register',
                views: {
                    'content@': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterController',
//                        resolve: {
//                            entries: ['registerFactory', function(registerFactory) {
//                                return registerFactory.query();
//                            }],
//                        },
                    },
                },
            })
        ;
        
        $urlRouterProvider.otherwise('/');
    })

;
