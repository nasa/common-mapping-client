// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import compress from 'compression';
import historyApiFallback from 'connect-history-api-fallback';

// Run Browsersync
browserSync({
    port: 3000,
    ghostMode: false,
    notify: false,
    ui: false,
    server: {
        baseDir: ['dist']
    },

    files: [
        'src/*.html'
    ],

    middleware: [historyApiFallback(), compress()]
});
