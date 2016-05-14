
const sourceFileName = 'react-wire';

const del = require('del');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');

gulp.task('clean', cb => {
    return del([`./${sourceFileName}.min.js`], cb);
});

gulp.task('js-minify', ['clean'], function() {
    return gulp.src([`./${sourceFileName}.js`])
        .pipe(sourcemaps.init())
        .pipe(eslint({
            "extends": "eslint:recommended",
            "parser": "babel-eslint",
            "env": {
                "browser": true,
                "node": true,
                "es6": true
            },
            "parserOptions": {
                "ecmaVersion": 6
            },
            "rules": {
                "no-debugger": 0,
                "no-console": 0,
                "new-cap": 0,
                "strict": 0,
                "no-underscore-dangle": 0,
                "no-use-before-define": 0,
                "eol-last": 0,
                "quotes": [2, "single"]
            }
        }))
        .pipe(eslint.format())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify({ preserveComments: 'license' }))
        .pipe(rename(`./${sourceFileName}.min.js`))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['clean', 'js-minify']);