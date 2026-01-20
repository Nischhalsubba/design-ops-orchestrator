import gulp from 'gulp';
import esbuild from 'gulp-esbuild';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import size from 'gulp-size';
import { config } from '../config.js';

export const scripts = () => {
    return gulp.src(config.paths.src.scripts)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(esbuild({
            target: 'es2020',
            bundle: true,
            minify: config.isProduction,
            sourcemap: !config.isProduction,
            platform: 'browser',
        }))
        .pipe(size({ title: 'Scripts' }))
        .pipe(gulp.dest(config.paths.dist.js));
};