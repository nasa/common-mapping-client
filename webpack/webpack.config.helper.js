/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

"use strict";

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");

const BASE_DIR = path.resolve("./");

module.exports = options => {
    const GLOBALS = Object.assign(
        {
            __DEV__: !options.isProduction, // signal for nodejs build process
            __VERSION__: JSON.stringify(require(path.join(BASE_DIR, "package.json")).version), // Make package.json version available as a global variable
            __NAME__: JSON.stringify(require(path.join(BASE_DIR, "package.json")).name), // Make package title version available as a global variable
            "process.env": {
                NODE_ENV: JSON.stringify(options.node_env)
            }
        },
        options.globals
    );

    // extract style modules into a single file
    const ExtractStyles = new ExtractTextPlugin({ filename: "bundle.css" });

    // extract inline css files
    const InternalCSS = new ExtractTextPlugin({ filename: "internal.css" });

    // define set of rules for building style modules

    // postCSS loader for applying autoprefixer
    let postCSSLoader = {
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            sourceMap: !options.isProduction,
            plugins: loader => [require("autoprefixer")()] // applies autoprefixer to handle cross-browser styling
        }
    };

    // CSS loader for loading @import and url() in style files. "enableModules" parameter to enable/disable cssModules
    let cssLoader = enableModules => {
        return {
            loader: "css-loader",
            options: {
                url: false,
                modules: enableModules,
                importLoaders: 2,
                localIdentName: "[name]__[local]___[hash:base64:5]",
                sourceMap: !options.isProduction
            }
        };
    };

    // SASS Loader for compiling SASS
    let sassLoader = {
        loader: "sass-loader",
        options: {
            ident: "sass",
            sourceMap: !options.isProduction
        }
    };

    let cssModuleRule = [cssLoader(true), postCSSLoader, sassLoader];

    // Configure the files to exclude from Istanbul code coverage
    // If we're not passed the INCLUDE_CORE_TESTS env variable we want to
    // ignore _core files in code coverage
    let istanbulExclusions = ["**/*.spec.js", "src/lib/*", "src/_core/tests/data/*"];
    if (options.globals && !JSON.parse(options.globals.INCLUDE_CORE_TESTS)) {
        istanbulExclusions.push("src/_core/*");
    }
    let babelPlugins =
        options.node_env !== "test"
            ? []
            : [
                  [
                      "istanbul",
                      {
                          exclude: istanbulExclusions
                      }
                  ]
              ];

    // if in dev mode, use the style loader for hot style replacement
    // otherwise extract the styles into a file
    if (!options.isProduction) {
        cssModuleRule.unshift({
            loader: "style-loader",
            options: {
                sourceMap: true,
                insertInto: "body"
            }
        });
    } else {
        cssModuleRule = ExtractStyles.extract({ use: cssModuleRule });
    }

    // define the webpack config
    let webpackConfig = {
        mode: options.isProduction ? "production" : "development",
        devtool: options.devtool, // what kind of sourcemap to use
        optimization: {
            minimize: options.isProduction
        },
        entry: {
            index:
                typeof options.entry != "undefined"
                    ? options.entry
                    : [path.join(BASE_DIR, "src/index")], // Main index.js chunk
            inlineStyles: path.join(BASE_DIR, "src/styles/inlineStyles.js") // Inline style chunk
        },
        target: "web", // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
        output: {
            path: path.join(BASE_DIR, "dist"), // Note: Physical files are only output by the production build task `npm run build`.
            publicPath: "", // Location of static assets relative to server root. Basically your standard `static_path` config
            sourcePrefix: "" // Required for Cesium loading since Cesium uses some multi-line strings in its code and webpack indents them improperly - https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/
        },
        plugins: [
            new webpack.DefinePlugin(GLOBALS),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: path.join(BASE_DIR, "src/index_template.html"),
                inject: false, // Do not auto inject js and css, we'll take care of that through templating for better control over asset positioning
                isProduction: options.isProduction,
                excludeChunks: ["inlineStyles"], // Don't include inlineStyles for templating purposes, we'll take care of that separately with our StyleExtHtmlWebpackPlugin
                hash: true // Append a query string + the webpack build hash onto the output js and css files for cache busting
            }),
            new webpack.NoEmitOnErrorsPlugin(), // do not attempt to produce a bundle if there was an error
            ExtractStyles // All imported styles are separated out from bundle and moved into a styles.css file which can be loaded in parallel with JS bundle during app load (see https://github.com/webpack/extract-text-webpack-plugin/blob/webpack-1/README.md)
        ],
        resolve: {
            modules: [path.join(BASE_DIR, "src"), path.join(BASE_DIR, "assets"), "node_modules"], // Tell webpack to look for imports using these prefixes
            extensions: [".js", ".jsx", ".json", ".scss", ".css", ".md"], // Tell webpack that these extensions are optionally specified in the import statements
            alias: {
                modernizr$: path.join(BASE_DIR, "lib/modernizr/.modernizrrc.js")
            }
        },
        module: {
            unknownContextCritical: false, // Tells webpack to ignore some warnings due to the way Cesium dynamically builds module paths - https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/
            rules: [
                {
                    // Standard ES6 compilation of JS through Babel
                    test: /\.js$/,
                    include: [
                        path.join(BASE_DIR, "src"),
                        path.join(BASE_DIR, "node_modules/ol"),
                        path.join(BASE_DIR, "assets/assets/arc")
                    ],
                    exclude: /\/Cesium(DrawHelper)?\.js$/,
                    use: [
                        {
                            loader: "babel-loader",
                            query: {
                                plugins: babelPlugins
                            }
                        },
                        "eslint-loader"
                    ]
                },
                {
                    // Load Cesium.js main JS file using webpack script loader which will not attempt to parse anything in the script
                    test: /\/Cesium(DrawHelper)?\.js$/,
                    use: "script-loader"
                },
                {
                    // Load our inline styles
                    test: path.join(BASE_DIR, "src/styles/inlineStyles.scss"),
                    use: InternalCSS.extract([cssLoader(false), postCSSLoader, sassLoader])
                },
                {
                    // Load our app styles through our main cssModule rules
                    test: /\.(css|scss)$/,
                    exclude: [
                        path.join(BASE_DIR, "src/styles/inlineStyles.scss"),
                        path.join(BASE_DIR, "node_modules/")
                    ], // Ignore inlineStyles and node_modules
                    use: cssModuleRule
                },
                {
                    // Load our external node_modules styles through standard css loader
                    test: /\.css$/,
                    include: [path.join(BASE_DIR, "node_modules/")],
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                sourceMap: !options.isProduction,
                                insertInto: "body",
                                insertAt: "top"
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: !options.isProduction
                            }
                        }
                    ]
                },
                {
                    // Load all images, favicons, and fonts using the file-loader and output them into a directory named img with the original name and extensions.
                    test: /\.(eot|woff|woff2|ttf|svg|gif|ico|png|jpe?g)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "img/[name].[ext]"
                            }
                        }
                    ]
                },
                {
                    // use special modernizer-loader
                    test: /\.modernizrrc.js$/,
                    use: "modernizr-loader"
                },
                {
                    // Load all markdown using the raw-loader
                    test: /\.(md)$/,
                    exclude: [path.join(BASE_DIR, "node_modules/")],
                    use: "raw-loader"
                },
                {
                    // visjs loader
                    test: /node_modules[\\\/]vis[\\\/].*\.js$/,
                    loader: "babel-loader"
                }
            ]
        }
    };

    // optimize production build
    if (options.node_env === "production") {
        webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    }

    // enable tools for dev
    if (options.node_env === "development") {
        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin() // Used for Browsersync
        );
    }

    // Exclude inlineStyling from test builds
    if (options.node_env !== "test") {
        webpackConfig.plugins.push(
            InternalCSS,
            new StyleExtHtmlWebpackPlugin({ file: "internal.css", position: "head-bottom" })
        );
    }

    return webpackConfig;
};
