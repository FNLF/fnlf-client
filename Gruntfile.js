module.exports = function(grunt) {

  // Project configuration.
	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


	bowerInstall: {

		  target: {

			// Point to the files that should be updated when
			// you run `grunt bower-install`
			src: [
			  'app/*/index.html'   // .html support...
			],

			// Optional:
			// ---------
			cwd: '',
			dependencies: true,
			devDependencies: false,
			exclude: [],
			fileTypes: {},
			ignorePath: '',
			overrides: {}
		  }
		},
		wiredep: {
		  task: {
			src: ['index.html']
		  }
		},
		bower_concat: {
          all: {
            dest: 'build/_bower.js',
            cssDest: 'build/_bower.css',
            bowerOptions: {
              relative: false
            }
          }
        }


  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-concat');

  // Default task(s).
  grunt.registerTask('default', ['bowerInstall','wiredep']);

};