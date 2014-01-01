module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    sass: {
      docs: {
        options: {
          style: 'expanded',
          loadPath: './bower_components'
        },
        files: {
          './public/bundle.css': './frontend/main.scss'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          './public/bundle.js': ['./frontend/main.js'],
        },
        options: {
          transform: ['debowerify']
        }
      }
    },
    watch: {
      sass: {
        files: ['./src/scss/**'],
        tasks: ['sass']
      },
      js: {
        files: ['./src/js/**'],
        tasks: ['browserify']
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'browserify']);
  grunt.registerTask('js', ['browserify']);
  grunt.registerTask('css', ['sass']);
};
