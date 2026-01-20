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
import inject from 'gulp-inject';
import sitemap from 'gulp-sitemap';
import { config } from '../config.js';

const loadData = (file) => {
    const dataPath = path.resolve('src/data/site.json');
    if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath));
    }
    return {};
};

export const markup = () => {
    // Sources for injection
    const cssSources = gulp.src(config.paths.dist.css + '/*.css', { read: false });
    const jsSources = gulp.src(config.paths.dist.js + '/*.js', { read: false });

    return gulp.src(config.paths.src.markup)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(data(loadData))
        .pipe(pug({ pretty: !config.isProduction }))
        
        // Auto-Inject CSS and JS (No broken links ever)
        .pipe(inject(cssSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(inject(jsSources, { ignorePath: 'dist', addRootSlash: false }))
        
        // Validation (Production Only to save time in dev)
        .pipe(gulpIf(config.isProduction, validator()))
        
        // Minification
        .pipe(gulpIf(config.isProduction, htmlmin({
            collapseWhitespace: true,
            removeComments: true
        })))
        
        // Sitemap Generation
        .pipe(gulpIf(config.isProduction, sitemap({
            siteUrl: 'https://designops.example.com'
        })))
        
        .pipe(gulp.dest(config.paths.dist.html));
};