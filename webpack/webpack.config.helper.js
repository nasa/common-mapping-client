/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

 "use strict";

 const path = require("path");
 const webpack = require("webpack");
 const HtmlWebpackPlugin = require("html-webpack-plugin");
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 const cssAutoPrefixPlugin = require('autoprefixer');

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

     // postCSS loader for applying autoprefixer
     const postCSSLoader = () => {
         return {
             loader: 'postcss-loader',
             options: {
                 postcssOptions: {
                     ident: 'postcss',
                     sourceMap: GLOBALS.__DEV__,
                     plugins: loader => [cssAutoPrefixPlugin()], // applies autoprefixer to handle cross-browser styling
                 },
             },
         };
     };

     // CSS loader for loading @import and url() in style files. "enableModules" parameter to enable/disable cssModules
     let cssLoader = enableModules => {
         return {
             loader: "css-loader",
             options: {
                 url: false,
                 modules: enableModules
                     ? {
                           localIdentName: '[name]__[local]___[hash:base64:5]',
                       }
                     : false,
                 importLoaders: 2,
                 sourceMap: GLOBALS.__DEV__
             }
         };
     };

     // SASS Loader for compiling SASS
     let sassLoader = {
         loader: "sass-loader",
         options: {
             sourceMap: GLOBALS.__DEV__
         }
     };

     // extract style modules into a single file
     const cssExtractor = new MiniCssExtractPlugin({
         filename: ({ chunk }) => `${chunk.name.replace('/js/', '/css/')}.css`,
     });

     let cssModuleRule = [MiniCssExtractPlugin.loader, cssLoader(true), postCSSLoader(), sassLoader];
     let inlineCSSModuleRule = [MiniCssExtractPlugin.loader, cssLoader(false), postCSSLoader(), sassLoader];

     // babel loader config
     const babelLoader = () => {
         const res = {
             loader: 'babel-loader',

             // In order to transform the sym-linked node_module packages the
             // options must be specified in the loader options.
             // https://github.com/babel/babel-loader/issues/149#issuecomment-417895085
             options: {
                 ignore: [/\/core-js/],
                 presets: [
                     [
                         '@babel/preset-env',
                         {
                             targets: GLOBALS.__DEV__ ? 'last 2 versions' : '> 0.5%, not dead',
                             useBuiltIns: 'entry',
                             shippedProposals: true,
                             corejs: 3,
                         },
                     ],
                     '@babel/react',
                 ],
                 plugins: [['@babel/plugin-proposal-class-properties', { loose: false }]],
                 sourceType: 'unambiguous',
             },
         };

         return res;
     };

     // define the webpack config
     let webpackConfig = {
         target: 'web',
         mode: !GLOBALS.__DEV__ ? "production" : "development",
         devtool: GLOBALS.__DEV__ ? 'eval-source-map' : false,
         optimization: {
             minimize: !GLOBALS.__DEV__
         },
         entry: {
             index:
                 typeof options.entry != "undefined"
                     ? options.entry
                     : [path.join(BASE_DIR, "src/index")], // Main index.js chunk
             inlineStyles: path.join(BASE_DIR, "src/styles/inlineStyles.js") // Inline style chunk
         },
         output: {
             path: path.join(BASE_DIR, "dist"), // Note: Physical files are only output by the production build task `npm run build`.
             filename: '[name].js',
         },
         devServer: {
             static: [path.resolve(BASE_DIR, 'dist'), path.resolve(BASE_DIR, 'assets'), path.resolve(BASE_DIR, 'src')],
             compress: true,
             port: 9000,
             hot: false,
         },
         plugins: [
             new webpack.DefinePlugin(GLOBALS),
             new CleanWebpackPlugin(),
             new HtmlWebpackPlugin({
                 title: "COVERAGE",
                 template: path.join(BASE_DIR, "src/index_template.html"),
                 filename: path.join(BASE_DIR, "dist/index.html"),
                 inject: false, // Do not auto inject js and css, we'll take care of that through templating for better control over asset positioning
                 // excludeChunks: ["inlineStyles"], // Don't include inlineStyles for templating purposes, we'll take care of that separately with our StyleExtHtmlWebpackPlugin
                 hash: true, // Append a query string + the webpack build hash onto the output js and css files for cache busting
                 minify: GLOBALS.__DEV__
                 ? false
                 : {
                       collapseWhitespace: true,
                       removeComments: true,
                       removeRedundantAttributes: true,
                       removeScriptTypeAttributes: true,
                       removeStyleLinkTypeAttributes: true,
                       useShortDoctype: true,
                       minifyCSS: true,
                   },
             }),
             cssExtractor,
         ],
         resolve: {
             modules: [path.join(BASE_DIR, "src"), path.join(BASE_DIR, "assets"), "node_modules"], // Tell webpack to look for imports using these prefixes
             extensions: [".js", ".jsx", ".json", ".scss", ".css", ".md"], // Tell webpack that these extensions are optionally specified in the import statements
             alias: {
                 modernizr$: path.join(BASE_DIR, "lib/modernizr/.modernizrrc")
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
                     resolve: { fullySpecified: false },
                     use: babelLoader()
                 },
                 {
                     // Load Cesium.js main JS file using webpack script loader which will not attempt to parse anything in the script
                     test: /\/Cesium(DrawHelper)?\.js$/,
                     use: "script-loader"
                 },
                 {
                     // Load our inline styles
                     test: path.join(BASE_DIR, "src/styles/inlineStyles.scss"),
                     use: inlineCSSModuleRule,
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
                                 insert: "head",
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
                     test: /\.modernizrrc.js$/,
                     use: "modernizr"
                 },
                 {
                     // Load all markdown using the raw-loader
                     test: /\.md$/,
                    //  exclude: [path.join(BASE_DIR, "node_modules/")],
                     use: "raw-loader"
                 },
                 {
                     // visjs loader
                     test: /node_modules[\\\/]vis[\\\/].*\.js$/,
                     use: babelLoader()
                 }
             ]
         }
     };

     // // optimize production build
     // if (options.node_env === "production") {
     //     webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
     // }

     // // enable tools for dev
     // if (options.node_env === "development") {
     //     webpackConfig.plugins.push(
     //         new webpack.HotModuleReplacementPlugin() // Used for Browsersync
     //     );
     // }

     // // Exclude inlineStyling from test builds
     // if (options.node_env !== "test") {
     //     webpackConfig.plugins.push(
     //         InternalCSS,
     //         new StyleExtHtmlWebpackPlugin({ file: "internal.css", position: "head-bottom" })
     //     );
     // }

     return webpackConfig;
 };
