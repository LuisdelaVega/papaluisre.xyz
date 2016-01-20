var gulp = require('gulp');
var sass = require('gulp-sass'); // Compiles Sass to CSS
var browserSync = require('browser-sync'); // Live-reloads the browser
var useref = require('gulp-useref'); // Optimizes CSS and JavaScript files by concatenating them
var uglify = require('gulp-uglify'); // Minifies the concatenated JS files
var cssnano = require('gulp-cssnano'); // Minifies the concatenated CSS files
var gulpIf = require('gulp-if'); // It's like putting an if statement
var imagemin = require('gulp-imagemin'); // Minifies png, jpg, gif, and even svg
var cache = require('gulp-cache'); // Self explanatory. Caches stuff
var del = require('del'); // Cleanes up generated files automatically. Makes sure that files that are no longer used don't remain anywhere without us knowing.
var runSequence = require('run-sequence'); // Self explanatory. Runs tasks in a specific order

gulp.task('hello', function() {
  console.log('Hi');
});

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.+(scss|sass)') // Get any file ending in scss or sass in any directory under app/scss
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ // Allows Browser Sync to inject new CSS styles (update the CSS) into the browser whenever the sass task is ran
      stream: true
    }));
});

// The second argument tells Gulp that those tasks must be completed before watch is allowed to run. NOTE: Gulp runs this tasks (second argument) simultaneously
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.+(scss|sass)', ['sass']); // Watches for changes on these files and runs all the tasks in the array on the second parameter
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// We need to let Browser Sync know where the root of the server should be
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a CSS file
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
    interlaced: true // This options object is optional. Here I'm just setting it so that I can create interlaced GIFs... Whatever that is
  })))
  .pipe(gulp.dest('dist/images'));
});

// FYI, fonts are optimized
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// Clear the caches off your local system
gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

gulp.task('build', function (callback) {
  // Tasks in an array are run simultaneously
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});

// To run default we just need to type gulp
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'], callback);
});
