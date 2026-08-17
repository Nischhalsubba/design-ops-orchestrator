import gulp from 'gulp';
import eslint from 'gulp-eslint-new';
import pug from 'gulp-pug';
import stylelint from 'stylelint';
import { config } from '../config.js';

export const lintStyles = async () => {
    const result = await stylelint.lint({
        files: config.paths.src.styles,
        configFile: 'stylelint.config.mjs',
        formatter: 'string',
    });

    if (result.report) console.log(result.report);
    if (result.errored) throw new Error('Stylelint reported errors');
};

export const lintScripts = () => {
    return gulp.src(config.paths.src.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

export const lintPug = () => {
    return gulp.src(config.paths.src.markup)
        .pipe(pug({ pretty: true }));
};

export const lint = gulp.parallel(lintStyles, lintScripts, lintPug);
