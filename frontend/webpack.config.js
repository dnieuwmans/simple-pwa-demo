const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge');

/** @type {webpack.Configuration} */
const commonWebpackConfig = {
    name: 'PWA Demo',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build/'),
        publicPath: '/',
    },
    target: ['web', 'es6'],
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: '**/*.css', to: 'assets/', context: 'src/Styles' },
                { from: '**/*.{png,ico}', to: 'assets/', context: 'src/Images' },
            ]
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css',],
        modules: [
            path.resolve(__dirname),
            'node_modules',
        ],
    },
    devServer: {
        port: 8080,
        host: '0.0.0.0',
        allowedHosts: 'all',
        historyApiFallback: true,
        client: {
            logging: 'error',
            overlay: false,
            progress: true,
        },
        static: {
            directory: path.resolve(__dirname, 'build'),
            publicPath: '/',
            serveIndex: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.svg$|\.png$|\.gif$|\.jpe?g$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[name]-[contenthash:8].[ext]',
                        esModule: false,
                    }
                }],
                exclude: path.resolve(__dirname, 'src/Images')
            },
        ]
    }
};

/** @type {webpack.Configuration} */
const serviceWorkerWebpackConfig = {
    name: 'PWA Demo (service worker)',
    entry: './src/ServiceWorkers/serviceWorker.ts',
    output: {
        path: path.resolve(__dirname, 'build/'),
        publicPath: '/',
        filename: 'service-worker.js',
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
        ],
        modules: [
            path.resolve(__dirname),
            'node_modules',
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'src/ServiceWorkers/tsconfig.json',
                        },
                    },
                ],
                exclude: '/node_modules',
            },
        ]
    }
}


module.exports = () => [
    merge(commonWebpackConfig, require('./webpack.dev')),
    serviceWorkerWebpackConfig
];
