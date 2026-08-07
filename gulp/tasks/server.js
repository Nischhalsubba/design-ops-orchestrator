import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { config } from '../config.js';

const root = path.resolve(config.paths.dist.base);
let activeServer;

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif'
};

export const server = done => {
    if (activeServer) {
        done();
        return;
    }

    activeServer = http.createServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        const pathname = decodeURIComponent(url.pathname);
        const requestedPath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
        const filePath = path.resolve(root, `.${requestedPath}`);
        const relative = path.relative(root, filePath);

        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            response.writeHead(403);
            response.end('Forbidden');
            return;
        }

        fs.readFile(filePath, (error, body) => {
            if (error) {
                response.writeHead(error.code === 'ENOENT' ? 404 : 500);
                response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
                return;
            }

            response.writeHead(200, {
                'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
                'Cache-Control': 'no-store'
            });
            response.end(body);
        });
    });

    activeServer.listen(config.browsersync.port || 3000, '127.0.0.1', done);
};

// Builds still run on file changes. Automatic browser reload was intentionally
// removed with BrowserSync to eliminate its vulnerable UI dependency chain.
export const reload = done => done();
