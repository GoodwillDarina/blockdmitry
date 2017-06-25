const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const addStream = require('add-stream');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const nib = require('nib');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-minify-css');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require("browser-sync");
const reload = browserSync.reload;

gulp.task('clean:css', cleanCss);
gulp.task('clean:js', cleanJs);
gulp.task('clean', clean);

gulp.task('compile:js', compileJs);
gulp.task('compile:stylus', compileStylus);
gulp.task('copy:images', copyImages);
gulp.task('copy:fonts', copyFonts);
gulp.task('copy:libraries', copyLibraries);

gulp.task('server', startServer);

gulp.task('build', ['clean', 'copy:fonts', 'copy:images', 'copy:libraries', 'compile:js', 'compile:stylus'], copyIndex);

gulp.task('watcher:css', ['clean:css', 'compile:stylus'], copyIndex);
gulp.task('watcher:js', ['clean:js', 'compile:js'], copyIndex);
gulp.task('watch', ['build'], watch);

gulp.task('server:watch', ['server', 'build'], watch);
gulp.task('default', ['build']);

function startServer() {
    browserSync({
        server: {
            baseDir: "./app"
        },
        host: 'localhost',
        port: 3030
    });
}

function clean() {
    del.sync(['./app']);
    console.log('[--------] App folder was deleted');
}

function copyIndex() {
    return gulp.src('./source/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('./app'))
        .pipe(reload({stream: true}));
}

function compileJs() {
    return browserify({entries: './source/app/app.js'}).bundle()
        .pipe(plumber())
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app'));
}

function compileStylus() {
    return gulp.src('./source/styles/styles.styl')
        .pipe(stylus({
            'paths':  ['node_modules', 'source/styles'],
            'import': ['nib', 'stylus-type-utils'],
            'use': [nib()],
            'include css': true
        }))
        .pipe(plumber())
        .pipe(gulp.dest('./app/styles'))
}

function copyImages() {
    return gulp.src('./source/images/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('./app/images'));
}

function copyFonts() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(plumber())
        .pipe(gulp.dest('./app/fonts'));
}

function copyLibraries() {
    return gulp.src([
        './node_modules/angular/angular.min.js',
        './node_modules/normalize.css/normalize.css',
        './source/libs/**/*.*'
    ])
        .pipe(plumber())
        .pipe(gulp.dest('./app/libs/'));
}

function cleanCss() {
    del.sync(['./app/styles/**']);
}

function cleanJs() {
    del.sync(['./app/app.*']);
}

function watch() {
    gulp.watch(['./source/styles/**/*.styl', './source/styles/**/*.css'], ['watcher:css']);
    gulp.watch(['./source/**/*.html', './source/**/*.js'], ['watcher:js']);
}