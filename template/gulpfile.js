const gulp = require('gulp');

/**
 *
 * @param {String[]} paths
 */
function copyFolders(paths) {
	console.info('copying folders');
	paths.forEach(path => {
		console.log('copying ' + path);
		gulp.src(path + '/**/*').pipe(gulp.dest('../dist/' + path));
	});
}
/**
 *
 * @param {[]} files
 */
function copyFiles(files) {
	console.info('copying files');
	files.forEach(file => {
		console.log('copying ' + file);
		gulp.src(file).pipe(gulp.dest('../dist/'));
	});
}

const folders = ['assets', 'images'];
const files = ['index.html', 'LICENSE.txt', 'README.txt'];

exports.default = async () => {
	copyFolders(folders);
	copyFiles(files);
};
