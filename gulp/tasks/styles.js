import gulp from 'gulp';
import sassLib from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import groupMedia from 'gulp-group-css-media-queries';
import rtlcss from 'gulp-rtlcss';
import size from 'gulp-size';
import header from 'gulp-header';
import cached from 'gulp-cached';
import dependents from 'gulp-dependents';
import postcssPresetEnv from 'postcss-preset-env';
import postcssSort from 'postcss-sorting';
import postcssPxtorem from 'postcss-pxtorem';
import postcssAssets from 'postcss-assets';
import { config } from '../config.js';
import { healBuildError } from '../utils/ai-healer.js';
import fs from 'fs';

const sass = gulpSass(sassLib);
const pkg = JSON.parse(fs.readFileSync('./package.json'));

export const styles = () => {
    return gulp.src(config.paths.src.styles)
        .pipe(plumber({
            errorHandler: async function(err) {
                notify.onError("Error: <%= error.message %>")(err);
                await healBuildError('Styles', err);
                this.emit('end');
            }
        }))
        .pipe(cached('styles')) // Only pass changed files
        .pipe(dependents()) // But include files that import them
        .pipe(gulpIf(!config.isProduction, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules'],
            outputStyle: 'expanded'
        }))
        .pipe(groupMedia())
        .pipe(postcss([
            postcssAssets({ loadPaths: ['src/assets/img'] }), // Resolve image paths
            postcssPresetEnv({ stage: 1 }), 
            postcssSort({ "properties-order": "alphabetical" }),
            postcssPxtorem({ propList: ['*'] }), 
            autoprefixer(),
        ]))
        // Add Auto-Comment/Banner
        .pipe(header(config.banner, { pkg : pkg } ))
        .pipe(gulp.dest(config.paths.dist.css))
        
        // RTL Version
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest(config.paths.dist.css))
        
        // Minification
        .pipe(gulpIf(config.isProduction, postcss([cssnano()])))
        .pipe(gulpIf(config.isProduction, rename({ suffix: '.min' })))
        .pipe(gulpIf(!config.isProduction, sourcemaps.write('.')))
        .pipe(size({ title: 'Styles', gzip: true }))
        .pipe(gulp.dest(config.paths.dist.css));
};