var gulp = require('gulp');
var uglify = require('gulp-uglify');
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

gulp.task('clean', function(cb) {
  del.sync(['dist'], cb);
});

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

gulp.task('image', function () {
  return gulp.src(['./src/**/*.jpg', './src/**/*.png'])
  .pipe(imagemin({
    use: [pngquant({quality: '25-50'}), imageminJpegRecompress({min: 60, max: 95})]
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.html', ['minify-html']);
  gulp.watch(['./src/**/*.js'], ['scripts']);
  gulp.watch(['./src/**/*.css'], ['css']);
  gulp.watch(['./src/**/*.jpg', './src/**/*.png'], ['image'])
});

gulp.task('default', ['clean', 'scripts',  'css', 'minify-html', 'image', 'watch']);
