// importing all the depend.....s
const { src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const bable = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync');
const browser = require('browser-sync').create();

//Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

//JavaScript Task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true})
        .pipe(bable({presets: ['@babel/preset-env'] }))
        .pipe(terser())
        .pipe(dest('dist', {sourcemaps: '.'}));
}

//Browersync setup
function browserSyncServer(cb) {
    browserSync.init({
        server: {
            baseDir: '.',
        },
        notify : {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}

//relod the browser with browserSync
function browserSyncRelod(cb) {
    browserSync.reload();
    cb();
}

// telling bulp these file with this  watchTsak() function.
function watchTask() {
    watch('*.html', browserSyncRelod);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncRelod)
    );
}

// Defualt Gulp Task
exports.defualt = series(scssTask, jsTask, browserSyncServer, watchTask);
