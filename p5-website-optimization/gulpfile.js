var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var gzip = require("gulp-gzip");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');


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
  .pipe(gzip())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function() {
  return gulp.src(['./src/**/*.css', './src/views/**/*.css'])
  .pipe(minifyCSS())
  .pipe(gzip())
  .pipe(gulp.dest('./dist/'));
});


gulp.task('image', function () {
  return gulp.src(['./src/**/*.jpg', './src/**/*.png'])
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    interlaced: true,
    optimizationLevel: 7,
    use: [pngquant({quality: '25-50'}), imageminJpegRecompress({min: 60, max: 95})]
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.html', ['minify-html']);
  gulp.watch(['./src/**/*.js', './src/views/**/*.js'], ['scripts']);
  gulp.watch(['./src/**/*.css', './src/views/**/*.css'], ['css']);
});

gulp.task('default', ['scripts',  'css', 'minify-html', 'watch']);
