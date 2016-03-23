var gulp = require('gulp');
var uglify = require('gulp-uglify');

var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
  return gulp.src(['./src/**/*.html', './src/views/**/*.html'])
  .pipe(minifyHTML(opts))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', function() {
  gulp.src(['./src/**/*.js', './src/views/**/*.js'])
  .pipe(uglify())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function() {
  return gulp.src(['./src/**/*.css', './src/views/**/*.css'])
  .pipe(minifyCSS())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.html', ['minify-html']);
  gulp.watch(['./src/**/*.js'], ['scripts']);
  gulp.watch(['./src/**/*.css'], ['css']);
});


gulp.task('default', ['scripts',  'css', 'minify-html', 'watch']);
