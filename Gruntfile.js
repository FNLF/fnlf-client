module.exports = function (grunt) {
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		wiredep: {
			main: {
				src: ['index.html'],
				directory: 'bower_components'
			},
			acl: {
				src: ['app/acl/index.html',
				'app/club/index.html',
				'app/editor/index.html',
				'app/obs/index.html',
				'app/profile/index.html'
				],
				ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+/,
			},
			
		},
		"bower-install-simple": {
			options: {
				color: true
				
			},
			"main": {
				options: {}
			}
		},
		ngconstant: {
			// Options for all targets
			options: {
				space: '  ',
				wrap: '"use strict";\n\n {%= __ngModule %}',
				name: 'config',
			},
			// Environment targets
			development: {
				options: {
					dest: 'config.js'
				},
				constants: {
					ENV: {
						name: 'development',
						googleAnalyticsId: 'UA-91309972-1'
					}
				}
			},
			production: {
				options: {
					dest: 'config.js'
				},
				constants: {
					ENV: {
						name: 'production',
						googleAnalyticsId: 'UA-91309972-2'
					}
				}
			}
		},
		cachebreaker: {
			
			development: {
				options: {
					match: ['.*.js', '.*.css'],
				},
				files: {
					src: ['index.html', 'app/obs/index.html', 'app/profile/index.html']
				}
			}
		}
		
		
	});
	
	grunt.loadNpmTasks("grunt-bower-install-simple");
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-ng-constant');
	grunt.loadNpmTasks('grunt-cache-breaker');
	
	// Default task(s).
	grunt.registerTask('default', ['bower-install-simple', 'wiredep', 'ngconstant:development', 'cachebreaker']);
	grunt.registerTask('production', ['default', 'ngconstant:production']);
};