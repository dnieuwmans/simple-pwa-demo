module.exports = function (api) {
    api.cache(() => process.env.NODE_ENV);

    const plugins = [
        '@babel/plugin-syntax-dynamic-import',
    ];
    const presets = [
        ['@babel/preset-env', {
            targets: {
                browsers: [
                    'defaults',
                    'ios_saf >= 11.3'
                ]
            },
            useBuiltIns: 'usage',
            corejs: {
                version: '3.8',
                proposals: true
            },
            debug: false,
            modules: false,
        }]
    ];

    return { presets, plugins };
}