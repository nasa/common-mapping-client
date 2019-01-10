/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Karma configuration
const webpack = require("webpack");
const path = require("path");

process.env.CHROME_BIN = require("puppeteer").executablePath();

const webpackConfig = require("./webpack/webpack.config.helper")({
    isProduction: false,
    node_env: "test",
    devtool: "inline-source-map",
    globals: {
        NO_WEB_GL: JSON.stringify(process.env.npm_config_nowebgl),
        INCLUDE_CORE_TESTS: JSON.stringify(process.env.npm_config_includecoretests)
    }
});

const packageConfig = require("./package.json");

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha"],

        // list of files / patterns to load in the browser
        files: [
            "src/tests/**/*.spec.js",
            "./node_modules/es6-promise/dist/es6-promise.js",
            {
                pattern: "src/_core/tests/data/**/*",
                included: false,
                served: true
            }
        ],

        proxies: {
            "/default-data": "http://localhost:9876/base/src/_core/tests/data"
        },

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // add webpack as preprocessor
            "src/tests/**/*.spec.js": ["webpack"]
        },

        webpack: {
            devtool: webpackConfig.devtool,
            resolve: webpackConfig.resolve,
            plugins: webpackConfig.plugins,
            module: webpackConfig.module
        },

        webpackServer: {
            stats: "errors-only",
            noInfo: true
        },

        browserNoActivityTimeout: 60000,
        browserDisconnectTolerance: 1,
        browserDisconnectTimeout: 20000,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "coverage", "html", "junit"],

        htmlReporter: {
            outputFile: "test-results/index.html",
            pageTitle: packageConfig.name,
            subPageTitle: packageConfig.version,
            useCompactStyle: true,
            useLegacyStyle: true
        },

        coverageReporter: {
            dir: "test-results",
            reporters: [{ type: "lcov", subdir: "report" }]
        },

        junitReporter: {
            outputDir: "test-results/junit",
            outputFile: "test-results-junit.xml",
            useBrowserName: false
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: process.env.npm_config_nowebgl === "true" ? ["ChromeHeadless"] : ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: !process.env.npm_config_watch,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
