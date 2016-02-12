var ts = require('gulp-typescript'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  tsconfig = require('../tsconfig.json'),
  tsProject = ts.createProject('./tsconfig.json', {
    sortOutput: true
  });

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('ts');
  },
  task: function(gulp) {
    gulp.task('ts', function() {
      var result = tsProject.src()
        .pipe(ts(tsProject));

      return result.js
        .pipe(sourcemaps.init())
        .pipe(concat('otterside.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
    });
  },
  watch: function(gulp) {
    gulp.watch(tsconfig.filesGlob, ['ts']);
  }
};
