const isProduction = process.argv.includes('--production');

export const config = {
    isProduction,
    banner: `/**
 * <%= pkg.name %> - <%= pkg.description %>
 * @version v<%= pkg.version %>
 * @link <%= pkg.author %>
 * @license <%= pkg.license %>
 * 
 * Generated on: ${new Date().toISOString()}
 * Built with DesignOps Giga Workflow
 */
`,
    paths: {
        src: {
            base: 'src',
            tokens: 'src/tokens/*.json', 
            // New Content Pipeline (Notion/Docs)
            content: 'src/ingest/content/**/*.md', 
            styles: 'src/styles/**/*.scss',
            scripts: 'src/scripts/**/*.{ts,js}',
            markup: 'src/markup/**/*.pug',
            data: 'src/data/*.json',
            images: 'src/assets/img/**/*',
            icons: 'src/assets/icons/*.svg',
            fonts: 'src/assets/fonts/**/*',
            // Expanded Motion Support
            animations: 'src/assets/animation/**/*.{json,riv}',
        },
        dist: {
            base: 'dist',
            css: 'dist/css',
            js: 'dist/js',
            html: 'dist',
            img: 'dist/assets/img',
            fonts: 'dist/assets/fonts',
            sprites: 'dist/assets/sprites',
            animations: 'dist/assets/animation',
            reports: 'reports' // New folder for Lighthouse/Axe reports
        },
        generated: {
            tokens: 'src/styles/abstracts',
            content: 'src/data' // Where Markdown becomes JSON
        },
        watch: {
            tokens: 'src/tokens/*.json',
            content: 'src/ingest/content/**/*.md',
            styles: 'src/styles/**/*.scss',
            scripts: 'src/scripts/**/*.{ts,js}',
            markup: 'src/markup/**/*.pug',
            data: 'src/data/*.json',
            animations: 'src/assets/animation/**/*.{json,riv}'
        }
    },
    browsersync: {
        server: {
            baseDir: 'dist',
        },
        port: 3000,
        notify: false,
        open: false
    }
};