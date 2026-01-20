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
import { stream as critical } from 'critical';
import { config } from '../config.js';

const loadData = (file) => {
    const dataPath = path.resolve('src/data/site.json');
    if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath));
    }
    return {};
};

export const markup = () => {
    // Inject sources: Now finds the hashed files because Styles/Scripts ran first
    const cssSources = gulp.src(config.paths.dist.css + '/*.css', { read: false });
    const jsSources = gulp.src(config.paths.dist.js + '/*.js', { read: false });

    return gulp.src(config.paths.src.markup)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(data(loadData))
        .pipe(pug({ pretty: !config.isProduction }))
        
        // 1. Inject CSS/JS (Handles hashed filenames automatically)
        .pipe(inject(cssSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(inject(jsSources, { ignorePath: 'dist', addRootSlash: false }))
        
        // 2. Validate
        .pipe(gulpIf(config.isProduction, validator()))
        
        // 3. Minify HTML
        .pipe(gulpIf(config.isProduction, htmlmin({
            collapseWhitespace: true,
            removeComments: true
        })))

        // 4. Critical CSS (Inline above-the-fold styles)
        .pipe(gulpIf(config.isProduction, critical({
            base: 'dist/',
            inline: true,
            css: [config.paths.dist.css + '/*.css'] // Finds the generated CSS files
        })))
        
        // 5. Sitemap
        .pipe(gulpIf(config.isProduction, sitemap({
            siteUrl: 'https://designops.example.com'
        })))
        
        .pipe(gulp.dest(config.paths.dist.html));
};