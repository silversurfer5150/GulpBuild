//-------------------------------------------------//
//**********Finally a Simple Gulp Build************//
//-------------------------------------------------//
//-------------------------------------------------//

//*** Instantiate gulp variables and associated plugins ***//

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename');
	browserSync = require('browser-sync').create();

//*** This task deals with the JavaScript Build ***//

gulp.task('build', function () {
	return gulp.src('src/scripts/**/*.js')
		.pipe(jshint()) // error check with jshint
		.pipe(jshint.reporter('default')) // report any errors in the build window
		.pipe(concat('bundle.min.js')) // concatenate all scripts into one bundle
		.pipe(gulp.dest('public/js')) // copy to destination
		.pipe(uglify()) // uglify new script
		.pipe(gulp.dest('public/js')) // overwrite to destination
		.pipe(browserSync.stream()); // load the new js into the browsers
});

//*** This Task Runs Automated Tests Against the JS Code ***//

gulp.task('test', function () {
	return gulp.src('test/*.js')
		.pipe(mocha());
});

//*** This Task Watches files for CHanges and Rebuilds upon any change ***//

gulp.task('watch', function () {
	gulp.watch('src/scripts/**/*.js', ['build']); // watch all scripts - rebuild on change	
	gulp.watch("src/scss/**/*.scss", ['sass']); // watch all scss - recompile on change
	gulp.watch("*.html").on('change', browserSync.reload); // watch all html files, reload on change
});

//*** This Task Compile Sass into CSS & auto-injects into browsers ***//
gulp.task('sass', function () {
	return gulp.src("src/scss/*.scss") // get all scss files
		.pipe(sass()) // complile them into CSS
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("public/css")) // output the CSS file to destination
		.pipe(browserSync.stream()); // load the new CSS into the browsers
});

//*** This Task runs a Static Server + watching scss/html files ***//
gulp.task('serve', ['build'], function () {

	browserSync.init({
		server: "./" // server runs at the root of this gulp project - index.html is there
	});

});

//*** This is the main Task which runs all of the above ***//
gulp.task('default', ['watch', 'build', 'test', 'sass', 'serve']);