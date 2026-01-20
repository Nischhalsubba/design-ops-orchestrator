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
import { config } from '../config.js';

const sass = gulpSass(sassLib);

export const styles = () => {
    return gulp.src(config.paths.src.styles)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulpIf(!config.isProduction, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules'],
            outputStyle: 'expanded'
        }))
        .pipe(groupMedia())
        .pipe(postcss([
            autoprefixer(),
        ]))
        // Generate RTL Version
        .pipe(gulp.dest(config.paths.dist.css)) // Save Standard CSS
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest(config.paths.dist.css)) // Save RTL CSS
        // Production Optimizations
        .pipe(gulpIf(config.isProduction, postcss([cssnano()])))
        .pipe(gulpIf(!config.isProduction, sourcemaps.write('.')))
        .pipe(size({ title: 'Styles' }))
        .pipe(gulp.dest(config.paths.dist.css));
};