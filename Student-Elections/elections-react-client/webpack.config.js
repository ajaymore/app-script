var webpack = require('webpack')

module.exports = {
    entry: "./app",
    output: {
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: ['babel'],
            query: {
                presets: ['react', 'es2015']
            }
        }]
    },
    plugins: [new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    })]
}