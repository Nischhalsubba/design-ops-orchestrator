import gulp from 'gulp';
import responsive from 'gulp-responsive';
import cached from 'gulp-cached';
import { config } from '../config.js';

export const media = () => {
    // 1. Generate Responsive Images (SrcSet)
    // Only processes files if they have changed (via gulp-cached)
    return gulp.src('src/assets/img/**/*.{jpg,png}')
        .pipe(cached('responsive-images'))
        .pipe(responsive({
            // Resize all JPGs to standard breakpoints
            '**/*.jpg': [
                { width: 320, rename: { suffix: '-320w' } },
                { width: 768, rename: { suffix: '-768w' } },
                { width: 1280, rename: { suffix: '-1280w' } },
                // Original quality optimized
                { width: '100%', rename: { suffix: '' } } 
            ],
            // Resize all PNGs
            '**/*.png': [
                { width: 320, rename: { suffix: '-320w' } },
                { width: 768, rename: { suffix: '-768w' } },
                { width: '100%', rename: { suffix: '' } }
            ]
        }, {
            // Global config
            quality: 85,
            compressionLevel: 6,
            progressive: true,
            withMetadata: false,
            errorOnEnlargement: false,
            skipOnEnlargement: true
        }))
        .pipe(gulp.dest(config.paths.dist.img));
};

export const videos = () => {
    // Simple move for videos, as full FFmpeg encoding in Node can be heavy.
    // Designers should export optimized .mp4/.webm from After Effects/Premiere.
    return gulp.src('src/assets/video/**/*.{mp4,webm}')
        .pipe(gulp.dest('dist/assets/video'));
};