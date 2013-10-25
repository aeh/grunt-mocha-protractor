/*
 * grunt-mocha-protractor
 * https://github.com/aeh/grunt-mocha-protractor
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    mochaProtractor: {
      local: {
        options: {
          reporter: 'Spec',
          browsers: ['Chrome', 'Firefox']
        },
        files: {
          src: 'test/*.js'
        }
      },
      saucelabs: {
        options: {
          reporter: 'Spec',
          sauceTunnelId: process.env.TRAVIS_JOB_NUMBER,
          sauceSession: 'Grunt Mocha Protractor',
          browsers: [
            {
              base: 'SauceLabs',
              browserName: 'Chrome',
              platform: 'Windows 7'
            },
            {
              base: 'SauceLabs',
              browserName: 'Firefox'
            },
            {
              base: 'SauceLabs',
              browserName: 'Internet Explorer',
              version: '10'
            }
          ]
        },
        files: {
          src: 'test/*.js'
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: 'test/server'
        }
      }
    }
  });


  require('load-grunt-tasks')(grunt);

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['connect', 'mochaProtractor:local']);
  grunt.registerTask('test:saucelabs', ['connect', 'mochaProtractor:saucelabs']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
