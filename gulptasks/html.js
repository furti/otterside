var htmlSource = './src/web/**/*.html';

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('html');
  },
  task: function(gulp) {
    gulp.task('html', function() {
      return gulp.src(htmlSource)
        .pipe(gulp.dest('./target'));
    });
  },
  watch: function(gulp) {
    gulp.watch(htmlSource, ['html']);
  }
};
