const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('colors');

/**
 *
 * @param {String[]} paths
 */
function copyFolders(paths) {
	log('Copying ' + 'folders'.blue + '...');
	paths.forEach(path => {
		log('-  ' + colors.green(path));
		gulp.src(path + '/**/*').pipe(gulp.dest('../dist/' + path));
	});
}
/**
 *
 * @param {[]} files
 */
function copyFiles(files) {
	log('Copying ' + 'files'.blue);
	files.forEach(file => {
		log('-  ' + colors.green(file));
		gulp.src(file).pipe(gulp.dest('../dist/'));
	});
}

const folders = ['assets', 'images'];
const files = ['index.html', 'LICENSE.txt', 'README.txt'];

exports.default = async () => {
	copyFolders(folders);
	copyFiles(files);
};
