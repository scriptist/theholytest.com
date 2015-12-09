var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var babelify = require('babelify');
var aliasify = require('aliasify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var onError = function (err) {
	$.util.beep();
	$.util.log($.util.colors.red('Compilation Error\n'), err.toString());
};

gulp.task('scss', ['cleancss'], function() {
	return gulp
		.src('app/scss/**/*.scss')
		.pipe($.plumber({
			errorHandler: onError
		}))
		.pipe($.sourcemaps.init())
			.pipe($.sass({
				outputStyle: 'compressed',
				onError: console.error.bind(console, 'Sass error:')
			}))
			.pipe(autoprefixer())
		.pipe($.sourcemaps.write(''))
		.pipe(gulp.dest('tmp/css'))
		.pipe(browserSync.stream());
});

gulp.task('es6', ['lintes6', 'cleanjs'], function() {
	var b = browserify({
		baseDir: 'app/es6',
		entries: ['app/es6/global.es6'],
		paths: ['app/es6', 'bower_components'],
		transform: [aliasify]
	});
	b.transform('babelify', {extensions: ['.es6']});

	return b.bundle()
		.on('error', function (err) {
			onError(err);
			this.emit("end");
		})
		.pipe($.plumber({
			errorHandler: onError
		}))
		.pipe(source('global.es6'))
		.pipe(buffer())
		.pipe($.rename({
			extname: '.js'
		}))
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.sourcemaps.write(''))
		.pipe(gulp.dest('tmp/js'))
		.pipe(browserSync.stream({once: true}));
});

gulp.task('nunjucks', function () {
	return gulp.src('app/nunjucks/[^_]*.html.nunjucks')
		.pipe($.nunjucksHtml({
			searchPaths: ['app/nunjucks']
		}))
		.pipe($.rename({
			extname: ''
		}))
		.pipe(gulp.dest('tmp'))
		.pipe(browserSync.stream());
});

gulp.task('buildcss', ['scss'], function() {
	return gulp
		.src('tmp/css/*.css')
		.pipe($.uglifycss())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('buildjs', ['es6'], function() {
	return gulp
		.src('tmp/js/*.js')
		.pipe($.uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('lintes6', function() {
	return gulp
		.src('app/es6/global.es6')
		.pipe($.eslint({
			extends: 'eslint:recommended',
			env: {
				"amd": true,
				"browser": true,
			},
			parser: 'babel-eslint',
			rules: {
				'brace-style': [1, '1tbs'],
				'camelcase': 1,
				'comma-dangle': [1, 'always-multiline'],
				'comma-spacing': [1, {'before': false, 'after': true}],
				'comma-style': [2, 'last'],
				'eol-last': 1,
				'indent': [2, 'tab'],
				'no-console': 0,
				'quotes': [1, 'single'],
				'semi': 2,
				'strict': [2, 'global'],
			},
		}))
		.pipe($.eslint.format('stylish', process.stderr))
		.pipe($.eslint.results(function(results) {
			if (results.warningCount || results.errorCount) {
				$.util.beep();
			}
		}));
});

gulp.task('buildhtml', ['nunjucks'], function() {
	return gulp
		.src('tmp/**/*.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('buildimages', ['nunjucks'], function() {
	return gulp
		.src('app/image/**/*')
		.pipe(gulp.dest('dist/image'));
});

gulp.task('build', ['buildcss', 'buildjs', 'buildhtml', 'buildimages']);

gulp.task('cleancss', require('del').bind(null, ['tmp/css/*.css']));

gulp.task('cleanjs', require('del').bind(null, ['tmp/js/*.js']));

gulp.task('clean', require('del').bind(null, ['tmp', 'dist']));

gulp.task('watch', ['scss', 'es6', 'nunjucks'], function() {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['tmp', 'app'],
			index: 'index.html',
		},
	});

	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/es6/**/*.es6', ['es6']);
	gulp.watch('app/nunjucks/**/*.nunjucks', ['nunjucks']);
});

gulp.task('default', ['watch']);
