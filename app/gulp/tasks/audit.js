import fs from 'node:fs/promises';
import gulp from 'gulp';
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import { config } from '../config.js';

export const auditA11y = async () => {
    fancyLog(chalk.cyan('Running accessibility audit (WCAG 2.1 AA)...'));

    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        const results = await new AxePuppeteer(page)
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        await fs.mkdir(config.paths.dist.reports, { recursive: true });
        await fs.writeFile(
            `${config.paths.dist.reports}/a11y-report.json`,
            `${JSON.stringify(results, null, 2)}\n`
        );

        if (results.violations.length > 0) {
            fancyLog(chalk.red(`Found ${results.violations.length} accessibility violations.`));
            for (const violation of results.violations) {
                console.log(chalk.yellow(`[${violation.impact || 'unknown'}] ${violation.help}`));
                for (const node of violation.nodes) console.log(chalk.gray(node.target.join(', ')));
            }
            throw new Error('Accessibility audit failed');
        }

        fancyLog(chalk.green('No WCAG 2.1 A/AA violations found.'));
    } finally {
        await browser.close();
    }
};

export const audit = gulp.series(auditA11y);
