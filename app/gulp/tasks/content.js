import gulp from 'gulp';
import through from 'through2';
import path from 'path';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import { config } from '../config.js';

const md = new MarkdownIt();

export const content = () => {
    const articles = [];

    return gulp.src(config.paths.src.content)
        .pipe(through.obj((file, enc, cb) => {
            if (file.isBuffer()) {
                try {
                    const content = file.contents.toString();
                    const parsed = fm(content); // Extract Front Matter
                    const html = md.render(parsed.body); // Render Markdown to HTML

                    articles.push({
                        slug: path.basename(file.path, '.md'),
                        title: parsed.attributes.title || 'Untitled',
                        date: parsed.attributes.date || new Date(),
                        tags: parsed.attributes.tags || [],
                        html: html,
                        ...parsed.attributes
                    });

                    fancyLog(chalk.blue(`📝 Parsed Content: ${path.basename(file.path)}`));
                } catch (e) {
                    fancyLog(chalk.red(`Error parsing markdown: ${file.path}`));
                }
            }
            cb(null, file);
        }, function (cb) {
            // End of stream: Write the aggregated JSON file
            const jsonContent = JSON.stringify({ articles }, null, 2);
            const jsonFile = new  gulp.Vinyl({
                cwd: '/',
                base: '/',
                path: '/content_gen.json',
                contents: Buffer.from(jsonContent)
            });
            this.push(jsonFile);
            cb();
        }))
        // Rename appropriately for gulp-dest
        .pipe(gulp.src('src/data/dummy_for_pipe.json', { allowEmpty: true })) // Hack to re-enter stream if needed, or just write file directly
        .pipe(through.obj((file, enc, cb) => {
             // We manually write the JSON to src/data so Pug can pick it up on next reload
             import('fs').then(fs => {
                 fs.writeFileSync('src/data/generated_content.json', JSON.stringify({ articles }, null, 2));
             });
             cb();
        }));
};