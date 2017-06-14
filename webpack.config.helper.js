'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options) => {

    const GLOBALS = Object.assign({
        __DEV__: !options.isProduction, // signal for nodejs build process
        __VERSION__: JSON.stringify(require("./package.json").version), // Make package.json version available as a global variable
        __NAME__: JSON.stringify(require("./package.json").name), // Make package title version available as a global variable
        'process.env': {
            NODE_ENV: JSON.stringify(options.node_env)
        }
    }, options.globals);

    // extract style modules into a single file
    const ExtractSASS = new ExtractTextPlugin({
        filename: 'bundle.css'
    });

    // set of rules for building style modules
    // applies autoprefixer to handle cross-browser styling
    let cssModuleRule = [{
        loader: 'css-loader',
        options: {
            sourceMap: !options.isProduction,
            minimize: options.isProduction
        }
    }, {
        loader: 'postcss-loader',
        options: {
            sourceMap: !options.isProduction,
            plugins: (loader) => [
                require('autoprefixer')()
            ]
        }
    }, {
        loader: 'sass-loader',
        options: {
            sourceMap: !options.isProduction
        }
    }];

    // if in dev mode, use the style loader for hot style replacement
    // otherwise extract the styles into a file
    if (!options.isProduction) {
        cssModuleRule.unshift({
            loader: 'style-loader',
            options: { sourceMap: true }
        });
    } else {
        cssModuleRule = ExtractSASS.extract({ use: cssModuleRule });
    }

    // define the webpack config
    let webpackConfig = {
        devtool: options.devtool, // what kind of sourcemap to use
        entry: typeof options.entry != 'undefined' ? options.entry : ['./src/index'],
        target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
        output: {
            path: path.join(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
            publicPath: '/', // Location of static assets relative to server root. Basically your standard `static_path` config
            filename: 'bundle.js', // Output JS filename, imported in index.html
            sourcePrefix: '' // Required for Cesium loading since Cesium uses some multi-line strings in its code and webpack indents them improperly - https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/
        },
        plugins: [
            new webpack.DefinePlugin(GLOBALS),
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            ExtractSASS // All imported styles are separated out from bundle and moved into a styles.css file which can be loaded in parallel with JS bundle during app load (see https://github.com/webpack/extract-text-webpack-plugin/blob/webpack-1/README.md)
        ],
        resolve: {
            modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "assets"), "node_modules"], // Tell webpack to look for imports using these prefixes
            extensions: ['.jsx', '.scss', '.css', '.js', '.json', '.md'], // Tell webpack that these extensions are optionally specified in the import statements
            alias: {
                modernizr$: path.resolve(__dirname, "lib/modernizr/.modernizrrc.js")
            }
        },
        module: {
            unknownContextCritical: false, // Tells webpack to ignore some warnings due to the way Cesium dynamically builds module paths - https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/
            noParse: [path.join(__dirname, 'node_modules/proj4/dist/proj4.js')], // Tells webpack not to parse these files and expects these fles will have no require, define, or similar, but can use exports and module.exports. See https://webpack.github.io/docs/configuration.html#module-noparse
            rules: [{ // Standard ES6 compilation of JS through Babel
                test: /\.js$/,
                include: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules/ol'), path.join(__dirname, 'assets/assets/arc')],
                exclude: /Cesium(DrawHelper)?\.js$/,
                use: ['babel-loader', 'eslint-loader']
            }, { // Load Cesium.js main JS file using webpack script loader which will not attempt to parse anything in the script
                test: /Cesium(DrawHelper)?\.js$/,
                use: 'script-loader'
            }, { // Load all css and scss except react-toolbox with the style loader, generate sourcemaps and run everything through postCSS for autoprefixing
                test: /(\.css|\.scss)$/,
                exclude: path.join(__dirname, 'node_modules/react-toolbox'),
                use: cssModuleRule
            }, { // Load all react-toolbox css and scss css-loader, use postcss to apply future rules, apply our theme with sass-loader. Technique borrowed from: https://github.com/coryhouse/react-slingshot/pull/55
                test: /(\.css|\.scss)$/,
                include: path.join(__dirname, 'node_modules/react-toolbox'),
                use: ExtractSASS.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: options.isProduction,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('postcss-cssnext')()
                            ]
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            data: '@import "' + path.resolve(__dirname, 'src/styles/_theme.scss') + '";'
                        }
                    }]
                })
            }, { // Load all images, favicons, and fonts using the file-loader and output them into a directory named img with the original name and extensions.
                test: /\.(eot|woff|woff2|ttf|svg|gif|ico|png|jpe?g)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            }, { // use special modernizer-loader
                test: /\.modernizrrc.js$/,
                use: 'modernizr-loader'
            }, { // Load all markdown using the raw-loader
                test: /\.md|\.json$/,
                use: 'raw-loader'
            }]
        }
    };

    if (options.isProduction) {
        webpackConfig.plugins.push(
            new webpack.optimize.UglifyJsPlugin(), // Minimize scripts and css in output
            new webpack.optimize.DedupePlugin(), // remove duplicated modules
            new webpack.optimize.OccurrenceOrderPlugin()
        );
    } else {
        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin(), // Used for Browsersync
            new webpack.NoEmitOnErrorsPlugin() // do not attempt to produce a bundle if there was an error
        );
    }

    return webpackConfig;
};
