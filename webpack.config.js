const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devServer: {
        static: './dist',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Demo',
            favicon: './favicon.ico',
            template: './index.ejs',
        }),
    ],
    output: {
        clean: true,
    }
}
