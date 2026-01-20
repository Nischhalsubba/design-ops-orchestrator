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
 * Built with DesignOps God-Tier Workflow
 */
`,
    paths: {
        src: {
            base: 'src',
            styles: 'src/styles/**/*.scss',
            scripts: 'src/scripts/**/*.{ts,js}',
            markup: 'src/markup/**/*.pug',
            data: 'src/data/*.json',
            images: 'src/assets/img/**/*',
            icons: 'src/assets/icons/*.svg',
            fonts: 'src/assets/fonts/**/*',
        },
        dist: {
            base: 'dist',
            css: 'dist/css',
            js: 'dist/js',
            html: 'dist',
            img: 'dist/assets/img',
            fonts: 'dist/assets/fonts',
            sprites: 'dist/assets/sprites'
        },
        watch: {
            styles: 'src/styles/**/*.scss',
            scripts: 'src/scripts/**/*.{ts,js}',
            markup: 'src/markup/**/*.pug',
            data: 'src/data/*.json',
        }
    },
    browsersync: {
        server: {
            baseDir: 'dist',
        },
        port: 3000,
        notify: false,
        open: false // Prevent opening new tabs constantly
    }
};