const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssmin = require("gulp-minify-css");
const pump = require('pump');
const gzip = require('gulp-gzip');
const htmlmin = require('gulp-htmlmin');
const rename = require("gulp-rename");

// const flatten = require('gulp-flatten');
// const replace = require('gulp-replace');
// const strip = require('gulp-strip-comments');
// const cleanhtml = require('gulp-cleanhtml');

const jsSources = "fs/*.js";
const cssSources = "fs/*.css";
const htmlSources = "fs/*.html";
const gzipDest = "fs_min_gzip";
const minDest = "fs_min";

gulp.task('minjs', function (cb) {
    pump(
        [
            gulp.src(jsSources),
            uglify({
                compress: {
                    drop_console: true
                }
            }),
            gulp.dest(minDest)
        ],
        cb
    );
});

gulp.task('mincss', function (cb) {
    pump(
        [
            gulp.src(cssSources),
            cssmin(),
            // rename({ suffix: '.min' }),
            gulp.dest(minDest)
        ],
        cb
    );
});

gulp.task('minhtml', function (cb) {
    pump(
        [
            gulp.src(htmlSources),
            htmlmin({
                collapseWhitespace: true
            }),
            // rename({ suffix: '.min' }),
            gulp.dest(minDest)
        ],
        cb
    );
});

gulp.task('gzipfiles', function (cb) {
    pump(
        [
            gulp.src(minDest + "/*"),
            gzip({
                append: true
            }),
            gulp.dest(gzipDest)
        ],
        cb
    );
});

gulp.task('min', gulp.series('minjs', 'mincss', 'minhtml'));
gulp.task('deploy', gulp.series('minjs', 'mincss', 'minhtml', 'gzipfiles'));