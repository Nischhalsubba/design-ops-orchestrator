import fs from 'node:fs/promises';
import path from 'node:path';
import gulp from 'gulp';
import bump from 'gulp-bump';
import git from 'gulp-git';
import tagVersion from 'gulp-tag-version';
import zip from 'gulp-zip';
import filter from 'gulp-filter';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import yargs from 'yargs';
import { config } from '../config.js';

const argv = yargs(process.argv.slice(2)).argv;
const todoExtensions = new Set(['.js', '.ts', '.scss', '.pug']);
const todoPattern = /\b(TODO|FIXME|HACK|OPTIMIZE)\b[:\s-]*(.*)/i;

const walkSourceFiles = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) return walkSourceFiles(target);
        return todoExtensions.has(path.extname(entry.name)) ? [target] : [];
    }));
    return files.flat();
};

export const generateTodo = async () => {
    const sourceFiles = await walkSourceFiles(config.paths.src.base);
    const files = [...sourceFiles, 'gulpfile.js'];
    const items = [];

    for (const file of files) {
        const contents = await fs.readFile(file, 'utf8');
        contents.split(/\r?\n/).forEach((line, index) => {
            const match = line.match(todoPattern);
            if (!match) return;
            items.push({
                file: file.replaceAll('\\', '/'),
                line: index + 1,
                tag: match[1].toUpperCase(),
                text: match[2].trim(),
            });
        });
    }

    const markdown = [
        '# TODO',
        '',
        ...(items.length
            ? items.map((item) => `- [ ] \`${item.file}:${item.line}\` **${item.tag}** ${item.text}`.trimEnd())
            : ['No TODO comments found.']),
        '',
    ].join('\n');

    await Promise.all([
        fs.writeFile('TODO.md', markdown),
        fs.writeFile('todo.json', `${JSON.stringify(items, null, 2)}\n`),
    ]);
};

export const archive = () => {
    return gulp.src('dist/**/*')
        .pipe(zip('release-build.zip'))
        .pipe(gulp.dest('releases'));
};

export const release = () => {
    const type = argv.type || 'patch';

    fancyLog(chalk.green(`Releasing ${type} version...`));

    return gulp.src(['./package.json'])
        .pipe(bump({ type }))
        .pipe(gulp.dest('./'))
        .pipe(git.add())
        .pipe(git.commit('chore: bump version'))
        .pipe(filter('package.json'))
        .pipe(tagVersion());
};
