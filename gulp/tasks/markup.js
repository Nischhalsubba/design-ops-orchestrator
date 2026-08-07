import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import data from 'gulp-data';
import { globSync } from 'glob';
import inject from 'gulp-inject';
import pug from 'gulp-pug';
import { config } from '../config.js';

const loadData = () => {
    const dataPath = path.resolve('src/data/site.json');
    if (!fs.existsSync(dataPath)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

const siteUrl = (process.env.SITE_URL || 'https://github.com/Nischhalsubba/design-ops-orchestrator')
    .replace(/\/$/, '');

export const markup = () => {
    const cssSources = gulp.src(config.paths.dist.css + '/*.css', { read: false, allowEmpty: true });
    const jsSources = gulp.src(config.paths.dist.js + '/*.js', { read: false, allowEmpty: true });

    return gulp.src(config.paths.src.markup)
        .pipe(data(loadData))
        .pipe(pug({ pretty: !config.isProduction }))
        .pipe(inject(cssSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(inject(jsSources, { ignorePath: 'dist', addRootSlash: false }))
        .pipe(gulp.dest(config.paths.dist.html));
};

const xmlEscape = value => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const generateSitemap = async () => {
    const htmlFiles = globSync(`${config.paths.dist.base}/**/*.html`, { nodir: true });
    const urls = htmlFiles.map(file => {
        let relative = path.relative(config.paths.dist.base, file).split(path.sep).join('/');
        if (relative === 'index.html') {
            relative = '';
        } else if (relative.endsWith('/index.html')) {
            relative = relative.slice(0, -'index.html'.length);
        }
        return `${siteUrl}/${relative}`;
    });

    const body = urls
        .map(url => `  <url><loc>${xmlEscape(url)}</loc></url>`)
        .join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

    await fsPromises.mkdir(config.paths.dist.base, { recursive: true });
    await fsPromises.writeFile(path.join(config.paths.dist.base, 'sitemap.xml'), xml, 'utf8');
};
