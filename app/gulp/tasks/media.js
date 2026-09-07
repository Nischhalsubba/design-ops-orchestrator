import fs from 'node:fs/promises';
import path from 'node:path';
import gulp from 'gulp';
import sharp from 'sharp';
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

const writeVariant = async (source, destination, extension, width) => {
    const pipeline = sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true });

    if (extension === '.jpg' || extension === '.jpeg') {
        await pipeline.jpeg({ quality: 85, progressive: true }).toFile(destination);
        return;
    }

    await pipeline.png({ compressionLevel: 6 }).toFile(destination);
};

export const media = async () => {
    const files = (await walkFiles(imageSourceRoot)).filter((file) =>
        ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
    );

    await Promise.all(files.map(async (source) => {
        const relative = path.relative(imageSourceRoot, source);
        const destination = path.join(imageDistRoot, relative);
        const parsed = path.parse(destination);
        const extension = path.extname(source).toLowerCase();
        const metadata = await sharp(source).metadata();
        const widths = extension === '.png' ? [320, 768] : [320, 768, 1280];

        await fs.mkdir(parsed.dir, { recursive: true });
        await Promise.all(
            widths
                .filter((width) => !metadata.width || metadata.width >= width)
                .map((width) => writeVariant(
                    source,
                    path.join(parsed.dir, `${parsed.name}-${width}w${parsed.ext}`),
                    extension,
                    width
                ))
        );
    }));
};

export const videos = () => {
    // Designers should export optimized .mp4/.webm from After Effects/Premiere.
    return gulp.src('src/assets/video/**/*.{mp4,webm}')
        .pipe(gulp.dest('dist/assets/video'));
};
