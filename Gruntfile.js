module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {
            main: {
                src: ['index.html'],
                directory:'bower_components'
            },
            acl: {
                src:['app/acl/index.html'],
                cwd:'app/acl/',
                directory:'app/acl/bower_components/'
            }
        },
        "bower-install-simple": {
            options: {
                color: true

            },
            "main": {
                options: {}
            },
            "acl": {
                options: {
                    cwd: 'app/acl'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-wiredep');


    // Default task(s).
    grunt.registerTask('default', ['bower-install-simple', 'wiredep']);

};