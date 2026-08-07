import { existsSync } from 'node:fs';
import gulp from 'gulp';
import jsonmin from 'gulp-jsonmin';
import filelist from 'gulp-filelist';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import { config } from '../config.js';

// Minify Lottie JSON, copy Rive binaries, and generate a manifest when motion
// assets exist. Projects without motion assets should still build cleanly.
export const motion = () => {
    if (!existsSync('src/assets/animation')) {
        return Promise.resolve();
    }

    gulp.src('src/assets/animation/**/*.json', { allowEmpty: true })
        .pipe(jsonmin())
        .pipe(gulp.dest(config.paths.dist.animations));

    gulp.src('src/assets/animation/**/*.riv', { allowEmpty: true })
        .pipe(gulp.dest(config.paths.dist.animations));

    const manifest = gulp.src('src/assets/animation/**/*.{json,riv}', { allowEmpty: true })
        .pipe(filelist('_motion-manifest.json', { flatten: true, removeExtensions: false }))
        .pipe(gulp.dest(config.paths.dist.animations));

    fancyLog(chalk.magenta('Motion Engine: Manifest regenerated.'));
    return manifest;
};
