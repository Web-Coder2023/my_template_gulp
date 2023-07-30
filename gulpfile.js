const { src, dest, watch, parallel, series }  = require('gulp');

const scss           = require('gulp-sass')(require('sass'));
const concat         = require('gulp-concat');
const browserSync    = require('browser-sync').create();
const uglify         = require('gulp-uglify-es').default;
const autoprefixer   = require('gulp-autoprefixer');
const imagemin       = require('gulp-imagemin');
const del            = require('del');
const include        = require('gulp-include');

function pages() {
  return src('app/pages/*.html')
  .pipe(include({
     includePaths: 'app/blocks'
  }))
  .pipe(dest('app'))
  .pipe(browserSync.stream())
}

function browsersync() {
  browserSync.init({
    server : {
      baseDir: 'app/'
    }
  });
}

function cleanDist() {
  return del('dist')
}

function images() {
  return src('app/images/**/*')
    .pipe(imagemin(
      [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]
    ))
    .pipe(dest('dist/images'))
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/swiper/swiper-bundle.js', // Добавьте эту строку
    'app/js/script.js'
  ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}




function styles() {
  return src([
    'node_modules/bootstrap/scss/bootstrap.scss',
    'node_modules/swiper/swiper.scss', // Добавьте эту строку
    'app/scss/style.scss'
  ])
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}



function building() {
  return src([
    'app/css/style.min.css',
    'app/fonts',
    'app/js/script.min.js',
    'app/*.html',
    '!app/blocks/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'))
}

function watching() {
  browserSync.init({
     server: {
         baseDir: "app/"
     }
 });
  watch(['app/scss/**/*.scss'], styles)
  watch(['app/img/src'], images)
  watch(['app/js/script.js'], scripts)
  watch(['app/blocks/*', 'app/pages/*'], pages)
  watch(['app/**/*.html']).on('change', browserSync.reload);

}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.pages = pages;
exports.images = images;
exports.cleanDist = cleanDist;

const build = series(cleanDist, building)
exports.default = parallel(styles, images, build, scripts, pages, watching);
