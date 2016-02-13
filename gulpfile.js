var gulp = require('gulp'),
  assets = require('./gulptasks/assets'),
  html = require('./gulptasks/html'),
  scripts = require('./gulptasks/scripts'),
  styles = require('./gulptasks/styles'),
  consolejson = require('./gulptasks/consolejson'),
  typedoc = require('./gulptasks/typedoc'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect');

(function monkeyPatchGulpSourceToUsePlumber(gulp) {
  var _gulpsrc = gulp.src;

  gulp.src = function() {
    return _gulpsrc.apply(gulp, arguments)
    .pipe(plumber());
  };

  console.log('🐒 patched gulp src to use plumber.');
})(gulp);

assets.task(gulp);
html.task(gulp);
scripts.task(gulp);
styles.task(gulp);
typedoc.task(gulp);
consolejson.task(gulp);

var allTasks = ['connect'];

assets.registerTasks(allTasks);
html.registerTasks(allTasks);
scripts.registerTasks(allTasks);
styles.registerTasks(allTasks);
typedoc.registerTasks(allTasks);
consolejson.registerTasks(allTasks);

gulp.task('watch', allTasks, function() {
  assets.watch(gulp);
  html.watch(gulp);
  scripts.watch(gulp);
  styles.watch(gulp);
  typedoc.watch(gulp);
  consolejson.watch(gulp);
});

gulp.task('connect', function() {
  connect.server({
    root: 'target',
    middleware: function() {
      return [
        require('connect-gzip').gzip()
      ];
    }
  });
});
