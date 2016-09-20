module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
    ' * <%= pkg.title || pkg.name %> v<%= pkg.version %><%= pkg.homepage ? " (" + pkg.homepage + ")" : "" %>\n' +
    ' * Copyright (c) 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
    ' * Licensed under <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)\n' +
    ' */\n',
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        src: ['dist/css/<%= pkg.name %>.css']
      }
    },
    babelHelpers: {
      dist: {
        src: 'dist/js/<%= pkg.name %>.js'
      }
    },
    browserify: {
      options: {
        banner: '<%= banner %>',
        browserifyOptions: {
          standalone: 'PatchrUi'
        },
        exclude: ['any-promise', 'patchr', 'jquery', 'navigator', 'prismjs'],
        transform: [['babelify', {
          presets: ['es2015-without-strict'],
          plugins: []
        }], 'browserify-shim']
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.js': 'src/js/index.js'
        }
      }
    },
    clean: {
      css: ['dist/css/'],
      js: ['dist/js/']
    },
    compress: {
      dist: {
        options: {
          level: 9,
          mode: 'gzip',
          pretty: true
        },
        files: [{
          src: 'dist/js/<%= pkg.name %>.min.js',
          dest: 'dist/js/<%= pkg.name %>.min.js.gz'
        }]
      }
    },
    cssmin: {
      options: {
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
        }
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      js: ['Gruntfile.js', 'src/js/**/*.js', '!src/js/lib/**/*.js']
    },
    remove_usestrict: {
      dist: {
        files: [{
          src: 'dist/js/<%= pkg.name %>.min.js',
          dest: 'dist/js/<%= pkg.name %>.min.js'
        }]
      }
    },
    sass: {
      options: {
        outputStyle: 'expanded'
      },
      src: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.scss', '!**/_*.scss'],
          dest: 'dist/css',
          ext: '.css',
          flatten: true,
          extDot: 'last'
        }]
      }
    },
    uglify: {
      options: {
        preserveComments: function (node, comment) {
          var special = /^!|@preserve|@license|@cc_on/i.test(comment.value);
          if (special) {
            // Remove new lines from the special comments.
            comment.value = comment.value.replace(/(\n|\r|\r\n)/gm, '');
          }
          return special;
        },
        report: 'gzip'
      },
      min: {
        src: 'dist/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      css: {
        files: ['src/**/*.scss'],
        tasks: ['css']
      },
      js: {
        files: ['.eslintrc', 'package.json', 'Gruntfile.js', 'src/js/**/*.js'],
        tasks: ['js']
      }
    },
    babel_helpers: {
      dist: {
        src: 'dist/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    }
  });

  // Load the grunt tasks.
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('css', ['clean:css', 'sass', 'autoprefixer', 'cssmin']);
  grunt.registerTask('js', ['eslint', 'clean:js', 'browserify', 'babelHelpers', 'uglify', 'remove_usestrict', 'compress']);

  // Default task(s).
  grunt.registerTask('default', ['css', 'js']);

};
