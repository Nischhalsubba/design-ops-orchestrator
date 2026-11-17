import gulp from 'gulp';
import esbuild from 'gulp-esbuild';
import size from 'gulp-size';
import header from 'gulp-header';
import gulpIf from 'gulp-if';
import terser from 'gulp-terser';
import rev from 'gulp-rev';
import revDel from 'gulp-rev-delete-original';
import brotli from 'gulp-brotli';
import { config } from '../config.js';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export const scripts = () => {
    return gulp.src(config.paths.src.scripts)
        .pipe(esbuild({
            target: 'es2022',
            bundle: true,
            minify: false,
            sourcemap: !config.isProduction,
            platform: 'browser',
        }))
        .pipe(header(config.banner, { pkg : pkg } ))
        .pipe(gulpIf(config.isProduction, terser({
             compress: { drop_console: true }
        })))
        .pipe(gulpIf(config.isProduction, rev()))
        .pipe(gulpIf(config.isProduction, revDel()))
        .pipe(gulp.dest(config.paths.dist.js))
        .pipe(gulpIf(config.isProduction, brotli.compress({
            extension: 'br',
            skipLarger: true,
            quality: 11
        })))
        .pipe(gulpIf(config.isProduction, gulp.dest(config.paths.dist.js)))
        .pipe(size({ title: 'Scripts', gzip: true }));
};
