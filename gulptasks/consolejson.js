var fs = require('fs'),
  eol = require('eol'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  consoleGlob = ['./src/web/console/**'];

var specialFiles = {
  'welcome.md': function(fileContent, consoleContent) {
    consoleContent.welcome = processFileContent(fileContent);
  },
  'config.json': function(fileContent, consoleContent) {
    var config = JSON.parse(fileContent);

    consoleContent.executables = config.executables;
  }
};

function processFileContent(fileContent) {
  fileContent = eol.lf(fileContent);
  fileContent = new Buffer(fileContent).toString('base64');

  return fileContent;
}

function createContentFile(fileName, fileContent) {
  var parsed = path.parse(fileName);

  return {
    content: processFileContent(fileContent),
    base: fileName,
    name: parsed.name,
    ext: parsed.ext
  };
}

/**
 * This badass here reads all files from the console folders and creates the content.json file.
 */
function createConsoleContent() {
  var srcPath = './src/web/console';
  var targetPath = './target/console';
  var consoleFolders = fs.readdirSync(srcPath);

  if (!consoleFolders) {
    return;
  }

  consoleFolders.forEach(function(folderName) {
    var consoleSrcPath = srcPath + '/' + folderName;
    var consoleTargetPath = targetPath + '/' + folderName;

    var files = fs.readdirSync(consoleSrcPath);

    if (!files || files.length === 0) {
      console.log('No files found for ' + consoleSrcPath);
    } else {
      var consoleContent = {
        files: {}
      };

      files.forEach(function(file) {
        var fileContent = fs.readFileSync(consoleSrcPath + '/' + file, 'utf8');

        if (specialFiles[file]) {
          specialFiles[file](fileContent, consoleContent);
        } else {
          consoleContent.files[file] = createContentFile(file, fileContent);
        }
      });

      mkdirp.sync(consoleTargetPath);

      fs.writeFileSync(consoleTargetPath + '/content.json', JSON.stringify(consoleContent), 'utf8');
    }
  });
}

module.exports = {
  registerTasks: function(taskList) {
    taskList.push('content.json');
  },
  task: function(gulp) {
    gulp.task('content.json', createConsoleContent);
  },
  watch: function(gulp) {
    gulp.watch(consoleGlob, ['content.json']);
  }
};
