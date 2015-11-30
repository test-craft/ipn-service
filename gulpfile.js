'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    nodemon = require('gulp-nodemon'),
    _ = require('lodash'),
    fs = require('fs'),
    argv = require('yargs').argv;

function getFilesSrc(args){
    var modules = [];
    if (args.module){
        modules = args.module.replace(/ /g, '').split(',');
    } else {
        modules = fs.readdirSync('./app/modules');
    }

    return _.map(modules, function(module){
        return './app/modules/' + module + '/**/*.spec.js';
    });
}

gulp.task('lint', function() {
    return gulp.src('./app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['lint'], function() {
    global.BASE_URL = 'http://localhost:3000';

    return gulp.src(getFilesSrc(argv))
        .pipe(mocha({
            reporter: 'spec',
            timeout : 20000,
            require : ['./test.init']
        }));
});

gulp.task('default', function(){
    var env = {
        NODE_ENV : argv.env ? argv.env : 'development'
    };

    if (argv.env === 'test'){
        env.NO_EMAILS = true;
    }

    console.log('Starting with env [' + JSON.stringify(env) + ']');

    nodemon({
        script: 'index.js'
        , ext: 'js html'
        , env: env
    });
});
