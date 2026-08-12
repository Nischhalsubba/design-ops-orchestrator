import browserSync from 'browser-sync';
import { config } from '../config.js';

const bs = browserSync.create();

export const server = (done) => {
    bs.init(config.browsersync);
    done();
};

export const reload = (done) => {
    bs.reload();
    done();
};