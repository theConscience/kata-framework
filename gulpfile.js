/* Vars */
var path = require('path'),
  through = require('through2'),
  runSequence = require('run-sequence'),
  merge = require('merge-stream'),
  process = require('process'),
  minimist = require('minimist');

var gulp = require('gulp'),
  livereload = require('gulp-livereload'),
  cssmin = require('gulp-cssmin'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  jsmin = require('gulp-jsmin'),
  concat = require('gulp-concat'),
  autoprefixer = require('gulp-autoprefixer'),
  combineMq = require('gulp-combine-mq'),
  gcmq = require('gulp-group-css-media-queries'),
  cmq = require('gulp-combine-media-queries'),
  gutil = require('gulp-util'),
  tap = require('gulp-tap'),
  gulpIf = require('gulp-if'),
  sourcemaps = require('gulp-sourcemaps'),

  //optional
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),

  stylus = require('gulp-stylus'),
  //preprocess = require('gulp-preprocess'),
  jade = require('gulp-jade');

var getFolders = require('./gulp/getFolders');
var harvestBoundedAssets = require('./gulp/harvestBoundedAssets');
var smartDestRename = require('./gulp/smartDestRename');

var knownOptions = {
  // закомментированные - пока не используются!
  string: [  // строковые консольные флаги
    'development',
    'baseName',
    'subName',
    'pageName',
    'componentName'
  ],
  boolean: [  // булевы консольные флаги
    'dev',  // сборка для разработки - сурсмапы, без комбинации медиа-выражений, без минификации, конкатенация в файл file.ext
    'production',  // сборка для продакшена - без сурсмапов, с комбинации медиа-выражений, с минификацией, конкатенация в файл file.min.ext
    'combineMediaQueries',  // комбинировать медиа-выражения
    'minification',  // минифицировать статику
    'sourceMaps',  // создавать сурсмапы
    'noImages',  // не выполнять таски, связанные с картинками (жрут много времени / памяти)
    'noFonts'  // не выполнять таски, связанные с шрифтами (остаются доступны, если вызывать их напрямую, но не в составе бОльших таск-бандлов)
  ],
  alias: {  // алиасы, т.е. укороченные имена для флагов
    'dev': 'd',
    'production': 'prod',
    'combineMediaQueries': 'cmq',
    'minification': 'min',
    'sourceMaps': 'srcmp',
    'noImages': 'ni',
    'noFonts': 'nf',
    'baseName': 'bn',
    'subName': 'sn',
    'pageName': 'pn',
    'componentName': 'cn'
  },
  default: {  // дефолтные значения флагов
    'dev': false,
    'prod': false,
    'cmq': false,
    'min': false,
    'srcmp': false,
    'ni': false,
    'nf': false,
    'baseName': '',
    'subName': '',
    'pageName': '',
    'componentName': ''
  }
};

var envOptions = minimist(process.argv.slice(2), knownOptions);

if (envOptions.dev && envOptions.prod) {
  envOptions.prod = false;
}

if (envOptions.dev) {
  envOptions.min = false;
  envOptions.srcmp = true;
  envOptions.cmq = false;
}

if (envOptions.prod) {
  envOptions.min = true;
  envOptions.srcmp = false;
  envOptions.cmq = true;
}

console.log('envOptions.dev = ' + envOptions.d);
console.log('envOptions.production = ' + envOptions.prod);
console.log('envOptions.combineMediaQueries = ' + envOptions.cmq);
console.log('envOptions.minification = ' + envOptions.min);
console.log('envOptions.sourceMaps = ' + envOptions.srcmp);
console.log('envOptions.noImages = ' + envOptions.ni);
console.log('envOptions.noFonts = ' + envOptions.nf);
console.log('envOptions.baseName = ' + envOptions.bn);
console.log('envOptions.subName = ' + envOptions.sn);
console.log('envOptions.pageName = ' + envOptions.pn);
console.log('envOptions.componentName = ' + envOptions.cn);


/* Sources */
var src_js = [
    'sources/js/**/*.js',
    '!sources/js/**/jquery-*.min.js',
    '!sources/js/jquery.jscrollpane.min.js',
    '!sources/js/bootstrap.min.js',
    '!sources/js/bowser.js',
    '!sources/js/modernizr-custom.js',
    '!sources/js/jquery.mCustomScrollbar.concat.min.js'
  ],
  src_css = 'sources/css/**/*.css',
  src_stylus = [
    // 'sources/css/variables.styl',
    // 'sources/css/mixins.styl',
    'sources/css/main__basic.styl',
    'sources/css/main__flex.styl',
    'sources/css/main__grid.styl',
    'sources/css/main__misc.styl',
    'sources/css/main__bootstrap_rewrites.styl',
    'sources/css/tours_packet_search.styl'
  ],
  src_all_stylus = 'sources/css/**/*.styl',
  src_html = 'sources/html/**/*.html',
  src_img = 'sources/img/**/*',
  src_ico = 'sources/img/favicon/*.ico',
  src_jade = 'sources/html/**/*.jade',
  src_fonts = 'sources/fonts/**/*',
  src_material = 'node_modules/material-design-lite/material.min.*';


/* Source */
var src_pages = 'source/pages',
  src_bases = 'source/pages/layouts/base',
  src_subs = 'source/pages/layouts/sub',
  src_components = 'source/components';

var src_js_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/scripts/*.js',
    '!source/pages/layouts/**/*'
  ],
  src_js_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/scripts/*.js'
  ],
  src_js_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/scripts/*.js'
  ],
  src_js_components = [
    'source/components/' + (envOptions.componentName || '**') + '/scripts/*.js'
  ];

var getJsPagesSrc = function(folder) {
    return [
      path.join(src_pages, folder, '/scripts/*.js'),
      '!source/pages/layouts/**/*'
    ];
  },
  getJsBasesSrc = function(folder) {
    return [
      path.join(src_bases, folder, '/scripts/*.js')
    ];
  },
  getJsSubsSrc = function(folder) {
    return [
      path.join(src_subs, folder, '/scripts/*.js')
    ];
  },
  getJsComponentsSrc = function(folder) {
    return [
      path.join(src_components, folder, '/scripts/*.js')
    ];
  };

var src_css_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/styles/*.css',
    '!source/pages/layouts/**/*'
  ],
  src_css_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/styles/*.css'
  ],
  src_css_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/styles/*.css'
  ],
  src_css_components = [
    'source/components/' + (envOptions.componentName || '**') + '/styles/*.css'
  ];

var getCssPagesSrc = function(folder) {
    return [
      path.join(src_pages, folder, '/styles/*.css'),
      '!source/pages/layouts/**/*'
    ];
  },
  getCssBasesSrc = function(folder) {
    return [
      path.join(src_bases, folder, '/styles/*.css')
    ];
  },
  getCssSubsSrc = function(folder) {
    return [
      path.join(src_subs, folder, '/styles/*.css')
    ];
  },
  getCssComponentsSrc = function(folder) {
    return [
      path.join(src_components, folder, '/styles/*.css')
    ];
  };

var src_stylus_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/styles/*.styl',
    '!source/pages/layouts/**/*',
    '!source/pages/**/styles/_*.styl'
  ],
  src_stylus_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/styles/*.styl',
    '!source/pages/layouts/base/**/styles/_*.styl'
  ],
  src_stylus_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/styles/*.styl',
    '!source/pages/layouts/sub/**/styles/_*.styl'
  ],
  src_stylus_components = [
    'source/components/' + (envOptions.componentName || '**') + '/styles/*.styl',
    '!source/components/**/styles/_*.styl'
  ];

var getStylusPagesSrc = function(folder) {
    return [
      path.join(src_pages, folder, '/styles/*.styl'),
      '!source/pages/layouts/**/*',
      '!source/pages/**/styles/_*.styl'
    ];
  },
  getStylusBasesSrc = function(folder) {
    return [
      path.join(src_bases, folder, '/styles/*.styl'),
      '!source/pages/layouts/base/**/styles/_*.styl'
    ];
  },
  getStylusSubsSrc = function(folder) {
    return [
      path.join(src_subs, folder, '/styles/*.styl'),
      '!source/pages/layouts/sub/**/styles/_*.styl'
    ];
  },
  getStylusComponentsSrc = function(folder) {
    return [
      path.join(src_components, folder, '/styles/*.styl'),
      '!source/components/**/styles/_*.styl'
    ];
  };

  // console.log('src_stylus_pages =', src_stylus_pages);
  // console.log('src_stylus_bases =', src_stylus_bases);
  // console.log('src_stylus_subs =', src_stylus_subs);
  // console.log('src_stylus_components =', src_stylus_components);

var src_all_stylus_pages = [
    'source/pages/**/styles/*.styl',
    '!source/pages/layouts/**/*'
  ],
  src_all_stylus_bases = 'source/pages/layouts/base/**/styles/*.styl',
  src_all_stylus_subs = 'source/pages/layouts/sub/**/styles/*.styl',
  src_all_stylus_components = 'source/components/**/styles/*.styl';

var src_html_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/html/*.html',
    '!source/pages/layouts/**/*'
  ],
  src_html_bases = 'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/html/*.html',
  src_html_subs = 'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/html/*.html',
  src_html_components = 'source/components/' + (envOptions.componentName || '**') + '/html/*.html';

var src_img_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/images/**/*', //'source/pages/' + (envOptions.pageName || '**') + '/images/**/*',
    '!source/pages/layouts/**/*'
  ],
  src_img_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/images/**/*' //'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/images/**/*'
  ],
  src_img_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/images/**/*' //'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/images/**/*'
  ],
  src_img_components = [
    'source/components/' + (envOptions.componentName || '**') + '/images/**/*' //'source/components/' + (envOptions.componentName || '**') + '/images/**/*'
  ];

// console.log('src_img_pages =', src_img_pages);
// console.log('src_img_bases =', src_img_bases);
// console.log('src_img_subs =', src_img_subs);
// console.log('src_img_components =', src_img_components);

var src_ico_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/images/favicon/*.ico', //'source/pages/' + (envOptions.pageName || '**') + '/images/favicon/*.ico',
    '!source/pages/layouts/**/*'
  ],
  src_ico_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/images/favicon/*.ico' //'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/images/favicon/*.ico'
  ],
  src_ico_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/images/favicon/*.ico' //'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/images/favicon/*.ico'
  ],
  src_ico_components = [
    'source/components/' + (envOptions.componentName || '**') + '/images/favicon/*.ico' //'source/components/' + (envOptions.componentName || '**') + '/images/favicon/*.ico'
  ];

var src_jade_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/*.jade', //'source/pages/' + (envOptions.pageName || '**') + '/*.jade',
    '!source/pages/**/layouts/**/*',  // папка с базовыми лэйаутами
    '!source/pages/**/blocks/**/*',  // папка с блоками jade, используемыми для сборки основного файла
    '!source/pages/**/_*.jade'
  ],
  src_jade_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/*.jade', //'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/*.jade',
    '!source/pages/layouts/base/**/blocks/**/*',
    '!source/pages/layouts/base/**/_*.jade'
  ],
  src_jade_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/*.jade', //'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/*.jade',
    '!source/pages/layouts/sub/**/blocks/**/*',
    '!source/pages/layouts/sub/**/_*.jade'
  ],
  src_jade_components = [
    'source/components/' + (envOptions.componentName || '**') + '/*.jade', //'source/components/' + (envOptions.componentName || '**') + '/*.jade',
    '!source/components/**/blocks/**/*',
    '!source/components/**/_*.jade'
  ];

// console.log('src_jade_pages =', src_jade_pages);
// console.log('src_jade_bases =', src_jade_bases);
// console.log('src_jade_subs =', src_jade_subs);
// console.log('src_jade_components =', src_jade_components);

var src_fonts_pages = [
    'source/pages/' + (envOptions.pageName || '**') + '/fonts/**/*', //'source/pages/' + (envOptions.pageName || '**') + '/fonts/**/*',
    '!source/pages/layouts/**/*'
  ],
  src_fonts_bases = [
    'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/fonts/**/*' //'source/pages/layouts/base/' + (envOptions.baseName || '**') + '/fonts/**/*'
  ],
  src_fonts_subs = [
    'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/fonts/**/*' //'source/pages/layouts/sub/' + (envOptions.subName || '**') + '/fonts/**/*'
  ],
  src_fonts_components = [
    'source/components/' + (envOptions.componentName || '**') + '/fonts/**/*' //'source/components/' + (envOptions.componentName || '**') + '/fonts/**/*'
  ];

// console.log('src_fonts_pages =', src_fonts_pages);
// console.log('src_fonts_bases =', src_fonts_bases);
// console.log('src_fonts_subs =', src_fonts_subs);
// console.log('src_fonts_components =', src_fonts_components);


var src_js_assets = 'source/assets/scripts/**/*.js',
  src_css_assets = 'source/assets/styles/**/!(*\.min).css',
  src_min_css_assets = 'source/assets/styles/**/*.min.css',
  src_img_assets = 'source/assets/images/**/*',
  src_fonts_assets = 'source/assets/fonts/**/*',
  src_css_distrs = 'source/distrs/**/!(*\.min).css',
  src_min_css_distrs = 'source/distrs/**/*.min.css',
  src_js_distrs = 'source/distrs/**/*.js';


/* Destination folder */
var DEST = 'build/';
var dest_html = DEST + ''; // '';


/* Generated Destination folder */
var GENERATED_DEST = 'generated_content/';
var dest_pages = GENERATED_DEST + 'pages';
var dest_bases = GENERATED_DEST + 'base_layouts';
var dest_subs = GENERATED_DEST + 'sub_layouts';
var dest_components = GENERATED_DEST + 'components';
var dest_assets = GENERATED_DEST + 'assets';
var dest_distrs = GENERATED_DEST + 'distrs';


/* Other */
var YOUR_LOCALS = {}; //for jade

var browsers_ver = ['not ie <= 9', 'iOS > 7'];


/* Tasks */
gulp.task('default', ['build', 'watch']);

gulp.task('build', ['buildJs',
  'buildCss',
  'buildStylus',
  'buildHtml',
  'buildJade',
  //'buildFonts',
  'buildImg',
  'buildFavicon',
  'buildMaterial'
]);

gulp.task('buildBases', [
  'buildJsBases',
  'buildCssBases',
  'buildStylusBases',
  'buildHtmlBases',
  'buildJadeBases',
  envOptions.noImages ? 'buildImgDummy' : 'buildImgBases',
  envOptions.noFonts ? 'buildFontsDummy' : 'buildFontsBases'
  //'buildFonts',
  // 'buildFavicon',
  // 'buildMaterial'
]);

gulp.task('buildSubs', [
  'buildJsSubs',
  'buildCssSubs',
  'buildStylusSubs',
  'buildHtmlSubs',
  'buildJadeSubs',
  envOptions.noImages ? 'buildImgDummy' : 'buildImgSubs',
  envOptions.noFonts ? 'buildFontsDummy' : 'buildFontsSubs'
]);

gulp.task('buildPages', [
  'buildJsPages',
  'buildCssPages',
  'buildStylusPages',
  'buildHtmlPages',
  'buildJadePages',
  envOptions.noImages ? 'buildImgDummy' : 'buildImgPages',
  envOptions.noFonts ? 'buildFontsDummy' : 'buildFontsPages'
]);

gulp.task('buildComponents', [
  'buildJsComponents',
  'buildCssComponents',
  'buildStylusComponents',
  'buildHtmlComponents',
  'buildJadeComponents',
  envOptions.noImages ? 'buildImgDummy' : 'buildImgComponents',
  envOptions.noFonts ? 'buildFontsDummy' : 'buildFontsComponents'
]);



gulp.task('buildKata', function(callback) {  // this task doesn't work propertly, need to do it really sequencial for working!
  runSequence(
    'buildBases',
    'buildSubs',
    'buildComponents',
    'buildPages',
    callback
	);

  // return gulp.start(
  //   'buildBases',
  //   'buildSubs',
  //   'buildPages',
  //   'buildComponents'
  // );

  // gulp.start('buildBases');
  // gulp.start('buildSubs');
  // gulp.start('buildPages');
  // gulp.start('buildComponents');

});


gulp.task('buildAssets', [
  'buildAssetsJs',
  'buildAssetsCss',
  'buildAssetsMinCss',
  'buildAssetsFonts',
  'buildAssetsImages',
  'buildAssetsDistrsJs',
  'buildAssetsDistrsCss',
  'buildAssetsDistrsMinCss'
]);



// Watch Files For Changes
gulp.task('watch', function() {
  livereload.listen(); //default web-server

  gulp.watch(src_js, ['reloadJs']);
  gulp.watch(src_css, ['reloadCss']);
  gulp.watch(src_all_stylus, ['reloadStylus']);
  gulp.watch(src_html, ['reloadHtml']);
  gulp.watch(src_jade, ['reloadJade']);
  gulp.watch(src_img, ['reloadImg']);
  gulp.watch(src_fonts, ['reloadFonts']);
});



// Watch Source Files For Changes in Base layouts
gulp.task('watchBases', function() {
  livereload.listen(); //default web-server

  gulp.watch(src_js_bases, ['reloadJsBases']);
  gulp.watch(src_css_bases, ['reloadCssBases']);
  gulp.watch(src_all_stylus_bases, ['reloadStylusBases']);
  gulp.watch(src_html_bases, ['reloadHtmlBases']);
  gulp.watch(src_jade_bases, ['reloadJadeBases']);
  gulp.watch(src_img_bases, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgBases']);
  gulp.watch(src_fonts_bases, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsBases']);
});

// Watch Source Files For Changes in Sub layouts
gulp.task('watchSubs', function() {
  livereload.listen(); //default web-server

  gulp.watch(src_js_subs, ['reloadJsSubs']);
  gulp.watch(src_css_subs, ['reloadCssSubs']);
  gulp.watch(src_all_stylus_subs, ['reloadStylusSubs']);
  gulp.watch(src_html_subs, ['reloadHtmlSubs']);
  gulp.watch(src_jade_subs, ['reloadJadeSubs']);
  gulp.watch(src_img_subs, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgSubs']);
  gulp.watch(src_fonts_subs, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsSubs']);
});

// Watch Source Files For Changes in Pages
gulp.task('watchPages', function() {
  livereload.listen(); //default web-server

  gulp.watch(src_js_pages, ['reloadJsPages']);
  gulp.watch(src_css_pages, ['reloadCssPages']);
  gulp.watch(src_all_stylus_pages, ['reloadStylusPages']);
  gulp.watch(src_html_pages, ['reloadHtmlPages']);
  gulp.watch(src_jade_pages, ['reloadJadePages']);
  gulp.watch(src_img_pages, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgPages']);
  gulp.watch(src_fonts_pages, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsPages']);
});

// Watch Source Files For Changes in Components
gulp.task('watchComponents', function() {
  livereload.listen(); //default web-server

  gulp.watch(src_js_components, ['reloadJsComponents']);
  gulp.watch(src_css_components, ['reloadCssComponents']);
  gulp.watch(src_all_stylus_components, ['reloadStylusComponents']);
  gulp.watch(src_html_components, ['reloadHtmlComponents']);
  gulp.watch(src_jade_components, ['reloadJadeComponents']);
  gulp.watch(src_img_components, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgComponents']);
  gulp.watch(src_fonts_components, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsComponents']);
});



// Watch Source Files For Changes in theKata project
gulp.task('watchKata', function() {
  livereload.listen(); //default web-server

  gulp.watch(src_js_bases, ['reloadJsBases']);
  gulp.watch(src_css_bases, ['reloadCssBases']);
  gulp.watch(src_all_stylus_bases, ['reloadStylusBases']);
  gulp.watch(src_html_bases, ['reloadHtmlBases']);
  gulp.watch(src_jade_bases, ['reloadJadeBases']);
  gulp.watch(src_img_bases, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgBases']);
  gulp.watch(src_fonts_bases, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsBases']);

  gulp.watch(src_js_subs, ['reloadJsSubs']);
  gulp.watch(src_css_subs, ['reloadCssSubs']);
  gulp.watch(src_all_stylus_subs, ['reloadStylusSubs']);
  gulp.watch(src_html_subs, ['reloadHtmlSubs']);
  gulp.watch(src_jade_subs, ['reloadJadeSubs']);
  gulp.watch(src_img_subs, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgSubs']);
  gulp.watch(src_fonts_subs, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsSubs']);

  gulp.watch(src_js_pages, ['reloadJsPages']);
  gulp.watch(src_css_pages, ['reloadCssPages']);
  gulp.watch(src_all_stylus_pages, ['reloadStylusPages']);
  gulp.watch(src_html_pages, ['reloadHtmlPages']);
  gulp.watch(src_jade_pages, ['reloadJadePages']);
  gulp.watch(src_img_pages, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgPages']);
  gulp.watch(src_fonts_pages, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsPages']);

  gulp.watch(src_js_components, ['reloadJsComponents']);
  gulp.watch(src_css_components, ['reloadCssComponents']);
  gulp.watch(src_all_stylus_components, ['reloadStylusComponents']);
  gulp.watch(src_html_components, ['reloadHtmlComponents']);
  gulp.watch(src_jade_components, ['reloadJadeComponents']);
  gulp.watch(src_img_components, [envOptions.noImages ? 'buildImgDummy' : 'reloadImgComponents']);
  gulp.watch(src_fonts_components, [envOptions.noFonts ? 'buildFontsDummy' : 'reloadFontsComponents']);
});



/* -------------------- Dependencies */
//Material
gulp.task('buildMaterial', function() {
  gulp.src(src_material)
    .pipe(gulp.dest(DEST + 'material'))
    .pipe(livereload());
});

//Assets js
gulp.task('buildAssetsJs', function() {
  gulp.src(src_js_assets)
    .pipe(gulp.dest(dest_assets + '/js'))
    .pipe(livereload());
});

//Assets css
gulp.task('buildAssetsCss', function() {
  gulp.src(src_css_assets)
    .pipe(sourcemaps.init())
      .pipe(cssnano())
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest_assets + '/css'))
    .pipe(livereload());
});

//Assets min css
gulp.task('buildAssetsMinCss', function() {
  gulp.src(src_min_css_assets)
    .pipe(gulp.dest(dest_assets + '/css'))
    .pipe(livereload());
});

//Assets fonts
gulp.task('buildAssetsFonts', function() {
  gulp.src(src_fonts_assets)
    .pipe(gulp.dest(dest_assets + '/fonts'))
    .pipe(livereload());
});

//Assets images
gulp.task('buildAssetsImages', function() {
  gulp.src(src_img_assets)
    .pipe(gulp.dest(dest_assets + '/images'))
    .pipe(livereload());
});

//Distrs js
gulp.task('buildAssetsDistrsJs', function() {
  gulp.src(src_js_distrs)
    .pipe(gulp.dest(dest_distrs))
    .pipe(livereload());
});

//Distrs css
gulp.task('buildAssetsDistrsCss', function() {
  gulp.src(src_css_distrs)
    .pipe(sourcemaps.init())
      .pipe(cssnano())
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest_distrs))
    .pipe(livereload());
});

//Distrs min css
gulp.task('buildAssetsDistrsMinCss', function() {
  gulp.src(src_min_css_distrs)
    .pipe(gulp.dest(dest_distrs))
    .pipe(livereload());
});

/* -------------------- JS */
//Reload
gulp.task('reloadJs', function() {
  gulp.src(src_js)
    .pipe(gulpIf(envOptions.min, concat('js.min.js'), concat('js.js')))
    .pipe(gulp.dest(DEST + 'js'))
    .pipe(livereload());
});

//Reload bases
gulp.task('reloadJsBases', function() {
  var folders = envOptions.baseName ? [envOptions.baseName] : getFolders(src_bases);
  console.log('***reloadJsBases*** FOLDERS = getFolders(src_bases) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsBasesSrc(folder))  // src_js_bases
      .pipe(gulpIf(envOptions.min, concat('base_js.min.js'), concat('base_js.js')))
      .pipe(smartDestRename({
        folderType: 'base',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_bases))
      .pipe(livereload());
  });

  return tasks;
});
//Reload subs
gulp.task('reloadJsSubs', function() {
  var folders = envOptions.subName ? [envOptions.subName] : getFolders(src_subs);
  console.log('***reloadJsSubs*** FOLDERS = getFolders(src_subs) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsSubsSrc(folder))  // src_js_subs
      .pipe(gulpIf(envOptions.min, concat('sub_js.min.js'), concat('sub_js.js')))
      .pipe(smartDestRename({
        folderType: 'sub',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_subs))
      .pipe(livereload());
  });

  return tasks;
});
//Reload pages
gulp.task('reloadJsPages', function() {
  var folders = envOptions.pageName ? [envOptions.pageName] : getFolders(src_pages);
  console.log('***reloadJsPages*** FOLDERS = getFolders(src_pages) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsPagesSrc(folder))  // src_js_pages
      .pipe(gulpIf(envOptions.min, concat('page_js.min.js'), concat('page_js.js')))
      .pipe(smartDestRename({
        folderType: 'pages',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_pages))
      .pipe(livereload());
  });

  return tasks;
});
//Reload components
gulp.task('reloadJsComponents', function() {
  var folders = envOptions.componentName ? [envOptions.componentName] : getFolders(src_components);
  console.log('***reloadJsComponents*** FOLDERS = getFolders(src_components) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsComponentsSrc(folder))  // src_js_components
      .pipe(gulpIf(envOptions.min, concat('component_js.min.js'), concat('component_js.js')))
      .pipe(smartDestRename({
        folderType: 'components',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_components))
      .pipe(livereload());
  });

  return tasks;
});



//Build
gulp.task('buildJs', function() {
  gulp.src(src_js)
    // .pipe(jsmin())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    // .pipe(concat('js.min.js'))
    .pipe(gulpIf(envOptions.min, jsmin()))
    .pipe(gulpIf(envOptions.min, rename({
      suffix: '.min'
    })))
    .pipe(gulpIf(envOptions.min, concat('js.min.js'), concat('js.js')))
    .pipe(gulp.dest(DEST + 'js'))
    .pipe(livereload());
});


//Build bases
gulp.task('buildJsBases', function() {
  var folders = envOptions.baseName ? [envOptions.baseName] : getFolders(src_bases);
  console.log('***buildJsBases*** FOLDERS = getFolders(src_bases) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsBasesSrc(folder))  // src_js_bases
      .pipe(gulpIf(envOptions.min, jsmin()))
      .pipe(gulpIf(envOptions.min, rename({
        suffix: '.min'
      })))
      .pipe(gulpIf(envOptions.min, concat('base_js.min.js'), concat('base_js.js')))
      .pipe(smartDestRename({
        folderType: 'base',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_bases))
      .pipe(livereload());
  });

  return tasks;
});

//Build subs
gulp.task('buildJsSubs', function() {
  var folders = envOptions.subName ? [envOptions.subName] : getFolders(src_subs);
  console.log('***buildJsSubs*** FOLDERS = getFolders(src_subs) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsSubsSrc(folder))  // src_js_subs
      .pipe(gulpIf(envOptions.min, jsmin()))
      .pipe(gulpIf(envOptions.min, rename({
        suffix: '.min'
      })))
      .pipe(gulpIf(envOptions.min, concat('sub_js.min.js'), concat('sub_js.js')))
      .pipe(smartDestRename({
        folderType: 'sub',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_subs))
      .pipe(livereload());
  });

  return tasks;
});

//Build pages
gulp.task('buildJsPages', function() {
  var folders = envOptions.pageName ? [envOptions.pageName] : getFolders(src_pages);
  console.log('***buildJsPages*** FOLDERS = getFolders(src_pages) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsPagesSrc(folder))  // src_js_pages
      .pipe(gulpIf(envOptions.min, jsmin()))
      .pipe(gulpIf(envOptions.min, rename({
        suffix: '.min'
      })))
      .pipe(gulpIf(envOptions.min, concat('page_js.min.js'), concat('page_js.js')))
      .pipe(smartDestRename({
        folderType: 'pages',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_pages))
      .pipe(livereload());
  });

  return tasks;
});

//Build components
gulp.task('buildJsComponents', function() {
  var folders = envOptions.componentName ? [envOptions.componentName] : getFolders(src_components);
  console.log('***buildJsComponents*** FOLDERS = getFolders(src_components) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getJsComponentsSrc(folder))  // src_js_components
      .pipe(gulpIf(envOptions.min, jsmin()))
      .pipe(gulpIf(envOptions.min, rename({
        suffix: '.min'
      })))
      .pipe(gulpIf(envOptions.min, concat('component_js.min.js'), concat('component_js.js')))
      .pipe(smartDestRename({
        folderType: 'components',
        destination: '/js'
      }))
      .pipe(gulp.dest(dest_components))
      .pipe(livereload());
  });

  return tasks;
});



/* -------------------- CSS */
//Reload
gulp.task('reloadCss', function() {
  gulp.src(src_css)
    .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.init()))
      .pipe(gulpIf(envOptions.min, concat('css.min.css'), concat('css.css')))
    .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.write('.')))
    .pipe(gulp.dest(DEST + 'css'))
    .pipe(livereload());
});

//Reload bases
gulp.task('reloadCssBases', function() {
  var folders = envOptions.baseName ? [envOptions.baseName] : getFolders(src_bases);
  console.log('***reloadCssBases*** FOLDERS = getFolders(src_bases) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssBasesSrc(folder))  // src_css_bases
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.init()))
        .pipe(gulpIf(envOptions.min, concat('base_css.min.css'), concat('base_css.css')))
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'base',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_bases))
      .pipe(livereload());
  });

  return tasks;
});
//Reload subs
gulp.task('reloadCssSubs', function() {
  var folders = envOptions.subName ? [envOptions.subName] : getFolders(src_subs);
  console.log('***reloadCssSubs*** FOLDERS = getFolders(src_subs) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssSubsSrc(folder))  // src_css_subs
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.init()))
        .pipe(gulpIf(envOptions.min, concat('sub_css.min.css'), concat('sub_css.css')))
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'sub',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_subs))
      .pipe(livereload());
  });

  return tasks;
});
//Reload pages
gulp.task('reloadCssPages', function() {
  var folders = envOptions.pageName ? [envOptions.pageName] : getFolders(src_pages);
  console.log('***reloadCssPages*** FOLDERS = getFolders(src_pages) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssPagesSrc(folder))  // src_css_pages
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.init()))
        .pipe(gulpIf(envOptions.min, concat('page_css.min.css'), concat('page_css.css')))
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'pages',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_pages))
      .pipe(livereload());
  });

  return tasks;
});
//Reload components
gulp.task('reloadCssComponents', function() {
  var folders = envOptions.componentName ? [envOptions.componentName] : getFolders(src_components);
  console.log('***reloadCssComponents*** FOLDERS = getFolders(src_components) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssComponentsSrc(folder))  // src_css_components
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.init()))
        .pipe(gulpIf(envOptions.min, concat('component_css.min.css'), concat('component_css.css')))
      .pipe(gulpIf(envOptions.srcmp && envOptions.min, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'components',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_components))
      .pipe(livereload());
  });

  return tasks;
});


//Build
gulp.task('buildCss', function() {
  gulp.src(src_css)
    .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
      .pipe(autoprefixer({
        browsers: browsers_ver,
        cascade: false
      }))
      // .pipe(cssmin())
      // .pipe(concat('css.min.css'))
      .pipe(gulpIf(envOptions.min, cssmin()))
      .pipe(gulpIf(envOptions.min, concat('css.min.css'), concat('css.css')))
    .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
    .pipe(gulp.dest(DEST + 'css'))
    .pipe(livereload());
});


//Build bases
gulp.task('buildCssBases', function() {
  var folders = envOptions.baseName ? [envOptions.baseName] : getFolders(src_bases);
  console.log('***buildCssBases*** FOLDERS = getFolders(src_bases) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssBasesSrc(folder))  // src_css_bases
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssmin()))
        .pipe(gulpIf(envOptions.min, concat('base_css.min.css'), concat('base_css.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'base',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_bases))
      .pipe(livereload());
  });

  return tasks;
});

//Build subs
gulp.task('buildCssSubs', function() {
  var folders = envOptions.subName ? [envOptions.subName] : getFolders(src_subs);
  console.log('***buildCssSubs*** FOLDERS = getFolders(src_subs) ===', folders);


  var tasks = folders.map(function(folder) {
    return gulp.src(getCssSubsSrc(folder))  // src_css_subs
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssmin()))
        .pipe(gulpIf(envOptions.min, concat('sub_css.min.css'), concat('sub_css.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'sub',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_subs))
      .pipe(livereload());
  });

  return tasks;
});

//Build pages
gulp.task('buildCssPages', function() {
  var folders = envOptions.pageName ? [envOptions.pageName] : getFolders(src_pages);
  console.log('***buildCssPages*** FOLDERS = getFolders(src_pages) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssPagesSrc(folder))  // src_css_pages
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssmin()))
        .pipe(gulpIf(envOptions.min, concat('page_css.min.css'), concat('page_css.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'pages',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_pages))
      .pipe(livereload());
  });

  return tasks;
});

//Build components
gulp.task('buildCssComponents', function() {
  var folders = envOptions.componentName ? [envOptions.componentName] : getFolders(src_components);
  console.log('***buildCssComponents*** FOLDERS = getFolders(src_components) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getCssComponentsSrc(folder))  // src_css_components
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssmin()))
        .pipe(gulpIf(envOptions.min, concat('component_css.min.css'), concat('component_css.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        folderType: 'components',
        destination: '/css'
      }))
      .pipe(gulp.dest(dest_pages))
      .pipe(livereload());
  });

  return tasks;
});




/* -------------------- Stylus */
//Reload
gulp.task('reloadStylus', ['buildStylus']);

//Reload bases
gulp.task('reloadStylusBases', ['buildStylusBases']);
//Reload subs
gulp.task('reloadStylusSubs', ['buildStylusSubs']);
//Reload pages
gulp.task('reloadStylusPages', ['buildStylusPages']);
//Reload components
gulp.task('reloadStylusComponents', ['buildStylusComponents']);

//Build
gulp.task('buildStylus', function() {
  gulp.src(src_stylus)
    .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
      .pipe(stylus())
      .pipe(autoprefixer({
        browsers: browsers_ver,
        cascade: false
      }))
      // .pipe(gulpIf(envOptions.dev, combineMq({  //не работает с sourcemaps
      //   beautify: true
      // })))
      .pipe(gulpIf(envOptions.min, cssnano()))
      .pipe(gulpIf(envOptions.min, concat('style.min.css'), concat('style.css')))
      // .pipe(cssnano())
      // .pipe(concat('style.min.css'))
    .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
    .pipe(gulp.dest(DEST + 'css'))
    .pipe(livereload());
});


//Build bases
gulp.task('buildStylusBases', function() {
  var folders = envOptions.baseName ? [envOptions.baseName] : getFolders(src_bases);
  console.log('***buildStylusBases*** FOLDERS = getFolders(src_bases) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getStylusBasesSrc(folder))  // src_stylus_bases
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(stylus())
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssnano()))
        // .pipe(smartDestRename({
        //   folder: '/css',
        //   folderType: 'base'
        // }))
        .pipe(gulpIf(envOptions.min, concat('base_style.min.css'), concat('base_style.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        destination: '/css',
        folderType: 'base'
      }))
      .pipe(gulp.dest(dest_bases))
      .pipe(livereload());
  });

  return tasks;  // return merge(tasks, root_tasks)
});

//Build subs
gulp.task('buildStylusSubs', function() {
  var folders = envOptions.subName ? [envOptions.subName] : getFolders(src_subs);
  console.log('***buildStylusSubs*** FOLDERS = getFolders(src_subs) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getStylusSubsSrc(folder))  // src_stylus_subs
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(stylus())
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssnano()))
        .pipe(gulpIf(envOptions.min, concat('sub_style.min.css'), concat('sub_style.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        destination: '/css',
        folderType: 'sub'
      }))
      .pipe(gulp.dest(dest_subs))
      .pipe(livereload());
  });

  return tasks;
});

//Build pages
gulp.task('buildStylusPages', function() {
  var folders = envOptions.pageName ? [envOptions.pageName] : getFolders(src_pages);
  console.log('***buildStylusPages*** FOLDERS = getFolders(src_pages) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getStylusPagesSrc(folder))  // src_stylus_pages
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(stylus())
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssnano()))
        .pipe(gulpIf(envOptions.min, concat('page_style.min.css'), concat('page_style.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        destination: '/css',
        folderType: 'pages'
      }))
      .pipe(gulp.dest(dest_pages))
      .pipe(livereload());
  });

  return tasks;
});

//Build components
gulp.task('buildStylusComponents', function() {
  var folders = envOptions.componentName ? [envOptions.componentName] : getFolders(src_components);
  console.log('***buildStylusComponents*** FOLDERS = getFolders(src_components) ===', folders);

  var tasks = folders.map(function(folder) {
    return gulp.src(getStylusComponentsSrc(folder))  // src_stylus_components
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.init()))
        .pipe(stylus())
        .pipe(autoprefixer({
          browsers: browsers_ver,
          cascade: false
        }))
        .pipe(gulpIf(envOptions.cmq, combineMq({  //не работает с sourcemaps
          beautify: true
        })))
        .pipe(gulpIf(envOptions.min, cssnano()))
        .pipe(gulpIf(envOptions.min, concat('component_style.min.css'), concat('component_style.css')))
      .pipe(gulpIf(envOptions.srcmp, sourcemaps.write('.')))
      .pipe(smartDestRename({
        destination: '/css',
        folderType: 'components'
      }))
      .pipe(gulp.dest(dest_components))
      .pipe(livereload());
  });

  return tasks;
});




/* -------------------- Html */
//Reload
gulp.task('reloadHtml', function() {
  gulp.src(src_html)
    .pipe(gulp.dest(dest_html))
    .pipe(livereload());
});


//Reload bases
gulp.task('reloadHtmlBases', function() {
  gulp.src(src_html_bases)
    .pipe(smartDestRename({
      folderType: 'base',
      folder: '/html'
    }))
    .pipe(gulp.dest(
      !envOptions.baseName ? dest_bases : dest_bases + '/' + envOptions.baseName + '/html'
    ))
    .pipe(livereload());
});

//Reload subs
gulp.task('reloadHtmlSubs', function() {
  gulp.src(src_html_subs)
    .pipe(smartDestRename({
      folderType: 'sub',
      destination: '/html'
    }))
    .pipe(gulp.dest(
      !envOptions.subName ? dest_subs : dest_subs + '/' + envOptions.subName + '/html'
    ))
    .pipe(livereload());
});

//Reload pages
gulp.task('reloadHtmlPages', function() {
  gulp.src(src_html_pages)
    .pipe(smartDestRename({
      folderType: 'pages',
      destination: '/html'
    }))
    .pipe(gulp.dest(
      !envOptions.pageName ? dest_pages : dest_pages + '/' + envOptions.pageName + '/html'
    ))
    .pipe(livereload());
});

//Reload components
gulp.task('reloadHtmlComponents', function() {
  gulp.src(src_html_components)
    .pipe(smartDestRename({
      folderType: 'components',
      destination: '/html'
    }))
    .pipe(gulp.dest(
      !envOptions.componentName ? dest_components : dest_components + '/' + envOptions.componentName + '/html'
    ))
    .pipe(livereload());
});


//Build
gulp.task('buildHtml', ['reloadHtml']);
//see jade

//Build bases
gulp.task('buildHtmlBases', ['reloadHtmlBases']);

//Build subs
gulp.task('buildHtmlSubs', ['reloadHtmlSubs']);

//Build pages
gulp.task('buildHtmlPages', ['reloadHtmlPages']);

//Build components
gulp.task('buildHtmlComponents', ['reloadHtmlComponents']);


//see jade




/* -------------------- Jade */
//Reload
gulp.task('reloadJade', function() {
  gulp.src(src_jade)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(dest_html))
    .pipe(livereload());
});

//Reload bases
gulp.task('reloadJadeBases', function() {
  gulp.src(src_jade_bases)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.baseName ? dest_bases : dest_bases + '/' + envOptions.baseName
    ))
    .pipe(livereload());
});
//Reload subs
gulp.task('reloadJadeSubs', function() {
  gulp.src(src_jade_subs)
    // .pipe(harvestBoundedAssets({
    //   dest: dest_subs
    // }))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.subName ? dest_subs : dest_subs + '/' + envOptions.subName
    ))
    .pipe(livereload());
});
//Reload pages
gulp.task('reloadJadePages', function() {
  gulp.src(src_jade_pages)
    .pipe(harvestBoundedAssets({
      dest: dest_pages
    }))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.pageName ? dest_pages : dest_pages + '/' + envOptions.pageName
    ))
    .pipe(livereload());
});
//Reload components
gulp.task('reloadJadeComponents', function() {
  gulp.src(src_jade_components)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.componentName ? dest_components : dest_components + '/' + envOptions.componentName
    ))
    .pipe(livereload());
});



//Build
gulp.task('buildJade', function() {
  gulp.src(src_jade)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest(dest_html))
    .pipe(livereload());
});


//Build bases
gulp.task('buildJadeBases', function() {
  gulp.src(src_jade_bases)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.baseName ? dest_bases : dest_bases + '/' + envOptions.baseName
    ))
    .pipe(livereload());
});

//Build subs
gulp.task('buildJadeSubs', function() {
  gulp.src(src_jade_subs)
    // .pipe(harvestBoundedAssets({
    //   dest: dest_subs
    // }))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.subName ? dest_subs : dest_subs + '/' + envOptions.subName
    ))
    .pipe(livereload());
});

//Build pages
gulp.task('buildJadePages', function() {
  gulp.src(src_jade_pages)
    .pipe(harvestBoundedAssets({
      dest: dest_pages
    }))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.pageName ? dest_pages : dest_pages + '/' + envOptions.pageName
    ))
    .pipe(livereload());
});

//Build components
gulp.task('buildJadeComponents', function() {
  gulp.src(src_jade_components)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(
      !envOptions.componentName ? dest_components : dest_components + '/' + envOptions.componentName
    ))
    .pipe(livereload());
});




/* -------------------- Images */
//Reload
gulp.task('reloadImg', ['buildImg']);

//Reload bases
gulp.task('reloadImgBases', ['buildImgBases']);
//Reload subs
gulp.task('reloadImgSubs', ['buildImgSubs']);
//Reload pages
gulp.task('reloadImgPages', ['buildImgPages']);
//Reload components
gulp.task('reloadImgComponents', ['buildImgComponents']);


//Build
gulp.task('buildImg', function() {
  gulp.src(src_img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(DEST + 'img'))
    .pipe(livereload());
});


//Build bases
gulp.task('buildImgBases', function() {
  gulp.src(src_img_bases)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(smartDestRename({
      folderType: 'base',
      destination: '/images'
    }))
    .pipe(gulp.dest(
      !envOptions.baseName ? dest_bases : dest_bases + '/' + envOptions.baseName + '/images'
    ))
    .pipe(livereload());
});

//Build subs
gulp.task('buildImgSubs', function() {
  gulp.src(src_img_subs)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(smartDestRename({
      folderType: 'sub',
      destination: '/images'
    }))
    .pipe(gulp.dest(
      !envOptions.subName ? dest_subs : dest_subs + '/' + envOptions.subName + '/images'
    ))
    .pipe(livereload());
});

//Build pages
gulp.task('buildImgPages', function() {
  gulp.src(src_img_pages)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(smartDestRename({
      folderType: 'pages',
      destination: '/images'
    }))
    .pipe(gulp.dest(
      !envOptions.pageName ? dest_pages : dest_pages + '/' + envOptions.pageName + '/images'
    ))
    .pipe(livereload());
});

//Build components
gulp.task('buildImgComponents', function() {
  gulp.src(src_img_components)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(smartDestRename({
      folderType: 'components',
      destination: '/images'
    }))
    .pipe(gulp.dest(
      !envOptions.componentName ? dest_components : dest_components + '/' + envOptions.componentName + '/images'
    ))
    .pipe(livereload());
});

// dummy image task
gulp.task('buildImgDummy', function() {
  if (envOptions.noImages) {
    gutil.log('   buildImgDummy task warning:', gutil.colors.bold.yellow('envOptions.noImages is enabled(' + envOptions.noImages + '), image tasks disabled.'));
  } else {
    gutil.log('   buildImgDummy task warning:', gutil.colors.bold.red('envOptions.noImages is disabled(' + envOptions.noImages + '), this task should not be started (check your gulpfile.js for logic errors).'));
  }
});



//Build
gulp.task('buildFavicon', function() {
  gulp.src(src_ico)
    .pipe(gulp.dest(dest_html))
    .pipe(livereload());
});




/* -------------------- Fonts */
//Reload
gulp.task('reloadFonts', ['buildFonts']);

//Reload bases
gulp.task('reloadFontsBases', ['buildFontsBases']);
//Reload subs
gulp.task('reloadFontsSubs', ['buildFontsSubs']);
//Reload pages
gulp.task('reloadFontsPages', ['buildFontsPages']);
//Reload components
gulp.task('reloadFontsComponents', ['buildFontsComponents']);


//Build
gulp.task('buildFonts', function() {
  gulp.src(src_fonts)
    .pipe(gulp.dest(DEST + 'fonts'))
    .pipe(livereload());
});


//Build bases
gulp.task('buildFontsBases', function() {
  gulp.src(src_fonts_bases)
    .pipe(smartDestRename({
      folderType: 'base',
      destination: '/fonts'
    }))
    .pipe(gulp.dest(
      !envOptions.baseName ? dest_bases : dest_bases + '/' + envOptions.baseName + '/fonts'
    ))
    .pipe(livereload());
});

//Build subs
gulp.task('buildFontsSubs', function() {
  gulp.src(src_fonts_subs)
    .pipe(smartDestRename({
      folderType: 'sub',
      destination: '/fonts'
    }))
    .pipe(gulp.dest(
      !envOptions.subName ? dest_subs : dest_subs + '/' + envOptions.subName + '/fonts'
    ))
    .pipe(livereload());
});

//Build pages
gulp.task('buildFontsPages', function() {
  gulp.src(src_fonts_pages)
    .pipe(smartDestRename({
      folderType: 'pages',
      destination: '/fonts'
    }))
    .pipe(gulp.dest(
      !envOptions.pageName ? dest_pages : dest_pages + '/' + envOptions.pageName + '/fonts'
    ))
    .pipe(livereload());
});

//Build components
gulp.task('buildFontsComponents', function() {
  gulp.src(src_fonts_components)
    .pipe(smartDestRename({
      folderType: 'components',
      destination: '/fonts'
    }))
    .pipe(gulp.dest(
      !envOptions.componentName ? dest_components : dest_components + '/' + envOptions.componentName + '/fonts'
    ))
    .pipe(livereload());
});

// dummy fonts task
gulp.task('buildFontsDummy', function() {
  if (envOptions.noFonts) {
    gutil.log('   buildFontsDummy task warning:', gutil.colors.bold.yellow('envOptions.noFonts is enabled(' + envOptions.noFonts + '), fonts tasks disabled.'));
  } else {
    gutil.log('   buildFontsDummy task warning:', gutil.colors.bold.red('envOptions.noFonts is disabled(' + envOptions.noFonts + '), this task should not be started (check your gulpfile.js for logic errors).'));
  }
});



/* -------------------- Other */
//Gulp-preprocess example
/*
 gulp.task('test-preprocess', function () {
 gulp.src('test.css')
 .pipe(preprocess({context: {RELEASE_TAG: 'here goes our replace'}}))
 .pipe(rename({suffix: '.b'}))
 .pipe(gulp.dest(''));
 });*/
