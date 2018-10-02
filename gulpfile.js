var gulp = require('gulp');
var size = require('gulp-size');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var angular_dir = 'public/assets/angular/';
var build_dir = 'public/assets/build/';

var paths = {
    vendor_styles: [
        'node_modules/angular-material/angular-material.min.css',
    ],
    app_styles: [
        'public/assets/css/chat.css'
    ],
    app_styles_login: [
        'public/assets/css/login.css'
    ],

    vendor_scripts: angular_dir + 'vendor.js',
    app_scripts: [
        angular_dir + 'app/**/*.module.js',
        angular_dir + 'app/app.module.js',
        angular_dir + 'app/**/*.js'
    ]
};

//===================================================================================
// VENDOR
//===================================================================================

gulp.task('vendorJS', function() {
    return browserify(paths.vendor_scripts)
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'vendor.js'}));
});

gulp.task('vendorCSS', function() {
    return gulp.src(paths.vendor_styles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'vendor.css'}));
});

//===================================================================================
// APPLICATION
//===================================================================================

gulp.task('appJS', function() {
    return gulp.src(paths.app_scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'app.js'}));
});

gulp.task('appCSS', function() {
    return gulp.src(paths.app_styles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'app.css'}));
});

gulp.task('appLoginCSS', function() {
    return gulp.src(paths.app_styles)
        .pipe(concat('login.css'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'login.css'}));
});

//===================================================================================
// WATCH
//===================================================================================

gulp.task('watch', function() {
    gulp.watch(paths.vendor_scripts, ['vendorJS']);
    gulp.watch(paths.vendor_styles, ['vendorCSS']);

    gulp.watch(paths.app_scripts, ['appJS']);
    gulp.watch(paths.app_styles, ['appCSS']);
    gulp.watch(paths.app_styles, ['appLoginCSS']);
});

gulp.task('default', ['vendorJS', 'vendorCSS', 'appJS', 'appCSS', 'appLoginCSS', 'watch']);