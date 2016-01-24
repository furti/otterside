var tsconfig = require('../tsconfig.json'),
  typedoc = require('gulp-typedoc');

module.exports = {
  registerTasks: function(taskList) {

  },
  task: function(gulp) {
    gulp.task('typedoc', function() {
      return gulp.src(['./src/web/scripts/**/**.ts', './src/web/scripts/**/**.tsx'])
        .pipe(typedoc({
          name: 'Otterside',
          module: tsconfig.compilerOptions.module,
          target: tsconfig.compilerOptions.target,
          out: './doc/api',
          jsx: tsconfig.compilerOptions.jsx
        }));
    });
  },
  watch: function(gulp) {

  }
};
