module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /**
         * Project Paths Configuration
         * ===============================
         */
        paths: {
            //images folder name
            images: 'email-images',
            //where to store built files
            dist: 'dist',
            //sources
            src: 'app',
            //main email file
            email: 'asdasdasde.html',
            //enter here yout production domain
            distDomain: 'http://www.blinds-2go.co.uk/',
            //live folder location
            livefolder: 'Danielchilvers.org.uk/newsletters',
            //this is the default development domain
            devDomain: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/',
        },

        /**
         * SCSS Compilation Tasks
         * ===============================
         */
        compass: {
            options: {
                sassDir: '<%= paths.src %>/scss',
                outputStyle: 'expanded',
                httpImagesPath: '/img/'
            },
            serve: {
                options: {
                    cssDir: '<%= paths.src %>/css',
                    imagesDir: '<%= paths.src %>/<%= paths.images %>',
                    noLineComments: false
                }
            },
            dist: {
                options: {
                    force: true,
                    cssDir: '<%= paths.dist %>/css',
                    imagesDir: '<%= paths.dist %>/<%= paths.images %>',
                    noLineComments: true,
                    assetCacheBuster: false
                }
            }
        },

        /**
         * Watch Task
         * ===============================
         */
        watch: {
            compass: {
                files: ['<%= paths.src %>/scss/**/*.scss'],
                tasks: ['compass:serve']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= paths.src %>/<%= paths.email %>',
                    '<%= paths.src %>/css/{,*/}*.css',
                    '<%= paths.src %>/<%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif}'
                ]
            }
        },

        /**
         * Server Tasks
         * ===============================
         */
        connect: {
            options: {
                open: '<%= paths.devDomain %>/<%= paths.email %>',
                hostname: 'localhost',
                port: 8000,
                livereload: 35729
            },
            serve: {
                options: {
                    base: '<%= paths.src %>'
                }
            },
            dist: {
                options: {
                    keepalive: true,
                    livereload: false,
                    base: '<%= paths.dist %>'
                }
            }
        },

        /**
         * Cleanup Tasks
         * ===============================
         */
        clean: {
            dist: ['<%= paths.dist %>']
        },

        /**
         * Images Optimization Tasks
         * ===============================
         */
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.src %>/<%= paths.images %>',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= paths.dist %>/<%= paths.images %>'
                }]
            }
        },

        /**
         * Premailer Parser Tasks
         * ===============================
         */
        premailer: {
            options: {
                baseUrl: '<%= paths.distDomain %>'
            },
            dist: {
                src: '<%= paths.src %>/<%= paths.email %>',
                dest: '<%= paths.dist %>/<%= paths.email %>'
            }
        },

        /**
         * Test Mailer Tasks
         * ===============================
         */
        nodemailer: {
            options: {
                transport: {
                    type: 'SMTP',
                    options: {
                        service: 'Gmail',
                        auth: {
                            user: 'b2gtestemail@gmail.com',
                            pass: 'donkeycheeks'
                        }
                    }
                },
                recipients: [
                    {
                        name: 'B2G TEST - <%= paths.email %>',
                        email: 'daniel@blinds-2go.co.uk, daniel.chilvers1@gmail.com'
                    }
                ]
            },
            dist: {
                src: ['<%= paths.dist %>/<%= paths.email %>']
            }
        },
        'ftp-deploy': {
            build: {
                auth: {
                  host: '23.229.192.72',
                  port: 21,
                  authKey: 'key1'          
                },
            src: '<%= paths.src %>',
            dest: '<%= paths.livefolder %>/<%= paths.email %>',
            exclusions: ['<%= paths.src %>/**/.DS_Store', '<%= paths.src %>/**/Thumbs.db', '<%= paths.src %>/tmp']
             }
        }
    });

    [
        'grunt-contrib-connect',
        'grunt-contrib-watch',
        'grunt-contrib-compass',
        'grunt-contrib-imagemin',
        'grunt-contrib-clean',
        'grunt-premailer',
        'grunt-nodemailer',
        'grunt-ftp-deploy',
    ].forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', 'serve');

    grunt.registerTask('serve', [
        'compass:serve',
        'connect:serve',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'imagemin',
        'ftp-deploy',
        'compass:dist',
        'premailer:dist',
        'connect:dist'
    ]);

    grunt.registerTask('send', [
        'clean',
        'imagemin',
        'compass:dist',
        'premailer:dist',
        'ftp-deploy',
        'nodemailer'
    ]);

     grunt.registerTask('ftp', [
        'ftp-deploy'
    ]);

};
