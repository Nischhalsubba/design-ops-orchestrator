import gulp from 'gulp';
import esbuild from 'gulp-esbuild';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import size from 'gulp-size';
import header from 'gulp-header';
import gulpIf from 'gulp-if';
import terser from 'gulp-terser';
import { config } from '../config.js';
import { healBuildError } from '../utils/ai-healer.js';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export const scripts = () => {
    return gulp.src(config.paths.src.scripts)
        .pipe(plumber({
            errorHandler: async function(err) {
                notify.onError("Error: <%= error.message %>")(err);
                await healBuildError('Scripts', err);
                this.emit('end');
            }
        }))
        .pipe(esbuild({
            target: 'es2022',
            bundle: true,
            minify: false, // We use gulp-terser for better control
            sourcemap: !config.isProduction,
            platform: 'browser',
        }))
        // Add Auto-Comment/Banner
        .pipe(header(config.banner, { pkg : pkg } ))
        // Minify and Strip Debug in Production
        .pipe(gulpIf(config.isProduction, terser({
             compress: {
                 drop_console: true, // Remove console.logs
             }
        })))
        .pipe(size({ title: 'Scripts', gzip: true }))
        .pipe(gulp.dest(config.paths.dist.js));
};