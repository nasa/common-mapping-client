import webpack from 'webpack';
import path from 'path';
// import raw from 'raw-loader';

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: true
};


export default {
    debug: true,
    // SOURCE MAP ISSUE AS OF 10/24/16 see https://github.com/webpack/webpack/issues/2145, HAVE TO USE INLINE-SOURCE-MAP FOR NOW EVEN THOUGH SLIGHTLY SLOWER
    // devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',
    noInfo: true, // set to false to see a list of every file being bundled.
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/index'
    ],
    target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
        path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js',
        sourcePrefix: ''
    },
    plugins: [
        new webpack.DefinePlugin(GLOBALS), //Tells React to build in dev mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin());
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.jsx', '.scss', '.css', '.js', '.json', '.md']
    },
    module: {
        unknownContextCritical: false,
        noParse: [path.join(__dirname, 'node_modules/openlayers/dist/ol.js'), path.join(__dirname, 'node_modules/proj4/dist/proj4.js')],
        loaders: [
            { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel', 'eslint'], exclude: path.join(__dirname, 'src/lib') },
            { test: /\.js$/, include: path.join(__dirname, 'src/lib/arc'), loaders: ['babel', 'eslint'] },
            { test: /Cesium\.js$/, loader: 'script' },
            { test: /DrawHelper\.js$/, loader: 'script' },
            { test: /\.(jpe?g|png|gif|svg)$/i, loaders: ['file'] },
            { test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /(\.css|\.scss)$/, exclude: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
            { test: /(\.css|\.scss)$/, include: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox'] },
            // { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'url-loader?limit=30000&name=[name].[ext]' },
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /\.md$/, loader: "raw-loader" }
        ]
    },
    toolbox: { theme: path.join(__dirname, 'src/styles/_theme.scss') }
};
