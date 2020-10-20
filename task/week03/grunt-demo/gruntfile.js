const sass = require('sass');

module.exports = grunt => {
    grunt.initConfig({
        sass: {
            options: {
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/sass/main.sass'
                }
            }
        },
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/main.js': 'src/js/main.js'
                }
            }
        },
        clean: {
            temp: 'dist'
        },
        watch: {
            js: {
                files: ['src/js/*.js'],
                tasks: ['babel']
            },
            css: {
                files: ['src/sass/*.sass'],
                tasks: ['sass']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['clean', 'babel', 'sass', 'watch']);
};
