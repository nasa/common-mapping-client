const config = require('./webpack.config.helper')({
    node_env: 'development',
    isProduction: false,
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/index'
    ]
});

export default config;
