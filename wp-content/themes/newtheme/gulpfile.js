'use strict';

// ///////////////////////////////////
// Required
// ///////////////////////////////////
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'), 
	cleanCSS = require('gulp-clean-css'), 
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	reload = browserSync.reload;
	
	
// ///////////////////////////////////	
// Scripts
// ///////////////////////////////////
var jsFiles = 'assets/js-plugins/*.js',
	jsCustom = 'assets/js-custom/*.js',  
    jsDest = 'assets/js';
    
gulp.task('scripts', function() {  
    gulp.src(jsFiles)
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
});
gulp.task('customscripts', function() {  
	gulp.src(jsCustom)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
});


// ///////////////////////////////////	
// SASS
// ///////////////////////////////////

// Different options for the Sass tasks
var options = {};
options.sass = {
  errLogToConsole: true,
  precision: 8,
  noCache: true,
  //imagePath: 'assets/img'
};

options.sassmin = {
  errLogToConsole: true,
  precision: 8,
  noCache: true,
  outputStyle: 'compressed'
};

gulp.task('sass', function() {
    gulp.src('assets/sass/main.scss')
        .pipe(plumber())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('assets/css'))
        .pipe(notify({ title: 'Sass', message: 'sass task complete'  }));
});

// Sass-min - Release build minifies CSS after compiling Sass
gulp.task('sass-min', function() {
    gulp.src('assets/sass/main.scss')
        .pipe(plumber())
        .pipe(sass(options.sassmin).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename( { suffix: '.min' } ) )
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream())
        .pipe(notify({ title: 'Sass', message: 'sass-min task complete' }));
});


// ///////////////////////////////////	
// Image minify
// ///////////////////////////////////	
gulp.task('imagemin', function () {
	gulp.src('assets/images/src/*')
    	.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		]))
		//.pipe(svgo())
    	.pipe(gulp.dest('assets/images/dist'))
    	.pipe( notify({ message: 'Imagemin task complete' }));
});



// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync.init({
    	proxy: "http://localhost:8888/niavac",
	});
  gulp.watch( 'assets/images/src/*', ['imagemin'] );
	gulp.watch( 'assets/sass/**/*.scss', ['sass', 'sass-min'] );
	gulp.watch( [ 'assets/js-custom/*.js', 'assets/js-plugins/*.js','!assets/js/*.js' ], [ 'scripts', 'customscripts' ] )
	gulp.watch( 'assets/css/main.min.css' ).on('change', browserSync.reload);
	gulp.watch( 'assets/js/main.min.js' ).on('change', browserSync.reload);
});





// ///////////////////////////////////
// Default
// ///////////////////////////////////
gulp.task('default', ['scripts', 'customscripts', 'sass', 'sass-min', 'browser-sync']);