import 'dotenv/config'; // Load .env file
import gulp from 'gulp';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { markup } from './gulp/tasks/markup.js';
import { images, sprite, fonts, animations } from './gulp/tasks/assets.js';
import { media, videos } from './gulp/tasks/media.js';
import { server, reload } from './gulp/tasks/server.js';
import { clean } from './gulp/tasks/clean.js';
import { lintStyles, lintScripts, lintPug, lint } from './gulp/tasks/lint.js';
import { tokens } from './gulp/tasks/tokens.js';

// Define the Build Series (Serial execution for correct dependency injection)
const build = gulp.series(
    clean,
    tokens, // NEW: Generate SCSS from Figma JSON before compiling CSS
    lint, // Enforce quality
    gulp.parallel(images, media, videos, sprite, fonts, animations), // Heavy assets
    gulp.parallel(styles, scripts), // Compiles CSS/JS
    markup // Injects and creates HTML
);

// Define the Development Watcher
const watch = () => {
    // On Token Save: Convert -> Compile Styles -> Reload
    gulp.watch(config.paths.watch.tokens, gulp.series(tokens, styles, reload));

    // On Style Save: Lint -> Compile -> Reload
    gulp.watch('src/styles/**/*.scss', gulp.series(lintStyles, styles, reload));
    
    // On Script Save: Lint -> Bundle -> Reload
    gulp.watch('src/scripts/**/*.{ts,js}', gulp.series(lintScripts, scripts, reload));
    
    // On Pug Save: Lint -> Render -> Reload
    gulp.watch(['src/markup/**/*.pug', 'src/data/**/*.json'], gulp.series(lintPug, markup, reload));
    
    // Assets
    gulp.watch('src/assets/img/**/*', gulp.series(images, reload));
    gulp.watch('src/assets/icons/**/*', gulp.series(sprite, reload));
    gulp.watch('src/assets/animation/**/*', gulp.series(animations, reload));
};

// Main Exported Tasks
export { clean, styles, scripts, markup, images, media, videos, sprite, fonts, animations, tokens, build, lint };

// Default Task (Development)
export default gulp.series(build, gulp.parallel(server, watch));