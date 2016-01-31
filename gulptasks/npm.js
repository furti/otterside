module.exports = {
  registerTasks: function(taskList) {
    taskList.push('npm');
  },
  task: function(gulp) {
    gulp.task('npm', function() {
      return gulp.src([
          './node_modules/typescript/lib/typescript.js'
        ])
        .pipe(gulp.dest('./target/scripts'));
    });
  },
  watch: function(gulp) {}
};
