var assetBase = './src/web/assets/',
  svg2png = require('gulp-svg2png');

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('assets');
  },
  task: function(gulp) {

    gulp.task('assets', ['svg'], function() {
      return gulp.src([assetBase + '**', '!' + assetBase + '**/*.svg'])
        .pipe(gulp.dest('./target/assets'));
    });

    gulp.task('svg', function() {
      return gulp.src(assetBase + '**/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest('./target/assets'));
    });

  },
  watch: function(gulp) {
    gulp.watch(assetBase + '**', ['assets']);
  }
};
