import webpack from 'webpack';
import path from 'path';

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __VERSION__: JSON.stringify(require("./package.json").version),
    __DEV__: true
};

export default {
    debug: true,
    // SOURCE MAP ISSUE AS OF 10/24/16 see https://github.com/webpack/webpack/issues/2145, HAVE TO USE EVAL-SOURCE-MAP FOR NOW EVEN THOUGH SLIGHTLY SLOWER
    // devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'eval-source-map',
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
        modulesDirectories: ["src", "assets", "node_modules"],
        extensions: ['', '.jsx', '.scss', '.css', '.js', '.json', '.md']
    },
    module: {
        unknownContextCritical: false,
        noParse: [path.join(__dirname, 'node_modules/openlayers/dist/ol.js'), path.join(__dirname, 'node_modules/proj4/dist/proj4.js')],
        loaders: [
            { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel', 'eslint'] },
            { test: /\.js$/, include: path.join(__dirname, 'assets/assets/arc'), loaders: ['babel', 'eslint'] },
            { test: /Cesium\.js$/, loader: 'script' },
            { test: /CesiumDrawHelper\.js$/, loader: 'script' },
            { test: /(\.css|\.scss)$/, exclude: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap', 'postcss-loader', 'sass?sourceMap'] },
            { test: /(\.css|\.scss)$/, include: path.join(__dirname, 'node_modules/react-toolbox'), loaders: ['style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass?sourceMap!toolbox'] },
            { test: /\.(eot|woff|woff2|ttf|svg|gif|ico|png|jpe?g)$/, loader: 'file-loader?name=img/[name].[ext]' },
            { test: /\.md|\.json$/, loader: 'raw-loader' }
        ]
    },
    toolbox: { theme: path.join(__dirname, 'src/styles/_theme.scss') },
    postcss: () => {
        return [
            require('autoprefixer')
        ];
    }
};
