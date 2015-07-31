module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt);

    require('jit-grunt')(grunt, {
        protractor: 'grunt-protractor-runner'
    });

    grunt.initConfig({
        wiredep: {
            app: {
                src: ['app/index.html']
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath:  /\.\.\//,
                fileTypes:{
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            bower: {
                files: ['bower_components/*'],
                tasks: ['wiredep']
            },
            js: {
                files: ['app/{,*/}*.js']
            },
            livereload: {
                files: [
                    'app/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            server: '.tmp'
        },

        // Copies remaining files to places other tasks can use
        copy: {
            styles: {
                expand: true,
                cwd: '<%= app/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        concurrent: {
            server: ['copy:styles'],
            test: ['copy:styles']
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            server: {
                options: {
                    map: true,
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 8000,
                hostname: 'localhost',
                livereload: true
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect().use(
                                '/app/styles',
                                connect.static('./app/styles')
                            ),
                            connect.static('app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 8001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static('app')
                        ];
                    }
                }
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            } 
        },

        // End to end test settings
        protractor: {
            options: {
                configFile: "test/protractor.conf.js",
                noColor: false,
                keepAlive: true,
                args: {}
            },
            all: {}
        }
    });

    grunt.registerTask('changes', ['watch']);
    grunt.registerTask('default', ['wiredep']);

    grunt.registerTask('serve', [
        'clean:server',
        'wiredep:app',
        'concurrent:server',
        'autoprefixer:server',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'wiredep:test',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('e2e', [
        'clean:server',
        'wiredep:test',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'protractor'
    ]);
};