import webpack from 'webpack';
import path from 'path';

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __VERSION__: JSON.stringify(require("./package.json").version), // Make package.json version available as a global variable in CMC, used in appConfig.js
    __DEV__: true
};

export default {
    debug: true,
    // SOURCE MAP ISSUE AS OF 10/24/16 see https://github.com/webpack/webpack/issues/2145, HAVE TO USE EVAL-SOURCE-MAP FOR NOW EVEN THOUGH SLIGHTLY SLOWER
    // devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'eval-source-map', // what kind of sourcemap to use (usually changed for production version)
    noInfo: true, // set to false to see a list of every file being bundled.
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/index'
    ],
    target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
        path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/', // Location of static assets relative to server root. Basically your standard `static_path` config
        filename: 'bundle.js', // Output JS filename, imported in index.html
        sourcePrefix: '' // Required for Cesium loading since Cesium uses some multi-line strings in its code and webpack indents them improperly - https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/
    },
    plugins: [
        new webpack.DefinePlugin(GLOBALS), // Tells React to build in dev mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin());
        new webpack.HotModuleReplacementPlugin(), // Used for Browsersync
        new webpack.NoErrorsPlugin() 
    ],
    resolve: {
        modulesDirectories: ["src", "assets", "node_modules"], // Tell webpack to look for imports using these prefixes
        extensions: ['', '.jsx', '.scss', '.css', '.js', '.json', '.md'] // Tell webpack that these extensions are optionally specified in the import statements
    },
    module: {
        unknownContextCritical: false, // Tells webpack to ignore some warnings due to the way Cesium dynamically builds module paths - https://cesiumjs.org/2016/01/26/Cesium-and-Webpack/
        noParse: [path.join(__dirname, 'node_modules/openlayers/dist/ol.js'), path.join(__dirname, 'node_modules/proj4/dist/proj4.js')], // Tells webpack not to parse these files and expects these fles will have no require, define, or similar, but can use exports and module.exports. See https://webpack.github.io/docs/configuration.html#module-noparse
        loaders: [
            { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel', 'eslint'] }, // Standard ES6 compilation of JS through Babel
            { test: /\.js$/, include: path.join(__dirname, 'assets/assets/arc'), loaders: ['babel', 'eslint'] }, // Compile arcJS library in assets through Babel
            { test: /Cesium\.js$/, loader: 'script' }, // Load Cesium.js main JS file using webpack script loader which will not attempt to parse anything in the script
            { test: /CesiumDrawHelper\.js$/, loader: 'script' }, // Load CesiumDrawHelper using webpack script loader which will not attempt to parse anything in the script
            { test: /(\.css|\.scss)$/, exclude: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap', 'postcss-loader', 'sass?sourceMap'] }, // Load all css and scss except react-toolbox with the style loader, generate sourcemaps and run everything through postCSS for autoprefixing
            { test: /(\.css|\.scss)$/, include: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox'] }, // Load all react-toolbox css and scss with the style loader, generate sourcemaps and run everything through postCSS for autoprefixing. This uses loader magic, see https://github.com/coryhouse/react-slingshot/pull/55
            { test: /\.(eot|woff|woff2|ttf|svg|gif|ico|png|jpe?g)$/, loader: 'file-loader?name=img/[name].[ext]' }, // Load all images, favicons, and fonts using the file-loader and output them into a directory named img with the original name and extensions.
            { test: /\.md|\.json$/, loader: 'raw-loader' } // Load all markdown using the raw-loader
        ]
    },
    toolbox: { theme: path.join(__dirname, 'src/styles/_theme.scss') }, // Used by the react-toolbox style loader above
    postcss: () => {
        return [
            require('autoprefixer') // Autoprefix CSS
        ];
    }
};
