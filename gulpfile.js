const gulp			= require("gulp");
const { 
		src,
		dest,
		parallel,
		series
	} 				= require('gulp');
const pug 			= require('gulp-pug');
const sass 			= require('gulp-sass');
//const concat 		= require('gulp-concat');
const del 			= require('del');
const gulpif 		= require('gulp-if');
const sourcemaps	= require('gulp-sourcemaps');
const postcss 		= require('gulp-postcss');
const autoprefixer 	= require('autoprefixer');
const cssnano 		= require('gulp-cssnano');
const webpack 		= require('webpack-stream');
const bs 			= require('browser-sync').create();
const svgSprite 	= require('gulp-svg-sprite');
const path			= require('path');

const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const PATHS = {
	src: path.join(__dirname, "./src"),
	dist: path.join(__dirname, "../dist")
};

let webConfig = {
	externals: {
		paths: PATHS
	},
	entry: {
		'AdminIndex' : `${PATHS.src}/assets/src/js/Desktop/AdminIndex.js`,
		'Desktop' : `${PATHS.src}/screens/Desktop/index.js`,
		'TerminalAdmin' : `${PATHS.src}/screens/TerminalAdmin/index.js`,
		'TerminalClient' : `${PATHS.src}/screens/TerminalClient/index.js`,
	},
	output: {
		//filename: '[name]/index.js',
		filename: '[name].js',
		path: PATHS.dist,
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: "/node_modules/"
			},
		]
	},
	mode: isDevMode ? 'development' : 'production',
	devtool: isDevMode ? 'eval-source-map' : 'none'
};



const paths = {
	styles: {
		watchsrc: ['src/components/**/*.scss', 'src/screens/**/*.scss'],
		source: ['src/screens/**/*.scss'],
		srccompiled: 'src/assets/compiled/css/',
		destination: 'dist/'
	},
	scripts: {
		watchsrc: 'src/**/*.js',
		source: 'src/screens/**/*.js',
		destination: 'dist/'
	},
	html: {
		source: [
			'src/screens/**/*.pug',
		],
		watchsrc: ['src/screens/**/*.pug', 'src/components/**/*.pug'],
		destination: 'dist/'
	},
	// svg: {
	// 	source: 'src/assets/src/images/svg/**/*.svg',
	// 	compiled: 'src/assets/compiled/images/',
	// 	destination: 'dist/assets/images/'
	// },
	svg: {
		desktop_src: 'src/assets/src/svg/Desktop/*.svg',
		terminal_src: 'src/assets/src/svg/Terminal/*.svg',
		compiled: 'src/assets/compiled/svg/',
		destination: 'dist/assets/images/'
	},
	images: {
		source: [
			'src/assets/src/images/**/*', 
			//'!src/assets/src/images/svg/Desktop',
			//'!src/assets/src/images/svg/Terminal',
			//'!src/assets/src/images/svg',
			'!src/assets/src/images/**/*.svg',
			
		],
		destination: 'dist/assets/images/'
	},
	fonts: {
		source: 'src/assets/src/fonts/**/*',
		destination: 'dist/assets/fonts/'
	}
};

// BrowserSync
function browserSync(done) {
	bs.init({
		server: {
			baseDir: "./dist"
		},
		port: 3000,
		watchOptions: {
			awaitWriteFinish : true
		}
	});
	done();
}
// BrowserSync reload
function browserSyncReload(done) {
	//bs.reload();
	bs.stream({once: true})
	done();
} 

function clean() {
	return del(['dist/**', 'src/assets/compiled/**']);
}

function buildCss() {
	var plugins = [
		autoprefixer({ grid: 'autoplace' }),
	];

	return src(paths.styles.source, {"base" : "./src/screens/"})
		.pipe(gulpif(isDevMode, sourcemaps.init()))
		.pipe(sass())
		.pipe(postcss(plugins))
		.pipe(dest(paths.styles.srccompiled))
		.pipe(cssnano())
		.pipe(gulpif(isDevMode, sourcemaps.write('.')))
		.pipe(dest(paths.styles.destination))
		.pipe(bs.stream({once: true}));
}
function buildJs() { // build js with webpack
	return src(paths.scripts.source, {"base" : "./src/screens/"})
	//.pipe(webpack(webConfig))
	.pipe(dest(paths.scripts.destination, { sourcemaps: true }))
	.pipe(bs.stream({once: true}));
}

function copyImages() {
	return gulp.src(paths.images.source)
	  .pipe(gulp.dest(paths.images.destination))
	  .pipe(bs.stream({once: true}));
}

// function createSvgSprite1() { //options are here https://github.com/jkphl/svg-sprite
// 	const config = {
// 		shape: {
// 			id: { // SVG shape ID related options
// 				separator: '',
// 				//generator: function() { /*...*/ }, // SVG shape ID generator callback
// 			}
// 		},
// 		mode: {
// 			stack: {
// 				sprite: "../sprite.svg"
// 			}
// 		},
// 		svg: { // General options for created SVG files
// 			//xmlDeclaration: true, // Add XML declaration to SVG sprite
// 			//doctypeDeclaration: true, // Add DOCTYPE declaration to SVG sprite
// 			//namespaceIDs: false, // Add namespace token to all IDs in SVG shapes
// 			//namespaceIDs: false,
//         	//namespaceClassnames: false,
// 			//namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
// 			//namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
// 			//dimensionAttributes: true // Width and height attributes on the sprite
// 		},
// 	};
//     //return gulp.src(paths.svg.source, {"base" : "./src/assets/src/images/svg/"})
//     return gulp.src(paths.svg.source)
// 		.pipe(svgSprite(config))
// 		.on('error', function(error) {
// 			console.log(error)
// 		})
//         .pipe(gulp.dest(paths.svg.compiled)) //copy to src folder to include in pug template
//         .pipe(gulp.dest(paths.svg.destination));
// }
const createSvgDesktop = () => {
	const configDesktop = {
		shape: { id: { separator: '', } },
		mode: { stack: { sprite: "../desktop_sprite.svg" } }
	};
	return gulp.src(paths.svg.desktop_src)
	.pipe(svgSprite(configDesktop))
	.on('error', function(error) {
		console.log(error)
	})
	.pipe(gulp.dest(paths.svg.compiled)) //copy to src folder to include in pug template
	.pipe(gulp.dest(paths.svg.destination));
}
const createSvgTerminal = () => {
	const configTerminal = {
		shape: { id: { separator: '', } },
		mode: { stack: { sprite: "../terminal_sprite.svg" } }
	};
	
	return gulp.src(paths.svg.terminal_src)
		.pipe(svgSprite(configTerminal))
		.on('error', function(error) {
			console.log(error)
		})
		.pipe(gulp.dest(paths.svg.compiled)) //copy to src folder to include in pug template
		.pipe(gulp.dest(paths.svg.destination));
}


function copyFonts() {
	return gulp.src(paths.fonts.source)
	  .pipe(gulp.dest(paths.fonts.destination))
}

function copyJsAssets() {
	return gulp.src('src/assets/src/js/**/*')
	  .pipe(gulp.dest('dist/assets/js/'))
}
  
function buildHtml() {
	return src(paths.html.source)
		.pipe(pug({
		pretty: true
		}))
		.pipe(dest(paths.html.destination))
		.pipe(bs.stream({once: true}));
}
function watch() {
	gulp.watch(paths.styles.watchsrc, buildCss);
	gulp.watch(paths.html.watchsrc, buildHtml);
	gulp.watch(paths.images.source, copyImages);
	gulp.watch('src/assets/src/js/**/*', copyJsAssets);

	gulp.watch(paths.scripts.watchsrc, buildJs);
	gulp.watch(paths.html.destination, browserSyncReload);
}

exports.buildCss 		= buildCss;
exports.buildHtml 		= buildHtml;
exports.copyImages 		= copyImages;

const createSvgSprite	= series(createSvgDesktop, createSvgTerminal);
exports.createSvgSprite = createSvgSprite;


exports.createSvgDesktop	= createSvgDesktop;
exports.createSvgTerminal	= createSvgTerminal;

exports.copyFonts 		= copyFonts;
exports.copyJsAssets	= copyJsAssets;
exports.buildJs 		= buildJs;
exports.clean 			= clean;
exports.watch 			= watch;
const build 			= series(clean, createSvgSprite, parallel(copyImages, copyFonts, copyJsAssets, buildHtml, buildCss, buildJs));
exports.build 			= build;
exports.default 		= series(build, parallel(watch, browserSync));
