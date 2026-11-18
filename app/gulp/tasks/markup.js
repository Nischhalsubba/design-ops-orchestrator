import gulp from 'gulp';
import pug from 'gulp-pug';
import data from 'gulp-data';
import fs from 'fs';
import path from 'path';
import gulpIf from 'gulp-if';
import inject from 'gulp-inject';
import sitemap from 'gulp-sitemap';
import through2 from 'through2';
import { minify } from 'html-minifier-terser';
import { w3cHtmlValidator } from 'w3c-html-validator';
import { stream as critical } from 'critical';
import { config } from '../config.js';

const loadData = () => {
    const dataPath = path.resolve('src/data/site.json');
    if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath));
    }
    return {};
};

const siteUrl = (process.env.SITE_URL || 'https://github.com/Nischhalsubba/design-ops-orchestrator')
    .replace(/\/$/, '');

const validateMarkup = () => through2.obj((file, _encoding, callback) => {
    if (!file.isBuffer()) {
        callback(null, file);
        return;
    }

    const html = file.contents.toString();
    w3cHtmlValidator.validate({ html })
        .then((results) => {
            if (!results.validates) {
                callback(new Error(`W3C validation failed for ${file.relative}`));
                return;
            }
            callback(null, file);
        })
        .catch(callback);
});

const minifyMarkup = () => through2.obj((file, _encoding, callback) => {
    if (!file.isBuffer()) {
        callback(null, file);
        return;
    }

    minify(file.contents.toString(), {
        collapseWhitespace: true,
        removeComments: true,
    })
        .then((html) => {
            file.contents = Buffer.from(html);
            callback(null, file);
        })
        .catch(callback);
});

export const markup = () => {
    const cssSources = gulp.src(config.paths.dist.css + '/*.css', { read: false });
    const jsSources = gulp.src(config.paths.dist.js + '/*.js', { read: false });

    return gulp.src(config.paths.src.markup)
        .pipe(data(loadData))
        .pipe(pug({ pretty: !config.isProduction }))
        .pipe(inject(cssSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(inject(jsSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(gulpIf(config.isProduction, validateMarkup()))
        .pipe(gulpIf(config.isProduction, minifyMarkup()))
        .pipe(gulpIf(config.isProduction, critical({
            base: 'dist/',
            inline: true,
            css: [config.paths.dist.css + '/*.css']
        })))
        .pipe(gulpIf(config.isProduction, sitemap({ siteUrl })))
        .pipe(gulp.dest(config.paths.dist.html));
};
