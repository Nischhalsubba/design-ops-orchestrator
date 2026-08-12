import gulp from 'gulp';
import bump from 'gulp-bump';
import git from 'gulp-git';
import tagVersion from 'gulp-tag-version';
import zip from 'gulp-zip';
import todo from 'gulp-todo';
import filter from 'gulp-filter';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import yargs from 'yargs';
import { config } from '../config.js';

const argv = yargs(process.argv.slice(2)).argv;

// 1. Generate TODO.md from code comments
export const generateTodo = () => {
    return gulp.src([config.paths.src.base + '/**/*.{js,scss,pug,ts}', 'gulpfile.js'])
        .pipe(todo())
        .pipe(gulp.dest('./'))
        .pipe(todo.reporter('json', { fileName: 'todo.json' }))
        .pipe(gulp.dest('./'));
};

// 2. Archive Distribution
export const archive = () => {
    return gulp.src('dist/**/*')
        .pipe(zip('release-build.zip'))
        .pipe(gulp.dest('releases'));
};

// 3. Release Pipeline (Bump -> Tag -> Commit)
// Usage: gulp release --type minor
export const release = () => {
    const type = argv.type || 'patch'; // major, minor, patch, prerelease
    
    fancyLog(chalk.green(`🚀 Releasing ${type} version...`));

    return gulp.src(['./package.json'])
        .pipe(bump({ type: type }))
        .pipe(gulp.dest('./'))
        .pipe(git.add())
        .pipe(git.commit('chore: bump version'))
        .pipe(filter('package.json'))
        .pipe(tagVersion());
};