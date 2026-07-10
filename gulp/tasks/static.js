import gulp from 'gulp';
import { config } from '../config.js';

export const staticFiles = () => {
    return gulp.src(config.paths.src.static, { allowEmpty: true })
        .pipe(gulp.dest(config.paths.dist.base));
};
