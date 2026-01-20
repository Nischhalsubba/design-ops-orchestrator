import gulp from 'gulp';
import responsive from 'gulp-responsive';
import cached from 'gulp-cached';
import { config } from '../config.js';

// Requires ffmpeg installed on system. If not, this is a placeholder.
// npm install --save-dev gulp-fluent-ffmpeg
// import ffmpeg from 'gulp-fluent-ffmpeg';

export const media = () => {
    // 1. Generate Responsive Images (SrcSet)
    return gulp.src('src/assets/img/hero/*.{jpg,png}')
        .pipe(cached('responsive-images'))
        .pipe(responsive({
            '*.jpg': [
                { width: 320, rename: { suffix: '-320w' } },
                { width: 768, rename: { suffix: '-768w' } },
                { width: 1280, rename: { suffix: '-1280w' } },
                { width: 1920, rename: { suffix: '-xl' } },
            ],
            '*.png': [
                { width: 320, rename: { suffix: '-320w' } },
                { width: 768, rename: { suffix: '-768w' } },
            ]
        }, {
            // Global config
            quality: 80,
            compressionLevel: 6,
            progressive: true,
            withMetadata: false,
            errorOnEnlargement: false
        }))
        .pipe(gulp.dest(config.paths.dist.img + '/responsive'));
};

export const videos = () => {
    // Placeholder for Video Optimization
    // In a real "God-tier" setup, we would transcode MP4 to WebM here.
    return gulp.src('src/assets/video/**/*')
        .pipe(gulp.dest('dist/assets/video'));
};