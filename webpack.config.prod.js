import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VERSION__: JSON.stringify(require("./package.json").version), // Make package.json version available as a global variable in CMC, used in appConfig.js
    __DEV__: false
};

export default {
    debug: true,
    // devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    noInfo: true, // set to false to see a list of every file being bundled.
    entry: './src/index', // Entry point of the application (index.html)
    target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
        path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/', // Location of static assets relative to server root. Basically your standard `static_path` config
        filename: 'bundle.js' // Output JS filename, imported in index.html
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(), // Tell webpack to optimize id name length in your minified JS by occurence (see https://github.com/webpack/docs/wiki/optimization)
        new webpack.DefinePlugin(GLOBALS), //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
        new ExtractTextPlugin('styles.css'),  // All imported styles are separated out from bundle and moved into a styles.css file which can be loaded in parallel with JS bundle during app load (see https://github.com/webpack/extract-text-webpack-plugin/blob/webpack-1/README.md)
        new webpack.optimize.DedupePlugin(), // Tell webpack to find and remove duplicate module dependencies from minified code bundle
        new webpack.optimize.UglifyJsPlugin() // Minimize scripts and css in output
    ],
    resolve: {
        modulesDirectories: ["src", "assets", "node_modules"],
        extensions: ['', '.jsx', '.scss', '.css', '.js', '.json', '.md']
    },
    module: {
        loaders: [
            { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel', 'eslint'], exclude: path.join(__dirname, 'src/lib') }, // Standard ES6 compilation of JS through Babel, run past ESLint
            { test: /\.js$/, include: path.join(__dirname, 'assets/assets/arc'), loaders: ['babel', 'eslint'] }, // Compile arcJS library in assets through Babel, run past ESLint
            { test: /Cesium\.js$/, loader: 'script' }, // Load Cesium.js main JS file using webpack script loader which will not attempt to parse anything in the script
            { test: /CesiumDrawHelper\.js$/, loader: 'script' }, // Load CesiumDrawHelper using webpack script loader which will not attempt to parse anything in the script
            { test: /(\.css|\.scss)$/, exclude: path.join(__dirname, 'node_modules/react-toolbox'), loader: ExtractTextPlugin.extract('css!postcss-loader!sass') }, // Load all css and scss except react-toolbox with the style loader, generate sourcemaps and run everything through postCSS for autoprefixing
            { test: /(\.css|\.scss)$/, include: path.join(__dirname, 'node_modules/react-toolbox'), loader: ExtractTextPlugin.extract('css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox') }, // Load all react-toolbox css and scss with the style loader, generate sourcemaps and run everything through postCSS for autoprefixing. This uses loader magic, see https://github.com/coryhouse/react-slingshot/pull/55
            { test: /\.(eot|woff|woff2|ttf|svg|gif|ico|png|jpe?g)$/, loader: 'file-loader?name=img/[name].[ext]' }, // Load all images, favicons, and fonts using the file-loader and output them into a directory named img with the original name and extensions.
            { test: /\.md|\.json$/, loader: "raw-loader" } // Load all markdown using the raw-loader
        ]
    },
    toolbox: { theme: path.join(__dirname, 'src/styles/_theme.scss') }, // Used by the react-toolbox style loader above
    postcss: () => {
        return [
            require('autoprefixer') // Autoprefix CSS
        ];
    }
}
