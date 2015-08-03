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
            dev: {
                src: ['.dev/index.html'],
                ignorePath:  /\.\.\//
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

        injector: {
            options: {
                template: 'app/index.html',
                relative: true
            },
            dev: {
                files: {
                    '.dev/index.html': ['.dev/app.js', '.dev/**/*module.js', '.dev/**/*.js', '.dev/**/*.css']
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            dev: {
                files: ['bower_components/*', 'app/**/*.js', 'app/**/*.html',  'app/**/*.css'],
                tasks: ['refresh']
            },
            sass: {
                files: ['app/**/*.scss', 'app/**/*.sass'],
                tasks: ['sass:dev']
            },
            e2e: {
                files: ['bower_components/*', 'app/**/*.js', 'app/**/*.html'],
                tasks: ['refresh', 'protractor']
            }
        },

        // Empties folders to start fresh
        clean: {
            dev: '.dev'
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                loadPath: 'bower_components/bootstrap-sass/assets/stylesheets/'
            },
            dev: {
                style: 'expanded',
                files: {
                    '.dev/styles/main.css': 'app/**/*.{scss, sass}'
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dev: {
                expand: true,
                cwd: 'app/',
                dest: '.dev/',
                src: ['**/*.html', '**/*.js', '**/*.css']
            }
        },

        concurrent: {
            dev: [
                'sass:dev',
                'copy:dev'
            ]
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dev: {
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
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static('.dev')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 8001,
                    middleware: function (connect) {
                        return [
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static('.dev')
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

    grunt.registerTask('serve', [
        'clean:dev',
        'concurrent:dev',
        'injector:dev',
        'wiredep:dev',
        'autoprefixer:dev',
        'connect:livereload',
        'watch:dev'
    ]);

    grunt.registerTask('refresh', [
        'copy:dev',
        'injector:dev',
        'wiredep:dev',
        'autoprefixer:dev'
    ]);

    grunt.registerTask('test', [
        'clean:dev',
        'copy:dev',
        'injector:dev',
        'wiredep',
        'autoprefixer:dev',
        'karma'
    ]);

    grunt.registerTask('e2e', [
        'clean:dev',
        'copy:dev',
        'injector:dev',
        'wiredep:dev',
        'autoprefixer:dev',
        'connect:test',
        'protractor',
        'watch:e2e'
    ]);
};