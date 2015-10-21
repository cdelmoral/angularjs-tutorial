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
        pkg: grunt.file.readJSON('package.json'),
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
            },
            express: {
                files: ['server/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        },

        focus: {
            dev: {
                include: ['dev', 'sass', 'express']
            }
        },

        // Empties folders to start fresh
        clean: {
            dev: '.dev',
            dist: 'dist'
        },

        uglify: {
            option: {
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['app/app.js', 'app/**/*module.js', 'app/**/*.js']
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                includePaths: ['bower_components/bootstrap-sass/assets/stylesheets/']
            },
            dev: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true,
                    sourceMapContents: true
                },
                files: {
                    '.dev/styles.css': 'app/styles/main.scss'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false
                },
                files: {
                    'dist/styles.css': 'app/styles/main.scss'
                }
            }
        },

        copy: {
            dev: {
                expand: true,
                cwd: 'app/',
                dest: '.dev/',
                src: ['**/*.html', '**/*.js']
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
                    map: true
                }
            }
        },

        // Express server
        express: {
            dev: {
                options: {
                    port: 8000,
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
            mongodb_dev_folder: {
                command: 'mkdir -p ./.db/dev'
            },
            mongodb_dev: {
                command: 'mongod --dbpath ./.db/dev',
                options: {
                    async: true,
                    stdout: false,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        cwd: '.'
                    }
                }
            },
            mongodb_test: {
                command: 'mongod --dbpath ./.db/test',
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

        wait: {
            options: {
                delay: 2000
            },
            pause: {}
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
        'shell:mongodb_dev_folder',
        'shell:mongodb_dev',
        'clean:dev',
        'concurrent:dev',
        'injector:dev',
        'wiredep:dev',
        'autoprefixer:dev',
        'express:dev',
        'open:dev',
        'focus:dev'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'uglify:dist',
        'sass:dist'
    ]);

    grunt.registerTask('refresh', [
        'copy:dev',
        'injector:dev',
        'wiredep:dev',
        'autoprefixer:dev'
    ]);

    grunt.registerTask('mocha', [
        'shell:mongodb_test',
        'wait:pause',
        'mochaTest'
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