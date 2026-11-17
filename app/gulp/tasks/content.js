import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import { config } from '../config.js';

const md = new MarkdownIt();

function markdownFiles(root) {
    if (!fs.existsSync(root)) return [];

    return fs.readdirSync(root, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => path.join(entry.parentPath ?? entry.path ?? root, entry.name))
        .sort();
}

export const content = async () => {
    const articles = [];
    const contentRoot = path.resolve('src/ingest/content');

    for (const filePath of markdownFiles(contentRoot)) {
        try {
            const source = fs.readFileSync(filePath, 'utf8');
            const parsed = fm(source);
            const html = md.render(parsed.body);

            articles.push({
                slug: path.basename(filePath, '.md'),
                title: parsed.attributes.title || 'Untitled',
                date: parsed.attributes.date || null,
                tags: parsed.attributes.tags || [],
                html,
                ...parsed.attributes,
            });

            fancyLog(chalk.blue(`Parsed content: ${path.basename(filePath)}`));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Unable to parse content file ${filePath}: ${message}`);
        }
    }

    const outputDirectory = path.resolve(config.paths.generated.content);
    const outputFile = path.join(outputDirectory, 'generated_content.json');
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(outputFile, `${JSON.stringify({ articles }, null, 2)}\n`, 'utf8');
    fancyLog(chalk.blue(`Generated content index with ${articles.length} article(s).`));
};
