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
    const requiredPatterns = [
        ['doctype', /<!doctype html>/i],
        ['html element', /<html(?:\s|>)/i],
        ['head element', /<head(?:\s|>)/i],
        ['non-empty title', /<title>\s*[^<]+\s*<\/title>/i],
        ['body element', /<body(?:\s|>)/i],
    ];

    for (const [label, pattern] of requiredPatterns) {
        if (!pattern.test(html)) {
            callback(new Error(`Markup validation failed for ${file.relative}: missing ${label}`));
            return;
        }
    }

    const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        callback(new Error(
            `Markup validation failed for ${file.relative}: duplicate id(s) ${[...new Set(duplicateIds)].join(', ')}`
        ));
        return;
    }

    callback(null, file);
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
    const cssSources = gulp.src([
        config.paths.dist.css + '/*.css',
        '!' + config.paths.dist.css + '/*-rtl.css'
    ], { read: false });
    const jsSources = gulp.src(config.paths.dist.js + '/*.js', { read: false });

    return gulp.src(config.paths.src.markup)
        .pipe(data(loadData))
        .pipe(pug({ pretty: !config.isProduction }))
        .pipe(inject(cssSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(inject(jsSources, { ignorePath: 'dist', addRootSlash: false }))
        // Build validation must be deterministic and offline. Full browser/
        // accessibility/performance audits remain available as explicit audit
        // tasks; release builds verify the structural HTML contract locally.
        .pipe(gulpIf(config.isProduction, validateMarkup()))
        .pipe(gulpIf(config.isProduction, minifyMarkup()))
        .pipe(gulpIf(config.isProduction, sitemap({ siteUrl })))
        .pipe(gulp.dest(config.paths.dist.html));
};
