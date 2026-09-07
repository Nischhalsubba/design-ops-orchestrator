import gulp from 'gulp';
import * as sassLib from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';
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
import fs from 'fs';

const sass = gulpSass(sassLib);
const pkg = JSON.parse(fs.readFileSync('./package.json'));

export const styles = () => {
    const sourceOptions = config.isProduction ? {} : { sourcemaps: true };
    const destinationOptions = config.isProduction ? {} : { sourcemaps: '.' };

    let stream = gulp.src(config.paths.src.styles, sourceOptions);

    // Incremental cache/dependency expansion belongs only to watch mode.
    // Production must be a finite one-pass pipeline so CI can terminate
    // deterministically on Gulp 5.
    if (!config.isProduction) {
        stream = stream
            .pipe(cached('styles'))
            .pipe(dependents());
    }

    return stream
        .pipe(sass({
            includePaths: ['node_modules'],
            outputStyle: 'expanded'
        }))
        .pipe(groupMedia())
        .pipe(postcss([
            postcssAssets({ loadPaths: ['src/assets/img'] }),
            postcssPresetEnv({ stage: 1 }),
            postcssSort({ 'properties-order': 'alphabetical' }),
            postcssPxtorem({ propList: ['*'] }),
            autoprefixer(),
        ]))
        .pipe(header(config.banner, { pkg }))
        .pipe(gulpIf(config.isProduction, postcss([cssnano()])))
        // Stable filenames keep the production stream finite and let the HTML
        // injector reference a single canonical LTR stylesheet on Pages.
        .pipe(gulp.dest(config.paths.dist.css, destinationOptions))
        // Preserve an RTL artifact without making it the default injected CSS.
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest(config.paths.dist.css))
        .pipe(size({ title: 'Styles', gzip: true }));
};
