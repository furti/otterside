var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  connect = require('gulp-connect'),
  svg2png = require('gulp-svg2png'),
  tsconfig = require('./tsconfig.json'),
  assetBase = './src/web/assets/',
  htmlSource = './src/web/**/*.html';

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('assets', ['svg'], function() {
  return gulp.src([assetBase + '**', '!' + assetBase + '**/*.svg'])
    .pipe(gulp.dest('./target/assets'));
});

gulp.task('svg', function() {
  return gulp.src(assetBase + '**/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./target/assets'));
});

gulp.task('html', function() {
  return gulp.src(htmlSource)
    .pipe(gulp.dest('./target'));
});

gulp.task('ts', function() {
  var result = tsProject.src()
    .pipe(ts(tsProject));

  return result.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});

gulp.task('bower', function() {
  return gulp.src(['./bower_components/phaser/build/phaser.js'])
    .pipe(gulp.dest('./target/scripts'));
});

gulp.task('watch', ['ts', 'assets', 'html', 'bower'], function() {
  connect.server({
    root: 'target'
  });

  gulp.watch(tsconfig.filesGlob, ['ts']);
  gulp.watch(assetBase + '**', ['assets']);
  gulp.watch(htmlSource, ['html']);
  gulp.watch('./bower', ['bower']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'target'
  });
});
