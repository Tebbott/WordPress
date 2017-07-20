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
		plumber = require('gulp-plumber');
		
	
	
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
// SASS Styles
// ///////////////////////////////////
	gulp.task('sass', function() {

		gulp.src('assets/sass/**/*.scss')
		    .pipe(sass().on('error', sass.logError))
		    .pipe(autoprefixer({
	            browsers: ['last 2 versions'],
	            cascade: false
	        }))
		    .pipe(gulp.dest('assets/css'));
		});



	gulp.task('css', function() {

		gulp.src(['assets/css/*.css', '!assets/css/*.min.css', '!assets/css/main.min.css'])
			.pipe(concat('main.css'))
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('assets/css'))
	});



// ///////////////////////////////////	
// Image minify
// ///////////////////////////////////	
	gulp.task('imagemin', function () {
    	gulp.src('assets/images/src/*')
        	.pipe(imagemin({
	        	optimizationLevel: 7,
				progressive: true
        	}))
			.pipe(gulp.dest('assets/images/dist'))
	});



// ///////////////////////////////////	
// PHP Tasks
// ///////////////////////////////////
	gulp.task('php', function() {
		gulp.src('*.php')
	});



// ///////////////////////////////////	
// BrowserSync
// ///////////////////////////////////
	gulp.task('browser-sync', function() {
		browserSync.init({
	        proxy: "localhost",
	        browser: "google chrome",
	        notify: false,
	        snippetOptions: {
	            whitelist: ["/wp-admin/admin-ajax.php"], // whitelist checked first
        		blacklist: ["/wp-admin/**"]
	        }
	    });
	    gulp.watch('assets/css/*.css', ['css']).on('change', browserSync.reload);
	    gulp.watch('assets/sass/*.scss', ['sass']).on('change', browserSync.reload);
		gulp.watch('assets/js-plugins/*.js', ['scripts']).on('change', browserSync.reload);
		gulp.watch('assets/js-custom/*.js', ['customscripts']).on('change', browserSync.reload);
		gulp.watch('*.php', ['php']).on('change', browserSync.reload);
	});



// ///////////////////////////////////
// Watch
// ///////////////////////////////////
	gulp.task('watch', function () {
		gulp.watch('assets/css/*.css', ['css']);
		gulp.watch('assets/sass/**/*.scss', ['sass']);
		gulp.watch('assets/images/**/*', ['imagemin']);
		gulp.watch('assets/js-plugins/*.js', ['scripts']);
		gulp.watch('assets/js-custom/*.js', ['customscripts']);
		gulp.watch('*.php', ['php']);
	});


// ///////////////////////////////////
// Default
// ///////////////////////////////////
gulp.task('default', ['scripts', 'sass', 'css', 'customscripts', 'imagemin', 'php', 'browser-sync', 'watch']);
