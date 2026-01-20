import gulp from 'gulp';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { markup } from './gulp/tasks/markup.js';
import { images, sprite, fonts } from './gulp/tasks/assets.js';
import { server, reload } from './gulp/tasks/server.js';
import { clean } from './gulp/tasks/clean.js';

// Define the Build Series
const build = gulp.series(
    clean,
    gulp.parallel(styles, scripts, markup, images, sprite, fonts)
);

// Define the Development Watcher
const watch = () => {
    gulp.watch('src/styles/**/*.scss', gulp.series(styles, reload));
    gulp.watch('src/scripts/**/*.{ts,js}', gulp.series(scripts, reload));
    gulp.watch(['src/markup/**/*.pug', 'src/data/**/*.json'], gulp.series(markup, reload));
    gulp.watch('src/assets/img/**/*', gulp.series(images, reload));
    gulp.watch('src/assets/icons/**/*', gulp.series(sprite, reload));
};

// Main Exported Tasks
export { clean, styles, scripts, markup, images, sprite, fonts, build };

// Default Task (Development)
export default gulp.series(build, gulp.parallel(server, watch));