import gulp from 'gulp';
import jsonmin from 'gulp-jsonmin';
import filelist from 'gulp-filelist';
import path from 'path';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import { config } from '../config.js';

// The Motion Engine
// 1. Minifies Lottie JSON
// 2. Copies Rive binaries
// 3. Generates a 'manifest' so the Frontend knows what animations exist
export const motion = () => {
    
    // 1. Process Lottie
    const lottie = gulp.src('src/assets/animation/**/*.json')
        .pipe(jsonmin())
        .pipe(gulp.dest(config.paths.dist.animations));

    // 2. Process Rive
    const rive = gulp.src('src/assets/animation/**/*.riv')
        .pipe(gulp.dest(config.paths.dist.animations));

    // 3. Generate Manifest
    // Scans the source folder and creates a JSON array of filenames
    // This allows the JS frontend to say: loadAnimation(manifest[0])
    const manifest = gulp.src('src/assets/animation/**/*.{json,riv}')
        .pipe(filelist('_motion-manifest.json', { flatten: true, removeExtensions: false }))
        .pipe(gulp.dest(config.paths.dist.animations));

    fancyLog(chalk.magenta('🎬 Motion Engine: Manifest regenerated.'));

    return manifest; 
};