import gulp from 'gulp';
import pug from 'gulp-pug';
import data from 'gulp-data';
import fs from 'fs';
import path from 'path';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import htmlmin from 'gulp-htmlmin';
import gulpIf from 'gulp-if';
import validator from 'gulp-w3c-html-validator';
import a11y from 'gulp-a11y';
import { config } from '../config.js';

const loadData = (file) => {
    const dataPath = path.resolve('src/data/site.json');
    if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath));
    }
    return {};
};

export const markup = () => {
    return gulp.src(config.paths.src.markup)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(data(loadData))
        .pipe(pug({
            pretty: !config.isProduction
        }))
        // Validation (Warn only to not break build)
        //.pipe(validator()) 
        // A11y Check
        //.pipe(a11y({
        //    displayOnly: ['ERROR']
        //}))
        .pipe(gulpIf(config.isProduction, htmlmin({
            collapseWhitespace: true,
            removeComments: true
        })))
        .pipe(gulp.dest(config.paths.dist.html));
};