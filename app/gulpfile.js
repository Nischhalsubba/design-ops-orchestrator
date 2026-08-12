import 'dotenv/config';
import gulp from 'gulp';
import { config } from './gulp/config.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { markup } from './gulp/tasks/markup.js';
import { images, sprite, fonts } from './gulp/tasks/assets.js';
import { motion } from './gulp/tasks/motion.js';
import { media, videos } from './gulp/tasks/media.js';
import { staticFiles } from './gulp/tasks/static.js';
import { server, reload } from './gulp/tasks/server.js';
import { clean } from './gulp/tasks/clean.js';
import { lintStyles, lintScripts, lintPug, lint } from './gulp/tasks/lint.js';
import { tokens } from './gulp/tasks/tokens.js';
import { content } from './gulp/tasks/content.js';
import { audit } from './gulp/tasks/audit.js';
import { release, generateTodo, archive } from './gulp/tasks/admin.js';

const build = gulp.series(
    clean,
    gulp.parallel(tokens, content),
    lint,
    gulp.parallel(images, media, videos, sprite, fonts, motion, staticFiles),
    gulp.parallel(styles, scripts),
    markup
);

const watch = () => {
    gulp.watch(config.paths.watch.tokens, gulp.series(tokens, styles, reload));
    gulp.watch(config.paths.watch.content, gulp.series(content, markup, reload));
    gulp.watch(config.paths.watch.styles, gulp.series(lintStyles, styles, reload));
    gulp.watch(config.paths.watch.scripts, gulp.series(lintScripts, scripts, reload));
    gulp.watch([config.paths.watch.markup, config.paths.watch.data], gulp.series(lintPug, markup, reload));
    gulp.watch(config.paths.src.images, gulp.series(images, reload));
    gulp.watch(config.paths.src.icons, gulp.series(sprite, reload));
    gulp.watch(config.paths.watch.animations, gulp.series(motion, reload));
    gulp.watch(config.paths.watch.static, gulp.series(staticFiles, reload));
};

const todo = generateTodo;

export {
    clean, styles, scripts, markup, images, media, videos, sprite, fonts, motion, staticFiles,
    tokens, content, audit, release, todo, archive,
    build, lint
};

export default gulp.series(build, gulp.parallel(server, watch));
