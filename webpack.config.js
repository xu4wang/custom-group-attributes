const path = require('path');

module.exports = {
    entry: './src/custom-group-block.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'custom-group-block.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/components': 'wp.components',
        '@wordpress/compose': 'wp.compose',
        '@wordpress/element': 'wp.element',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/hooks': 'wp.hooks'
    }
};
