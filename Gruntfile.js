module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt);

  require('jit-grunt')(grunt, {
    express: 'grunt-express-server'
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
      dev: { src: '.env.dev.json' },
      test: { src: '.env.test.json' }
    },

    express: {
      dev: {
        options: {
          port: 8000,
          script: 'bin/www',
          node_env: 'development',
          debug: true
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

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'should',
          ui: 'bdd',
          timeout: 10000
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.registerTask('serve', [
    'env:dev',
    'express:dev',
    'watch:express'
  ]);

  grunt.registerTask('test', ['env:test', 'mochaTest']);
};
