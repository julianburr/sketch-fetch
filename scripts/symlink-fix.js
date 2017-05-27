var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// Follow sym links of the current version to actual directories
var copyRoot = resolveApp('frameworks/SketchFetch.framework/Versions/Current');
copyRoot = fs.realpathSync(copyRoot);

// Target should be the root of the framework
var targetRoot = resolveApp('frameworks/SketchFetch.framework');

// Files/directories that should be copied over
var copyLinks = [
  '/Headers',
  '/Modules',
  '/Resources',
  '/SketchFetch'
];

console.log('');
console.log(chalk.grey.italic('NPM does not support sym links, which are used in ObjC frameworks to link the current version into the root directory. As a temporary workaround we will copy the current version manually before publishing the library here...'));
console.log('');

copyLinks.forEach(link => {
  fs.removeSync(targetRoot + link);
  fs.copySync(copyRoot + link, targetRoot + link);
  console.log('✓ Copied ' + link)
});

console.log('');
console.log(chalk.green.bold('✓ All done!'));

