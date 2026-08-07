import { spawn } from 'node:child_process';
import gulp from 'gulp';
import { globSync } from 'glob';
import stylelint from 'stylelint';
import { config } from '../config.js';

const runLocalCommand = (command, files, label) => {
    if (files.length === 0) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const executable = process.platform === 'win32'
            ? `node_modules\\.bin\\${command}.cmd`
            : `node_modules/.bin/${command}`;
        const child = spawn(executable, files, { stdio: 'inherit' });

        child.on('error', reject);
        child.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${label} failed with exit code ${code}`));
            }
        });
    });
};

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

// Lint TypeScript/JS with the project's direct ESLint dependency.
export const lintScripts = () => {
    const files = globSync(config.paths.src.scripts);
    return runLocalCommand('eslint', files, 'ESLint');
};

// Lint Pug without the obsolete gulp-pug-linter wrapper.
export const lintPug = () => {
    const files = globSync(config.paths.src.markup);
    return runLocalCommand('pug-lint', files, 'Pug lint');
};

export const lint = gulp.parallel(lintStyles, lintScripts, lintPug);
