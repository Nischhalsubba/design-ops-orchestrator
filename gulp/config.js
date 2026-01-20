const isProduction = process.argv.includes('--production');

export const config = {
    isProduction,
    paths: {
        src: {
            base: 'src',
            styles: 'src/styles/**/*.scss',
            scripts: 'src/scripts/main.ts',
            markup: 'src/markup/pages/*.pug',
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
        open: true
    }
};