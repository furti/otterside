var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  connect = require('gulp-connect'),
  tsconfig = require('./tsconfig.json'),
  assetSource = './src/web/assets/**',
  htmlSource = './src/web/**/*.html';

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('assets', function() {
  return gulp.src(assetSource)
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
  gulp.watch(assetSource, ['assets']);
  gulp.watch(htmlSource, ['html']);
  gulp.watch('./bower', ['bower']);
});
