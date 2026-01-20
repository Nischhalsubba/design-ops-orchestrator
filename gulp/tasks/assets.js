import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';
import svgSprite from 'gulp-svg-sprite';
import newer from 'gulp-newer';
import { config } from '../config.js';

export const images = () => {
    return gulp.src(config.paths.src.images)
        .pipe(newer(config.paths.dist.img))
        // 1. Generate AVIF
        .pipe(gulp.src(config.paths.src.images))
        .pipe(avif())
        .pipe(gulp.dest(config.paths.dist.img))
        // 2. Generate WebP
        .pipe(gulp.src(config.paths.src.images))
        .pipe(webp())
        .pipe(gulp.dest(config.paths.dist.img))
        // 3. Optimize Originals
        .pipe(gulp.src(config.paths.src.images))
        .pipe(imagemin())
        .pipe(gulp.dest(config.paths.dist.img));
};

export const sprite = () => {
    return gulp.src(config.paths.src.icons)
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: 'sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest(config.paths.dist.sprites));
};

export const fonts = () => {
    return gulp.src(config.paths.src.fonts)
        .pipe(gulp.dest(config.paths.dist.fonts));
};

export const animations = () => {
    return gulp.src(config.paths.src.animations)
        .pipe(gulp.dest(config.paths.dist.animations));
};