import { promises as fs } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import fancyLog from 'fancy-log';
import fm from 'front-matter';
import { globSync } from 'glob';
import MarkdownIt from 'markdown-it';
import { config } from '../config.js';

const md = new MarkdownIt();

export const content = async () => {
    const files = globSync(config.paths.src.content, { nodir: true });
    const articles = [];

    for (const file of files) {
        try {
            const source = await fs.readFile(file, 'utf8');
            const parsed = fm(source);
            articles.push({
                slug: path.basename(file, '.md'),
                title: parsed.attributes.title || 'Untitled',
                date: parsed.attributes.date || new Date(),
                tags: parsed.attributes.tags || [],
                html: md.render(parsed.body),
                ...parsed.attributes
            });
            fancyLog(chalk.blue(`Parsed content: ${path.basename(file)}`));
        } catch (error) {
            fancyLog(chalk.red(`Error parsing markdown: ${file}`));
            throw error;
        }
    }

    await fs.mkdir('src/data', { recursive: true });
    await fs.writeFile(
        'src/data/generated_content.json',
        JSON.stringify({ articles }, null, 2) + '\n',
        'utf8'
    );
};
