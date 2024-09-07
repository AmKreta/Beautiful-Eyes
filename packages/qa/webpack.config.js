
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src", "app.tsx"),
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, `dist`),
        chunkFilename: '[id].[chunkhash].js',
        sourceMapFilename: '[name].[hash:8].map',
        publicPath:'/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "app", "index.html")
        }),
        new CopyPlugin({
            patterns: [
              { from: "./public", to: "./" },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test:/\.(ts|tsx)$/,
                use: [
                    {
                      loader: 'babel-loader',
                      options: {
                        // Babel config is handled via `.babelrc` or `babel.config.json`
                      }
                    },
                    {
                        loader:'ts-loader'
                    }
                  ],
            },
            {
                test: /\.(css|scss)$/, use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            { 
                test:  /\.(js|mjs|jsx|ts|tsx)$/,
                use: 'source-map-loader', 
            },
            {
                test: /\.(png|jpe?g|gif|txt|svg|mp3|wav|flac|ttf|hdr|env|gltf|wasm)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
    },
    mode: "development",
    devtool:"inline-source-map",
    optimization: {
        runtimeChunk: 'single',
    },
    resolve:{
        extensions: ['.js', '.ts', '.tsx']
    }
}