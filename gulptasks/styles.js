var styleSource = './src/web/styles/**';

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('styles');
  },
  task: function(gulp) {
    gulp.task('styles', function() {
      return gulp.src(styleSource)
        .pipe(gulp.dest('./target/styles'));
    });
  },
  watch: function(gulp) {
    gulp.watch(styleSource, ['styles']);
  }
};
