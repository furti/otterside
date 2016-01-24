var gulp = require('gulp'),
  assets = require('./gulptasks/assets'),
  html = require('./gulptasks/html'),
  typescript = require('./gulptasks/typescript'),
  bower = require('./gulptasks/bower'),
  styles = require('./gulptasks/styles'),
  consolejson = require('./gulptasks/consolejson'),
  typedoc = require('./gulptasks/typedoc'),
  connect = require('gulp-connect');

assets.task(gulp);
html.task(gulp);
typescript.task(gulp);
bower.task(gulp);
styles.task(gulp);
typedoc.task(gulp);
consolejson.task(gulp);



var allTasks = ['connect'];

assets.registerTasks(allTasks);
html.registerTasks(allTasks);
typescript.registerTasks(allTasks);
bower.registerTasks(allTasks);
styles.registerTasks(allTasks);
typedoc.registerTasks(allTasks);
consolejson.registerTasks(allTasks);

gulp.task('watch', allTasks, function() {
  assets.watch(gulp);
  html.watch(gulp);
  typescript.watch(gulp);
  bower.watch(gulp);
  styles.watch(gulp);
  typedoc.watch(gulp);
  consolejson.watch(gulp);
});

gulp.task('connect', function() {
  connect.server({
    root: 'target'
  });
});
