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
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    mochaProtractor: {
      options: {
        reporter: 'spec',
        browsers: ['Chrome', 'Firefox']
      },
      files: 'test/*.js'
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
  grunt.registerTask('test', ['connect', 'mochaProtractor']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
