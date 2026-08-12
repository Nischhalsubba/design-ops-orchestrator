import gulp from 'gulp';
import pa11y from 'pa11y';
import fancyLog from 'fancy-log';
import chalk from 'chalk';
import fs from 'fs';
import { config } from '../config.js';

// Accessibility Audit using Pa11y
export const auditA11y = async () => {
    fancyLog(chalk.cyan('Running Accessibility Audit (WCAG 2.1 AA)...'));
    
    // In a real scenario, we'd loop through dist/html files or start the server
    // For this demo, we assume localhost is running or check specific files
    try {
        const results = await pa11y('http://localhost:3000', {
            standard: 'WCAG2AA',
            runners: ['axe']
        });

        if (results.issues.length > 0) {
            fancyLog(chalk.red(`✘ Found ${results.issues.length} accessibility issues!`));
            results.issues.forEach(issue => {
                console.log(chalk.yellow(`[${issue.typeCode}] ${issue.message}`));
                console.log(chalk.gray(issue.selector));
            });
        } else {
            fancyLog(chalk.green('✔ No Accessibility Issues Found!'));
        }
        
        // Save Report
        if (!fs.existsSync(config.paths.dist.reports)) fs.mkdirSync(config.paths.dist.reports);
        fs.writeFileSync(`${config.paths.dist.reports}/a11y-report.json`, JSON.stringify(results, null, 2));

    } catch (error) {
        fancyLog(chalk.red('Make sure "npm start" is running before auditing!'));
    }
};

// Export combined audit
export const audit = gulp.series(auditA11y);