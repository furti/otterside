var rename = require('gulp-rename');

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('bower');
  },
  task: function(gulp) {
    gulp.task('bower', ['classnames', 'text-encoder-lite'], function() {
      return gulp.src([
          './bower_components/phaser/build/phaser.js',
          './bower_components/q/q.js',
          './bower_components/react/react.js',
          './bower_components/react/react-dom.js',
          './bower_components/marked/marked.min.js',
          './bower_components/base64-js/lib/b64.js'
        ])
        .pipe(gulp.dest('./target/scripts'));
    });

    gulp.task('text-encoder-lite', function() {
      return gulp.src('./bower_components/text-encoder-lite/index.js')
        .pipe(rename('text-encoder-lite.js'))
        .pipe(gulp.dest('./target/scripts'));
    });

    gulp.task('classnames', function() {
      return gulp.src('./bower_components/classnames/index.js')
        .pipe(rename('classnames.js'))
        .pipe(gulp.dest('./target/scripts'));
    });

  },
  watch: function(gulp) {
    gulp.watch('./bower', ['bower']);
  }
};
