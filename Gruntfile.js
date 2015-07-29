module.exports = function(grunt) {

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({
        wiredep: {
            task: {
                src: ['app/index.html']
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
            server: ['copy:styles']
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
            }
        }
    });

    grunt.registerTask('changes', ['watch']);
    grunt.registerTask('default', ['wiredep']);

    grunt.registerTask('serve', [
            'clean:server',
            'wiredep',
            'concurrent:server',
            'autoprefixer:server',
            'connect:livereload',
            'watch'
    ]);
};