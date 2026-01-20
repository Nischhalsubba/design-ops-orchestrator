import gulp from 'gulp';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { markup } from './gulp/tasks/markup.js';
import { images, sprite, fonts } from './gulp/tasks/assets.js';
import { media, videos } from './gulp/tasks/media.js';
import { server, reload } from './gulp/tasks/server.js';
import { clean } from './gulp/tasks/clean.js';
import { lintStyles, lintScripts, lintPug } from './gulp/tasks/lint.js';

// Define the Build Series
const build = gulp.series(
    clean,
    gulp.parallel(styles, scripts, markup, images, media, videos, sprite, fonts)
);

// Define the Development Watcher
const watch = () => {
    // On Style Save: Lint -> Compile -> Reload
    gulp.watch('src/styles/**/*.scss', gulp.series(lintStyles, styles, reload));
    
    // On Script Save: Lint -> Bundle -> Reload
    gulp.watch('src/scripts/**/*.{ts,js}', gulp.series(lintScripts, scripts, reload));
    
    // On Pug Save: Lint -> Render -> Reload
    gulp.watch(['src/markup/**/*.pug', 'src/data/**/*.json'], gulp.series(lintPug, markup, reload));
    
    // Assets
    gulp.watch('src/assets/img/**/*', gulp.series(images, reload));
    gulp.watch('src/assets/icons/**/*', gulp.series(sprite, reload));
};

// Main Exported Tasks
export { clean, styles, scripts, markup, images, media, videos, sprite, fonts, build };

// Default Task (Development)
export default gulp.series(build, gulp.parallel(server, watch));