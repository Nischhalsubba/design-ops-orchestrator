import gulp from 'gulp';
import esbuild from 'gulp-esbuild';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import size from 'gulp-size';
import header from 'gulp-header';
import gulpIf from 'gulp-if';
import terser from 'gulp-terser';
import rev from 'gulp-rev';
import revDel from 'gulp-rev-delete-original';
import brotli from 'gulp-brotli';
import sourcemaps from 'gulp-sourcemaps';
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
        .pipe(sourcemaps.init())
        .pipe(esbuild({
            target: 'es2022',
            bundle: true,
            minify: false,
            sourcemap: false, // We use gulp-sourcemaps instead
            platform: 'browser',
        }))
        .pipe(header(config.banner, { pkg : pkg } ))
        
        // --- Minification (Production) ---
        .pipe(gulpIf(config.isProduction, terser({
             compress: { drop_console: true }
        })))
        
        // --- Versioning (Production) ---
        .pipe(gulpIf(config.isProduction, rev()))
        .pipe(gulpIf(config.isProduction, revDel()))
        .pipe(gulp.dest(config.paths.dist.js))
        
        // --- Compression (Production) ---
        .pipe(gulpIf(config.isProduction, brotli.compress({
            extension: 'br',
            skipLarger: true,
            quality: 11
        })))
        .pipe(gulpIf(config.isProduction, gulp.dest(config.paths.dist.js)))
        
        .pipe(sourcemaps.write('.'))
        .pipe(size({ title: 'Scripts', gzip: true }));
};