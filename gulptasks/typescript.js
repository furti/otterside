var ts = require('gulp-typescript'),
  tsconfig = require('../tsconfig.json'),
  tsProject = ts.createProject('./tsconfig.json');

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('ts');
  },
  task: function(gulp) {
    gulp.task('ts', function() {
      var result = tsProject.src()
        .pipe(ts(tsProject));

      return result.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
    });
  },
  watch: function(gulp) {
    gulp.watch(tsconfig.filesGlob, ['ts']);
  }
};
