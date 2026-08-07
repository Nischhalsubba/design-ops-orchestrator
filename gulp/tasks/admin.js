import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import gulp from 'gulp';
import zip from 'gulp-zip';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import { globSync } from 'glob';
import yargs from 'yargs';
import { config } from '../config.js';

const argv = yargs(process.argv.slice(2)).argv;
const todoPattern = /\b(TODO|FIXME|HACK|XXX)\b[:\s-]*(.*)/i;

// 1. Generate TODO.md and todo.json without the obsolete gulp-todo wrapper.
export const generateTodo = async () => {
    const files = globSync([
        `${config.paths.src.base}/**/*.{js,scss,pug,ts}`,
        'gulpfile.js'
    ], { nodir: true });
    const items = [];

    for (const file of files) {
        const source = await fs.readFile(file, 'utf8');
        source.split(/\r?\n/).forEach((line, index) => {
            const match = line.match(todoPattern);
            if (match) {
                items.push({
                    file,
                    line: index + 1,
                    type: match[1].toUpperCase(),
                    text: match[2].trim()
                });
            }
        });
    }

    const markdown = [
        '# TODO',
        '',
        ...items.map(item => `- [ ] **${item.type}** ${item.file}:${item.line}${item.text ? ` - ${item.text}` : ''}`),
        ''
    ].join('\n');

    await Promise.all([
        fs.writeFile('TODO.md', markdown, 'utf8'),
        fs.writeFile('todo.json', JSON.stringify(items, null, 2) + '\n', 'utf8')
    ]);
};

// 2. Archive Distribution
export const archive = () => {
    return gulp.src('dist/**/*')
        .pipe(zip('release-build.zip'))
        .pipe(gulp.dest('releases'));
};

// 3. Release Pipeline
// Usage: gulp release --type minor
export const release = async () => {
    const type = argv.type || 'patch';
    const allowed = new Set(['major', 'minor', 'patch']);
    if (!allowed.has(type)) {
        throw new Error(`Unsupported release type: ${type}`);
    }

    fancyLog(chalk.green(`Releasing ${type} version...`));

    // npm's built-in version command keeps package.json and package-lock.json in sync.
    execFileSync('npm', ['version', type, '--no-git-tag-version'], { stdio: 'inherit' });

    const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
    execFileSync('git', ['add', 'package.json', 'package-lock.json'], { stdio: 'inherit' });
    execFileSync('git', ['commit', '-m', `chore: bump version to ${pkg.version}`], { stdio: 'inherit' });
    execFileSync('git', ['tag', `v${pkg.version}`], { stdio: 'inherit' });
};
