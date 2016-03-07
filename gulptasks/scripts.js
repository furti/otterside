var ts = require('gulp-typescript'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  tsconfig = require('../tsconfig.json'),
  tsProject = ts.createProject('./tsconfig.json', {
    sortOutput: true
  });

var vendorSources = [
  './bower_components/phaser/build/phaser.min.js',
  './bower_components/marked/lib/marked.js',
  './bower_components/react/react.js',
  './bower_components/react/react-dom.js',
  './bower_components/q/q.js',
  './bower_components/base64-js/lib/b64.js',
  './bower_components/classnames/index.js',
  './bower_components/text-encoder-lite/index.js',
  './node_modules/typescript/lib/typescript.js',
  './bower_components/fast-levenshtein/levenshtein.min.js'
];

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('lib');
    taskList.push('ts');
  },
  task: function(gulp) {
    gulp.task('lib', function() {
      return gulp.src(vendorSources)
        .pipe(sourcemaps.init({
          loadMaps: true
        }))
        .pipe(uglify())
        .pipe(concat('lib.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
    });

    gulp.task('ts', function() {
      var tsSources = tsProject.src()
        .pipe(ts(tsProject)).js;

      return tsSources
        .pipe(sourcemaps.init({
          loadMaps: true
        }))
        .pipe(uglify())
        .pipe(concat('otterside.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
    });
  },
  watch: function(gulp) {
    gulp.watch(tsconfig.filesGlob, ['ts']);
  }
};
