import gulp from 'gulp';
import stylelint from 'gulp-stylelint';
import eslint from 'gulp-eslint';
import pugLinter from 'gulp-pug-linter';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import { config } from '../config.js';

// Lint SCSS
export const lintStyles = () => {
    return gulp.src(config.paths.src.styles)
        .pipe(plumber({ errorHandler: notify.onError("StyleLint Error: <%= error.message %>") }))
        .pipe(stylelint({
            reporters: [
                { formatter: 'string', console: true }
            ],
            failAfterError: false
        }));
};

// Lint TypeScript/JS
export const lintScripts = () => {
    return gulp.src(config.paths.src.scripts)
        .pipe(plumber({ errorHandler: notify.onError("ESLint Error: <%= error.message %>") }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Lint Pug
export const lintPug = () => {
    return gulp.src(config.paths.src.markup)
        .pipe(plumber({ errorHandler: notify.onError("PugLint Error: <%= error.message %>") }))
        .pipe(pugLinter({ reporter: 'default' }));
};

export const lint = gulp.parallel(lintStyles, lintScripts, lintPug);