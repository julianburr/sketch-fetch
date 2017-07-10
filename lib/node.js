var path = require('path');
var fs = require('fs-extra');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}
var fetchFrameworks = {
  'SketchFetch.framework': resolveApp('node_modules/sketch-fetch/frameworks/SketchFetch.framework')
};

function copyFrameworks (targetDirectory) {
  for (var key in fetchFrameworks) {
    var frameworkName = key;
    var frameworkPath = fetchFrameworks[key];
    fs.copySync(frameworkPath, targetDirectory + '/' + frameworkName)
  }
}

exports.copyFrameworks = copyFrameworks;