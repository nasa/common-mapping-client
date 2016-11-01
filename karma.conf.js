// Karma configuration
// Generated on Wed Jun 22 2016 10:25:33 GMT-0700 (PDT)
var webpack = require('webpack');
var path = require('path');
// const GLOBALS = {
//     'process.env.NODE_ENV': JSON.stringify('development'),
//     __DEV__: true
// };

// if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.stringify('test')

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
            'src/tests/**/*.spec.js',
            'src/_core/tests/**/*.spec.js',
            './node_modules/es6-promise/dist/es6-promise.js', {
                pattern: "src/_core/tests/data/*",
                included: false,
                served: true
            }
        ],

        proxies: {
            '/default-data': 'http://localhost:9876/base/src/_core/tests/data'
        },

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // add webpack as preprocessor
            'src/tests/**/*.spec.js': ['webpack'],
            'src/_core/tests/**/*.spec.js': ['webpack']
        },

        webpack: {
            devtool: 'inline-source-map', //just do inline source maps instead of the default
            debug: false,
            noInfo: true, // set to false to see a list of every file being bundled.
            resolve: {
                modulesDirectories: ["src", "node_modules"],
                extensions: ['', '.jsx', '.scss', '.css', '.js', '.json', '.md']
            },
            module: {
                noParse: [path.join(__dirname, 'node_modules/openlayers/dist/ol.js')],
                loaders: [
                    { test: /\.js$/, include: path.join(__dirname, 'src'), exclude: path.join(__dirname, 'src/lib'), loaders: ['babel', 'eslint'] },
                    { test: /\.js$/, include: path.join(__dirname, 'src/lib/arc'), loaders: ['babel', 'eslint'] },
                    { test: /Cesium\.js$/, loader: 'script' },
                    { test: /CesiumDrawHelper\.js$/, loader: 'script' },
                    { test: /\.(jpe?g|png|gif|svg)$/i, loaders: ['file'] },
                    { test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
                    { test: /(\.css|\.scss)$/, exclude: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
                    { test: /(\.css|\.scss)$/, include: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox'] },
                    { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'file-loader?name=[name].[ext]' },
                    { test: /\.md$/, loader: 'raw-loader' }
                ]
            }
        },

        webpackServer: {
            stats: 'errors-only',
            noInfo: true
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'coverage',
            subdir: '.'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        // colors: true,
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // logLevel: config.LOG_DISABLE,
        // logLevel: config.LOG_DEBUG,
        // logLevel: config.LOG_DEBUG,
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['PhantomJS'],
        // browsers: ['PhantomJS','Chrome'],
        browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],

        // Custom launcher for headless CI testing (Travis)
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox', "--enable-webgl", "--ignore-gpu-blacklist"]
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
