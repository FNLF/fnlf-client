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
		}

  });

  grunt.loadNpmTasks('grunt-bower-install');

  // Default task(s).
  grunt.registerTask('default', ['bowerInstall']);

};