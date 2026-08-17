import fs from 'node:fs/promises';
import path from 'node:path';
import gulp from 'gulp';
import sharp from 'sharp';
import svgSprite from 'gulp-svg-sprite';
import { config } from '../config.js';

const imageSourceRoot = path.resolve(config.paths.src.base, 'assets/img');
const imageDistRoot = path.resolve(config.paths.dist.img);

const walkFiles = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const target = path.join(directory, entry.name);
        return entry.isDirectory() ? walkFiles(target) : [target];
    }));
    return files.flat();
};

const optimizeOriginal = async (source, destination, extension) => {
    const pipeline = sharp(source).rotate();
    if (extension === '.jpg' || extension === '.jpeg') {
        await pipeline.jpeg({ quality: 85, progressive: true }).toFile(destination);
        return;
    }
    await pipeline.png({ compressionLevel: 9 }).toFile(destination);
};

// The Visual Engine
export const images = async () => {
    await fs.mkdir(imageDistRoot, { recursive: true });
    const files = await walkFiles(imageSourceRoot);

    await Promise.all(files.map(async (source) => {
        const relative = path.relative(imageSourceRoot, source);
        const destination = path.join(imageDistRoot, relative);
        const extension = path.extname(source).toLowerCase();
        const parsed = path.parse(destination);

        await fs.mkdir(parsed.dir, { recursive: true });

        if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
            await fs.copyFile(source, destination);
            return;
        }

        await Promise.all([
            optimizeOriginal(source, destination, extension),
            sharp(source).rotate().webp({ quality: 82 }).toFile(path.join(parsed.dir, `${parsed.name}.webp`)),
            sharp(source).rotate().avif({ quality: 60 }).toFile(path.join(parsed.dir, `${parsed.name}.avif`)),
        ]);
    }));
};

export const sprite = () => {
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
    return gulp.src(config.paths.src.fonts)
        .pipe(gulp.dest(config.paths.dist.fonts));
};
