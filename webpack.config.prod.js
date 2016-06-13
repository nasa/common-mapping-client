import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false
};

export default {
    debug: true,
    devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    noInfo: true, // set to false to see a list of every file being bundled.
    entry: './src/index',
    target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
        path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin(GLOBALS), //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
        new ExtractTextPlugin('styles.css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        extensions: ['', '.jsx', '.scss', '.css', '.js', '.json']
    },
    module: {
        loaders: [
            { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel', 'eslint'], exclude: path.join(__dirname, 'src/lib') },
            { test: /\.(jpe?g|png|gif|svg)$/i, loaders: ['file'] },
            { test: /Cesium\.js$/, loader: 'script' },
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]' }, {
                test: /(\.css|\.scss)$/,
                include: path.join(__dirname, 'src'),
                loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap")
            }, {
                test: /(\.css|\.scss)$/,
                include: path.join(__dirname, 'node_modules/react-toolbox'),
                loader: ExtractTextPlugin.extract('css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox')
            }
        ]
    },
    toolbox: { theme: path.join(__dirname, 'src/styles/material_ui_theme.scss') }
}
