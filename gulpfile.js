'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
// const babel = require('gulp-babel')
const cached = require('gulp-cached')
const remember = require('gulp-remember')
const sass = require('gulp-sass')

const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')

// var vue = require('./gulp-simple-vue-templates')

const source_js = ['src/**/*.{js,vue}', '!src/background/**/*.js']
// const source_bg_js = ['src/background/**/*.js']
const source_scss = ['src/styles/**/*scss']
const source_fonts = ['src/fonts/**/*']
const source_images = ['src/img/**/*']
const dest = 'app/dist'

// const babel_ptions = {
// 	plugins: ['syntax-async-generators'],
// 	presets: ['stage-0', 'es2015-node5']
// }

var wp_config = {
	entry: './src/index.js',
	output: {
		path: './app/dist',
		filename: 'bundle.js'
	},

	module: {
    loaders: [
      {
				test: /\.vue$/,
				loader: 'vue'
			},
			{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
			{
				test: /\.json$/,
				loader: 'json'
			}
    ]
  },

	externals: [
		{
			'fs': 'require("fs")',
			'path': 'require("path")',
			'wcjs-renderer': 'require("wcjs-renderer")',
			'./import_webchimera.js': 'require("./import_webchimera.js")',
			'./post_install_win.js': 'require("./post_install_win.js")',
			'node-notifier': 'require("node-notifier")',
			'opensubtitles-api': 'require("opensubtitles-api")',
			'iso-639-2': 'require("iso-639-2")',
		},
	],

	babel: {
    presets: ['es2015', 'stage-0']
  },

	devtool: 'eval-cheap-module-source-map',

	cache: true,
}

wp_config.target = webpackTargetElectronRenderer(wp_config)

const sass_config = {}

gulp.task('webpack_debug', function(callback) {
	webpack(wp_config).run(function(err, stats) {
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true,
			chunks: false,
		}))
    callback()
	})
})

gulp.task('styles_debug', function() {
	console.log('running scss')
	return gulp.src('src' + '/styles/index.scss')
	.pipe(sass(sass_config).on('error', sass.logError))
	.pipe(gulp.dest(dest + '/css'))
})

gulp.task('fonts_debug', function() {
	return gulp.src(source_fonts)
	.pipe(cached('fonts'))
	.pipe(remember('fonts'))
	.pipe(gulp.dest(dest + '/fonts'))
})

gulp.task('images_debug', function() {
	return gulp.src(source_images)
	.pipe(cached('images'))
	.pipe(remember('images'))
	.pipe(gulp.dest(dest + '/img'))
})

gulp.task('watch', function(){
  // gulp.watch(source_js, ['scripts_debug'])
	gulp.watch(source_js, ['webpack_debug'])
	// gulp.watch(source_bg_js, ['bg_scripts_debug'])
	gulp.watch(source_scss, ['styles_debug'])
	gulp.watch(source_fonts, ['fonts_debug'])
	gulp.watch(source_images, ['images_debug'])
})

gulp.task('build-debug', ['webpack_debug', 'styles_debug', 'fonts_debug', 'images_debug'])
gulp.task('watch-debug', ['watch', 'build-debug'])


// RELEASE OPTIONS
gulp.task('webpack-release-opts', function() {
	wp_config.devtool = undefined
	wp_config.plugins = [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true
			}
		}),

		new webpack.optimize.OccurrenceOrderPlugin()
	]
})

gulp.task('styles-release-opts', function() {
	sass_config.style = 'compressed'
})

gulp.task('webpack', ['webpack-release-opts', 'webpack_debug'])
gulp.task('styles', ['styles-release-opts', 'styles_debug'])

gulp.task('build', ['webpack', 'styles', 'fonts_debug', 'images_debug'])
