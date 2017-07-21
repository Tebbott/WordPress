// Load all the modules from package.json
var gulp = require( 'gulp' ),
  plumber = require( 'gulp-plumber' ),
  autoprefixer = require('gulp-autoprefixer'),
  watch = require( 'gulp-watch' ),
  jshint = require( 'gulp-jshint' ),
  stylish = require( 'jshint-stylish' ),
  uglify = require( 'gulp-uglify' ),
  rename = require( 'gulp-rename' ),
  notify = require( 'gulp-notify' ),
  concat = require('gulp-concat'),
  include = require( 'gulp-include' ),
  sass = require( 'gulp-sass' ),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync').create(),
  critical = require('critical'),
  fixmyjs = require("gulp-fixmyjs"),
  zip = require('gulp-zip');

 
// Default error handler
var onError = function( err ) {
  console.log( 'An error occured:', err.message );
  this.emit('end');
}

// Zip files up
gulp.task('zip', function () {
 return gulp.src([
   '*',
   'assets/css/*',
   'assets/images/**/*',
   'assets/js/**/*',
   'assets/sass/**/*',
   'templates/*',
   '!node_modules',
  ], {base: "."})
  .pipe(zip('themefiles.zip'))
  .pipe(gulp.dest('.'));
});

 
// Jshint outputs any kind of javascript problems you might have
// Only checks javascript files inside /src directory
gulp.task( 'jshint', function() {
  return gulp.src( 'assets/js/*.js' )
    .pipe( fixmyjs() )
    .pipe( jshint() )
    .pipe( jshint.reporter( stylish ) )
    .pipe( jshint.reporter( 'fail' ) );
})
 
 
  var jsFiles = 'assets/js-plugins/*.js',
    jsCustom = 'assets/js-custom/*.js',  
      jsDest = 'assets/js';
      
  gulp.task('scripts', ['jshint'], function() {  
      gulp.src(jsFiles)
          .pipe(concat('plugins.js'))
          .pipe(gulp.dest(jsDest))
          .pipe(rename('plugins.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(jsDest))
          .pipe( notify({ message: 'scripts task complete' }));
  });
  gulp.task('customscripts', ['jshint'], function() {  
    gulp.src(jsCustom)
          .pipe(concat('main.js'))
          .pipe(gulp.dest(jsDest))
          .pipe(rename('main.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(jsDest))
          .pipe( notify({ message: 'customscripts task complete' }));
  });


 
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

// Sass
gulp.task('sass', function() {
    return gulp.src('assets/sass/main.scss')
        .pipe(plumber())
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ title: 'Sass', message: 'sass task complete'  }));
});

// Sass-min - Release build minifies CSS after compiling Sass
gulp.task('sass-min', function() {
    return gulp.src('assets/sass/main.scss')
        .pipe(plumber())
        .pipe(sass(options.sassmin).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename( { suffix: '.min' } ) )
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ title: 'Sass', message: 'sass-min task complete' }));
});

// Optimize Images
gulp.task('images', function() {
    return gulp.src('assets/images/src/*')
        .pipe(imagemin({
            optimizationLevel: 7,
            progressive: true
        }))
        .pipe(gulp.dest('assets/images/dist'))
        .pipe( notify({ message: 'Images task complete' }));
});

// Generate & Inline Critical-path CSS
// gulp.task('critical', function (cb) {
//     critical.generate({
//         base: './',
//         src: 'http://sp:8888/',
//         dest: 'css/home.min.css',
//         ignore: ['@font-face'],
//         dimensions: [{
//           width: 320,
//           height: 480
//         },{
//           width: 768,
//           height: 1024
//         },{
//           width: 1280,
//           height: 960
//         }],
//         minify: true
//     });
// });




// automatically reloads the page when files changed
var browserSyncWatchFiles = [
    'assets/css/*.min.css',
    'assets/js/**/*.js'
];

// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
    watchTask: true,
    proxy: "http://localhost/"
}

// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});
 
 
// Start the livereload server and watch files for change
gulp.task( 'watch', function() {
  // don't listen to whole js folder, it'll create an infinite loop
  gulp.watch( [ 'assets/js-custom/*.js', 'assets/js-plugins/*.js','!assets/js/*.js' ], [ 'scripts', 'customscripts' ] )
  gulp.watch( 'assets/sass/**/*.scss', ['sass', 'sass-min', 'browser-sync'] );
  gulp.watch( 'assets/images/**/*', ['images']);
  //gulp.watch( './**/*.php' ).on('change', browserSync.reload);
} );



 
gulp.task( 'default', ['watch', 'browser-sync'], function() {
 // Does nothing in this task, just triggers the dependent 'watch'
} );