const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {webpack.Configuration} */
module.exports = {
    output: {
        filename: 'assets/[name].bundle.js',
        chunkFilename: 'assets/[name].chunk.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'build/index.html'),
            template: path.resolve(__dirname, 'src/template.html'),
            chunksSortMode: 'none',
        }),
    ],
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: true,
                        },
                    },
                ],
                exclude: '/node_modules',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[name]--[local]--[contenthash:8]',
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        symlinks: false,
    },
};
