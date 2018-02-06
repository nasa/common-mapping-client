/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// This file configures the development web server
// which supports hot reloading and synchronized testing.

// Require Browsersync along with webpack and middleware for it
import browserSync from "browser-sync";
// Required for react-router browserHistory
// see https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-102623643
import historyApiFallback from "connect-history-api-fallback";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../webpack/webpack.config.dev";

const bundler = webpack(config);

// Run Browsersync and use middleware for Hot Module Replacement
browserSync({
    notify: false,
    server: {
        baseDir: ["dist", "src", "assets"],
        middleware: [
            webpackDevMiddleware(bundler, {
                // Dev middleware can't access config, so we provide publicPath
                publicPath: config.output.publicPath,
                stats: {
                    assets: false,
                    colors: true,
                    version: false,
                    hash: false,
                    timings: false,
                    modules: false,
                    chunks: false,
                    chunkModules: false
                }

                // for other settings see
                // http://webpack.github.io/docs/webpack-dev-middleware.html
            }),

            // bundler should be the same as above
            webpackHotMiddleware(bundler),

            historyApiFallback()
        ]
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: ["src/*.html"]
});
