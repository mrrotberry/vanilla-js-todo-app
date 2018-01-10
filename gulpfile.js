'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps');

/* connect*/
gulp.task('connect', function() {
	connect.server({
		root: 'dist',
		livereload: true,
		port: 8000
	});
});

/* pug */
gulp.task('html', function () {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

/* scss */
gulp.task('scss', function () {
  return gulp.src('./src/scss/style.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(scss({ outputStyle: 'compressed' }).on('error', scss.logError))
    .pipe(autoprefixer(['last 2 versions',], { cascade: true }))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

/* js */
gulp.task('js', function () {
  return gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./dist/js/'))
    .pipe(connect.reload());
});


/* watch */
gulp.task('watch', function () {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/scss/**/*.scss', ['scss']);
  gulp.watch('./src/js/**/*.js', ['js']);
});

//default
gulp.task('default', ['connect', 'html', 'scss', 'js', 'watch']);
