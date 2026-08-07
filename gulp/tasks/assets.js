import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import gulp from 'gulp';
import { globSync } from 'glob';
import sharp from 'sharp';
import svgSprite from 'gulp-svg-sprite';
import { config } from '../config.js';

const imageSourceRoot = path.resolve(config.paths.src.base, 'assets/img');
const rasterExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.tif', '.tiff']);

// Preserve originals and generate WebP/AVIF with Sharp, avoiding legacy
// download/decompress wrappers used by older Gulp image plugins.
export const images = async () => {
    const files = globSync(config.paths.src.images, { nodir: true });

    await Promise.all(files.map(async file => {
        const absoluteFile = path.resolve(file);
        const relativePath = path.relative(imageSourceRoot, absoluteFile);
        const originalOutput = path.join(config.paths.dist.img, relativePath);

        await fs.mkdir(path.dirname(originalOutput), { recursive: true });
        await fs.copyFile(absoluteFile, originalOutput);

        const extension = path.extname(relativePath).toLowerCase();
        if (!rasterExtensions.has(extension)) {
            return;
        }

        const outputBase = originalOutput.slice(0, -extension.length);
        await Promise.all([
            sharp(absoluteFile, { animated: true })
                .webp({ quality: 82 })
                .toFile(`${outputBase}.webp`),
            sharp(absoluteFile, { animated: true })
                .avif({ quality: 50 })
                .toFile(`${outputBase}.avif`)
        ]);
    }));
};

export const sprite = () => {
    if (!existsSync(path.resolve(config.paths.src.base, 'assets/icons'))) {
        return Promise.resolve();
    }

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
    if (!existsSync(path.resolve(config.paths.src.base, 'assets/fonts'))) {
        return Promise.resolve();
    }

    return gulp.src(config.paths.src.fonts)
        .pipe(gulp.dest(config.paths.dist.fonts));
};
