const path = require('path');
const WXAppWebpackPlugin = require('wxapp-webpack-plugin');

module.exports = {
    // 引入 `app.js`
    entry: './src/app.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new WXAppWebpackPlugin(),
    ],
    module: {
        rules: [
          {
            test: /\.(jpg|png|gif|json)$/,
            include: /src/,
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[name].[ext]',
            }
          },
          {
            test: /\.js$/,
            include: /src/
          },
          {
            test: /\.wxss$/,
            include: /src/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  useRelativePath: true,
                  name: '[name].wxss',
                }
              },
              {
                loader: 'css-loader'
              }
            ],
          },
          {
            test: /\.wxml$/,
            include: /src/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  useRelativePath: true,
                  name: '[name].[ext]',
                },
              },
              {
                loader: 'wxml-loader',
                // options: {
                //   root: path.resolve('src'),
                // },
              },
            ],
          }
        ]
    },
    resolve: {
        modules: ['src', 'node_modules']
    },
};