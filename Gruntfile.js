'use strict';

module.exports = function (grunt) {

    // Time how long tasks take.  Can help when optimizing build times.
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks.
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
    });

    // Define the configuration for all the tasks.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Make sure code styles are up to par and there are no obvious mistakes.
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
            },

            all: {
                src: [
                    'Gruntfile.js',
                    'app/js/{,*/}*.js',
                ],
            },
        },

        copy: {
            dist: {
                cwd   : 'app',
                src   : [
                    '**',
                    'css/**/*.css',
                    'js/**/*.js',
                    'bower_components/**/*.css',
                    'bower_components/**/*.js',
                ],
                dest  : 'dist',
                expand: true,
            },
            fonts: {
                files: [
                    {
                        // for bootstrap fonts
                        expand: true,
                        dot   : true,
                        cwd   : 'bower_components/bootstrap/dist',
                        src   : ['fonts/*.*'],
                        dest  : 'dist',
                    }, {
                        // for font-awesome
                        expand: true,
                        dot   : true,
                        cwd   : 'bower_components/font-awesome',
                        src   : ['fonts/*.*'],
                        dest  : 'dist',
                    },
                ],
            },
        },

        clean: {
            build: {
                src: ['dist/'],
            },
        },

        useminPrepare: {
            html   : ['app/index.html', 'app/templates/*.html',],
            options: { dest: 'dist' },
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {},
        },

        uglify: {
            dist: {},
        },

        cssmin: {
            dist: {},
        },

        filerev: {
            options: {
                encoding : 'utf8',
                algorithm: 'md5',
                length   : 20,
            },
            release: {
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css',
                    ],
                }],
            },
        },

        usemin: {
            html: ['dist/*.html'],
            css : ['dist/css/*.css'],
            options: {
                assetsDirs: [
                    'dist',
                    'dist/css',
                ],
            },
        },

        watch: {
            copy: {
                files: [
                    'app/**',
                    '!app/**/*.css',
                    '!app/**/*.js'
                ],
                tasks: ['build'],
            },
            scripts: {
                files: ['app/js/*.js', 'Gruntfile.js'],
                tasks: ['build'],
            },
            styles: {
                files: ['app/css/mystyles.css'],
                tasks: ['build'],
            },
            livereload: {
                options: { livereload: '<%= connect.options.livereload %>' },
                files: [
                    'app/{,*/}*.html',
                    '.tmp/css/{,*/}*.css',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                ],
            },
        },

        connect: {
            options: {
                port      : 9000,
                hostname  : '0.0.0.0',
                livereload: 35729,
            },
            dist: {
                options: {
                    open: true,
                    base: {
                        path: 'dist',
                        options: {
                            index : 'index.html',
                            maxAge: 300000,
                        },
                    },
                },
            },
        },
        
    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        //'useminPrepare',
        //'concat',
        //'cssmin',
        //'uglify',
        'copy',
        //'filerev',
        //'usemin',
    ]);

    grunt.registerTask('serve', [
        'build',
        'connect:dist',
        'watch',
    ]);

    grunt.registerTask('default', ['build']);

};
