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
                files: ['server/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
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
        }
    });

    grunt.registerTask('serve', [
        'shell:mongodb_dev_folder',
        'shell:mongodb_dev',
        'express:dev',
        'open:dev',
        'watch:express'
    ]);

    grunt.registerTask('test', [
        'shell:mongodb_test',
        'wait:pause',
        'mochaTest'
    ]);
};
