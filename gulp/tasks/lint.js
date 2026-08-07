import { spawn } from 'node:child_process';
import gulp from 'gulp';
import { globSync } from 'glob';
import stylelint from 'stylelint';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import { config } from '../config.js';

// Lint SCSS
export const lintStyles = async () => {
    const result = await stylelint.lint({
        files: config.paths.src.styles,
        formatter: 'string',
        allowEmptyInput: true
    });

    if (result.report) {
        console.log(result.report);
    }
};

// Lint TypeScript/JS
export const lintScripts = () => {
    return gulp.src(config.paths.src.scripts)
        .pipe(plumber({ errorHandler: notify.onError("ESLint Error: <%= error.message %>") }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Lint Pug without the obsolete gulp-pug-linter wrapper.
export const lintPug = () => {
    const files = globSync(config.paths.src.markup);
    if (files.length === 0) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const executable = process.platform === 'win32'
            ? 'node_modules\\.bin\\pug-lint.cmd'
            : 'node_modules/.bin/pug-lint';
        const child = spawn(executable, files, { stdio: 'inherit' });

        child.on('error', reject);
        child.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Pug lint failed with exit code ${code}`));
            }
        });
    });
};

export const lint = gulp.parallel(lintStyles, lintScripts, lintPug);
