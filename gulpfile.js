var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  tsconfig = require('./tsconfig.json');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('build', function() {
  var result = tsProject.src()
    .pipe(ts(tsProject));

  return result.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(tsconfig.filesGlob, ['build']);
});
