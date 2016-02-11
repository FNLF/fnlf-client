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
                src:['app/acl/index.html','app/club/index.html'],
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
        }
    });

    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-wiredep');


    // Default task(s).
    grunt.registerTask('default', ['bower-install-simple', 'wiredep']);

};