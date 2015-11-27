module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt);

    require('jit-grunt')(grunt, {
        express: 'grunt-express-server',
        shell: 'grunt-shell-spawn'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            express: {
                files: ['src/**/*.js', 'bin/www'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        },

        env: {
            dev: {
                src: '.env.json'
            }
        },

        express: {
            dev: {
                options: {
                    port: 8000,
                    script: 'bin/www',
                    node_env: 'development'
                }
            },
            test: {
                options: {
                    port: 8001,
                    script: 'bin/www',
                    node_env: 'development'
                }
            }
        },

        shell: {
            // Create mongodb folder for development
            mongodb_dev_folder: {
                command: 'mkdir -p ./.db/dev'
            },
            // Create mongodb folder for test
            mongodb_test_folder: {
                command: 'mkdir -p ./.db/test'
            },
            // Start mongodb in development
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
            // Start mongodb in test
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

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'should',
                    ui: 'bdd'
                },
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('serve', [
        'shell:mongodb_dev_folder',
        'shell:mongodb_dev',
        'env:dev',
        'express:dev',
        'watch:express'
    ]);

    grunt.registerTask('test', [
        'shell:mongodb_test_folder',
        'shell:mongodb_test',
        'wait:pause',
        'mochaTest'
    ]);
};
