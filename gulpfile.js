import 'dotenv/config'; // Load .env file
import gulp from 'gulp';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { markup } from './gulp/tasks/markup.js';
import { images, sprite, fonts } from './gulp/tasks/assets.js'; // Removed animations import
import { motion } from './gulp/tasks/motion.js'; // NEW: Imported dedicated engine
import { media, videos } from './gulp/tasks/media.js';
import { server, reload } from './gulp/tasks/server.js';
import { clean } from './gulp/tasks/clean.js';
import { lintStyles, lintScripts, lintPug, lint } from './gulp/tasks/lint.js';
import { tokens } from './gulp/tasks/tokens.js';
import { content } from './gulp/tasks/content.js'; 
import { audit } from './gulp/tasks/audit.js'; 
import { release, generateTodo, archive } from './gulp/tasks/admin.js';

// Define the Build Series (Serial execution for correct dependency injection)
const build = gulp.series(
    clean,
    gulp.parallel(tokens, content), // Ingest Design Tokens AND Content
    lint, 
    gulp.parallel(images, media, videos, sprite, fonts, motion), // Added motion here
    gulp.parallel(styles, scripts), 
    markup 
);

// Define the Development Watcher
const watch = () => {
    // On Token Save: Convert -> Compile Styles -> Reload
    gulp.watch(config.paths.watch.tokens, gulp.series(tokens, styles, reload));
    
    // On Content Save (Notion Markdown): Parse -> Render -> Reload
    gulp.watch(config.paths.watch.content, gulp.series(content, markup, reload));

    // On Style Save: Lint -> Compile -> Reload
    gulp.watch('src/styles/**/*.scss', gulp.series(lintStyles, styles, reload));
    
    // On Script Save: Lint -> Bundle -> Reload
    gulp.watch('src/scripts/**/*.{ts,js}', gulp.series(lintScripts, scripts, reload));
    
    // On Pug Save: Lint -> Render -> Reload
    gulp.watch(['src/markup/**/*.pug', 'src/data/**/*.json'], gulp.series(lintPug, markup, reload));
    
    // Assets
    gulp.watch('src/assets/img/**/*', gulp.series(images, reload));
    gulp.watch('src/assets/icons/**/*', gulp.series(sprite, reload));
    
    // Motion Engine Watcher
    gulp.watch('src/assets/animation/**/*.{json,riv}', gulp.series(motion, reload));
};

// Aliases
const todo = generateTodo;

// Main Exported Tasks
export { 
    clean, styles, scripts, markup, images, media, videos, sprite, fonts, motion, 
    tokens, content, audit, release, todo, archive,
    build, lint 
};

// Default Task (Development)
export default gulp.series(build, gulp.parallel(server, watch));