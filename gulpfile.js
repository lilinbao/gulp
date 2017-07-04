//npm install less-plugin-autoprefix gulp-rev less-plugin-clean-css gulp-util gulp-less gulp-sourcemaps gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-cache del --save-dev
var setting = {
    isProduction : true,
    sourceMap : false
}

var path = {
    src : {
        base : 'app',
        css  : 'app/css/style.less',
        img  : 'app/image/*.*',
        js   : 'app/js/*.js'
    },
    dist : {
        base : '.',
        css  : './css',
        img  : './image',
        js   : './js'
    },
    ext : {
        base : './bower_components',
        jquery : './bower_components/jquery/jquery.min.js',
        bootstrap : './app/css/bootstrap.less'
    }
}

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    less = require('gulp-less'),
    autoprefixer = require('less-plugin-autoprefix'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del'),
    gutil = require('gulp-util'),
    reversion = require('gulp-rev'),
    lessMinifier = require('less-plugin-clean-css')
    autoprefix = new autoprefixer({browsers: ["last 10 versions"]}),
    minifyCss = new lessMinifier({advanced: true});

if(gutil.env.dev === true) {
    setting.sourceMap = true;
    setting.isProduction = false;
    gutil.log('running on DEV mode');
}else{
    gutil.log('running on release mode');
}

// Styles
gulp.task('styles', function () {
    var lessPlugins = new Array();
    lessPlugins.push(autoprefix) ;
    if(setting.isProduction){
        lessPlugins.push(minifyCss);
    }
    return gulp.src(path.src.css)
        .pipe(setting.isProduction ? gutil.noop() : sourcemaps.init())
        .pipe(less({plugins: lessPlugins}))
        .pipe(setting.isProduction ? gutil.noop() : sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.dist.css))
        .pipe(notify('Less compiled'));
});
gulp.task('bootstrap', function () {
    var lessPlugins = new Array();
    lessPlugins.push(autoprefix) ;
    if(setting.isProduction){
        lessPlugins.push(minifyCss);
    }
    return gulp.src(path.ext.bootstrap)
        .pipe(setting.isProduction ? gutil.noop() : sourcemaps.init())
        .pipe(less({plugins: lessPlugins}))
        .pipe(setting.isProduction ? gutil.noop() : sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.dist.css))
        .pipe(notify('Less compiled'));
});
// Scripts
gulp.task('scripts', function() {
  return gulp.src(path.src.js)
    .pipe(jshint({
        'strict': true,
        'undef': true,
        'unused': true,
        'browser': true,
        'devel': false
    }))
    .pipe(setting.isProduction ? gutil.noop() : sourcemaps.init())
    .pipe(jshint.reporter('default'))
    .pipe(concat(path.dist.js + '/script.js'))
    .pipe(setting.isProduction ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(!setting.isProduction ? gutil.noop() : uglify())
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Scripts tasks completed' }));
});

// Images
gulp.task('images', function() {
  return gulp.src(path.src.img)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(path.dist.img))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del([path.dist.js, path.dist.css, path.dist.img]);
});

// Versioning 
gulp.task('reversion', function () {
    // by default, gulp would pick `assets/css` as the base, 
    // so we need to set it explicitly: 
    return gulp.src([path.dist.css + '/*.css', path.dist.js + '/*.js'], {base: './'})
        .pipe(gulp.dest('.'))  // copy original assets to build dir 
        .pipe(reversion())
        .pipe(gulp.dest('.'))  // write rev'd assets to build dir 
        .pipe(reversion.manifest())
        .pipe(gulp.dest('.')); // write manifest to build dir 
});

// Default task
gulp.task('default', ['clean'], function() {
    if(setting.isProduction)
        gulp.start('styles', 'bootstrap', 'scripts', 'images', 'reversion');
    else
        gulp.start('styles', 'bootstrap', 'scripts', 'images', 'watch');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(path.src.base + '/css/**/*.less', ['styles']);

  // Watch .js files
  gulp.watch(path.src.js, ['scripts']);

  // Watch image files
  gulp.watch(path.src.img, ['images']);
});