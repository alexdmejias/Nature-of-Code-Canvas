"use strict";

module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		chapterToWatch: '3',

		watch: {
			options: {
				livereload: true
			},

			html: {
				files: ['index.html', './chapters/**/*.html']
			},

			js: {
				files: ['./modules/*.js', './chapters/<%= chapterToWatch %>/*/*.js', '!./chapters/*/*/app.bundle.js'],
				tasks: ['browserify:watch']
			}
		},

		connect: {
			server: {
				options: {
					hostname: 'localhost',
	        base: './',
					sourceMap: true,
					livereload: true,
					open: {
						target: 'http://localhost:8000/chapters'
					}
				}
			}
		},

		browserify: {
			options: {
				alias:             {
					'utils': './modules/utils.js',
					'V':     './modules/p5Vectors.js'
				},
				transform: [
					["babelify"]
				],
				browserifyOptions: {
					debug: true
				}
			},
			init: {
				files: [{
	      	expand: true,
					cwd: './chapters/',
					src: ['*/*/app.js'],
					ext: '.bundle.js',
					rename: function(dest, src) {
						return './chapters/' + src;
					}
		    }]
			},
			watch: {
				files: [{
					expand: true,
					cwd: './chapters/',
					src: ['<%= chapterToWatch %>/*/app.js'],
					ext: '.bundle.js',
					rename: function(dest, src) {
						return './chapters/' + src;
					}
				}]
			}
		}
	});

	grunt.registerTask('create', function() {
		var unit = grunt.option('path').split('-')
			, filePath = './chapters/' + unit[0] + '/' + unit[1]
			, templateContent = grunt.file.read('./html_template.html')
			, docTitle = 'Chapter ' + unit[0] + ' - Exercise ' + unit[1];

		grunt.file.write(filePath + '/index.html', grunt.template.process(templateContent, {data: {title: docTitle}}));
    grunt.file.write(filePath + '/app.js', grunt.file.read('./js_template.js'));

		grunt.task.run('default');
	});

	grunt.registerTask('default', ['browserify:init', 'connect', 'watch']);
};
