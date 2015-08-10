module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt);

    require('jit-grunt')(grunt, {
        protractor: 'grunt-protractor-runner',
        express: 'grunt-express-server',
        shell: 'grunt-shell-spawn'
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
                livereload: 35729
            },
            dev: {
                files: ['bower_components/*', 'app/**/*.js', 'app/**/*.html',  'app/**/*.css'],
                tasks: ['refresh']
            },
            sass: {
                files: ['app/**/*.scss', 'app/**/*.sass'],
                tasks: ['sass:dev'],
                options: {
                    livereload: {
                        port: 35730
                    }
                }
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
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: ['**/*.scss'],
                    dest: '.dev/',
                    ext: '.css'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dev: {
                expand: true,
                cwd: 'app/',
                dest: '.dev/',
                src: ['**/*.html', '**/*.js', '**/*.css', '**/*.scss', '**/*.sass']
            }
        },

        concurrent: {
            dev: [
                'sass:dev',
                'copy:dev'
            ],
            watch_dev: {
                tasks: [
                    'watch:dev',
                    'watch:sass'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
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

        // Express server
        express: {
            options: {
                port: 8000,
                delay: 5000
            },
            dev: {
                options: {
                    script: './bin/www',
                    node_env: 'development'
                }
            },
            test: {
                options: {
                    port: 8001,
                    script: './bin/www',
                    node_env: 'development'
                }
            }
        },

        // Open server in browser
        open: {
            dev: {
                path: 'http://localhost:8000/'
            }
        },

        // Start mongodb
        shell: {
            mongodb: {
                command: 'mongod --dbpath ./.db/data',
                options: {
                    async: true,
                    stdout: false,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        cwd: '.'
                    }
                }
            }
        },

        // Front-end test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            } 
        },

        // Back-end test settings
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'should',
                    ui: 'bdd'
                },
                src: ['test/server/**/*.js']
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
        'shell:mongodb',
        'clean:dev',
        'concurrent:dev',
        'injector:dev',
        'wiredep:dev',
        'autoprefixer:dev',
        'express:dev',
        'open:dev',
        'concurrent:watch_dev'
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
        'express:test',
        'protractor'
    ]);
};