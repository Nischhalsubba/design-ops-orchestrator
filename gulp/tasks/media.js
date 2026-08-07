import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { globSync } from 'glob';
import gulp from 'gulp';
import sharp from 'sharp';

const imageSourceRoot = path.resolve('src/assets/img');
const imageDestinationRoot = path.resolve('dist/assets/img');

const responsiveWidths = {
    '.jpg': [320, 768, 1280],
    '.jpeg': [320, 768, 1280],
    '.png': [320, 768]
};

export const media = async () => {
    const files = globSync('src/assets/img/**/*.{jpg,jpeg,png}', { nodir: true });

    await Promise.all(files.flatMap(file => {
        const absoluteFile = path.resolve(file);
        const relativePath = path.relative(imageSourceRoot, absoluteFile);
        const extension = path.extname(relativePath).toLowerCase();
        const widths = responsiveWidths[extension] ?? [];
        const relativeBase = relativePath.slice(0, -extension.length);

        return widths.map(async width => {
            const destination = path.join(
                imageDestinationRoot,
                `${relativeBase}-${width}w${extension}`
            );
            await fs.mkdir(path.dirname(destination), { recursive: true });

            const pipeline = sharp(absoluteFile).resize({ width, withoutEnlargement: true });
            if (extension === '.png') {
                await pipeline.png({ compressionLevel: 6 }).toFile(destination);
            } else {
                await pipeline.jpeg({ quality: 85, progressive: true }).toFile(destination);
            }
        });
    }));
};

export const videos = () => {
    if (!existsSync('src/assets/video')) {
        return Promise.resolve();
    }

    return gulp.src('src/assets/video/**/*.{mp4,webm}')
        .pipe(gulp.dest('dist/assets/video'));
};
