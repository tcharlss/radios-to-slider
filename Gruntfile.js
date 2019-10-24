module.exports = function (grunt) {

    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        config: {
            src: 'src',
            dist: 'dist'
        },

        pkg: require('./package'),

        meta: {
            banner: '/*prout*/',
            bannerz: '/**\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * jQuery plugin to create a slider using a list of radio buttons\n' +
            ' * (c) <%= grunt.template.today("yyyy") %> rubentdlh@gmail.com\n' +
            ' * <%= pkg.license.type %> license\n' +
            ' */'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            compass: {
                files: ['<%= config.src %>/{,*/}*.{scss,sass}'],
                tasks: ['compass:dist', 'cssmin:dist']
            },

            jshint: {
                files: '<%= config.src %>/{,*/}*.js',
                tasks: ['jshint']
            },

            concat: {
                files: '<%= config.src %>/{,*/}*.js',
                tasks: ['concat:dist', 'uglify:dist']
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.src %>/{,*/}*.js'
            ],
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: 'src',
                cssDir: '<%= config.dist %>'
            },
            dist: {
                options: {
                    // banner: '<%= meta.banner %>',
                    // specify: '<%= config.src %>/radios-to-slider.scss',
                    debugInfo: false,
                    noLineComments: true
                }
            }
        },

        // Prepend a banner to the files
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= config.src %>/jquery.radios-to-slider.js'],
                dest: '<%= config.dist %>/jquery.radios-to-slider.js'
            }
        },

        // Generate a minified version of JS
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= config.dist %>/jquery.radios-to-slider.js'],
                dest: '<%= config.dist %>/jquery.radios-to-slider.min.js'
            }
        },

        // Generate a minified version of CSS
        cssmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= config.dist %>/radios-to-slider.css'],
                dest: '<%= config.dist %>/radios-to-slider.min.css'
            }
        },

    });

    // Build task
    grunt.registerTask(
        'build',
        ['compass:dist', 'jshint', 'concat:dist', 'uglify:dist', 'cssmin:dist']
    );

};
