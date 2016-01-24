var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  connect = require('gulp-connect'),
  svg2png = require('gulp-svg2png'),
  typedoc = require('gulp-typedoc'),
  rename = require('gulp-rename'),
  fs = require('fs'),
  eol = require('eol'),
  path = require('path'),
  tsconfig = require('./tsconfig.json'),
  assetBase = './src/web/assets/',
  htmlSource = './src/web/**/*.html',
  styleSource = './src/web/styles/**',
  consoleGlob = ['./src/web/console/**'];

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('assets', ['svg'], function() {
  return gulp.src([assetBase + '**', '!' + assetBase + '**/*.svg'])
    .pipe(gulp.dest('./target/assets'));
});

gulp.task('svg', function() {
  return gulp.src(assetBase + '**/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./target/assets'));
});

gulp.task('html', function() {
  return gulp.src(htmlSource)
    .pipe(gulp.dest('./target'));
});

gulp.task('ts', function() {
  var result = tsProject.src()
    .pipe(ts(tsProject));

  return result.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});

gulp.task('bower', function() {
  return gulp.src([
      './bower_components/phaser/build/phaser.js',
      './bower_components/q/q.js',
      './bower_components/react/react.js',
      './bower_components/react/react-dom.js',
      './bower_components/classnames/index.js',
      './bower_components/marked/marked.min.js'
    ])
    .pipe(rename(function(path) {
      if (path.basename === 'index') {
        path.basename = 'classnames';
      }

      return path;
    }))
    .pipe(gulp.dest('./target/scripts'));
});

gulp.task('styles', function() {
  return gulp.src(styleSource)
    .pipe(gulp.dest('./target/styles'));
});

gulp.task('console', function() {
  return gulp.src(consoleGlob)
    .pipe(gulp.dest('./target/console'));
});

gulp.task('content.json', ['ts', 'console'], createConsoleContent);

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

gulp.task('watch', ['assets', 'html', 'bower', 'styles', 'content.json'], function() {
  connect.server({
    root: 'target'
  });

  gulp.watch(tsconfig.filesGlob, ['content.json']);
  gulp.watch(consoleGlob, ['content.json']);
  gulp.watch(assetBase + '**', ['assets']);
  gulp.watch(htmlSource, ['html']);
  gulp.watch(styleSource, ['styles']);
  gulp.watch('./bower', ['bower']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'target'
  });
});

var specialFiles = {
  'welcome.md': function(fileContent, consoleContent) {
    consoleContent.welcome = fileContent;
  },
  'content.json': function() {
    //A simple no-op. if content.json exists we ignore it.
  }
};

function processFileContent(path) {
  var fileContent = fs.readFileSync(path, 'utf8');

  fileContent = eol.lf(fileContent);

  return fileContent;
}

function createContentFile(fileName, fileContent) {
  var parsed = path.parse(fileName);

  return {
    content: fileContent,
    base: fileName,
    name: parsed.name,
    ext: parsed.ext
  };
}

/**
 * This badass here reads all files from the console folders and creates the content.json file.
 */
function createConsoleContent() {
  var basePath = './target/console';
  var consoleFolders = fs.readdirSync(basePath);

  if (!consoleFolders) {
    return;
  }

  consoleFolders.forEach(function(folderName) {
    var consolePath = basePath + '/' + folderName;
    var files = fs.readdirSync(consolePath);

    if (!files || files.length === 0) {
      console.log('No files found for ' + consolePath);
    } else {
      var consoleContent = {
        files: []
      };

      files.forEach(function(file) {
        var fileContent = processFileContent(consolePath + '/' + file);

        if (specialFiles[file]) {
          specialFiles[file](fileContent, consoleContent);
        } else {
          consoleContent.files.push(createContentFile(file, fileContent));
        }
      });

      fs.writeFileSync(consolePath + '/content.json', JSON.stringify(consoleContent), 'utf8');
    }
  });
}
