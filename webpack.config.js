/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const { resolve, join } = require('path');
const {merge} = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const ENV = process.argv.find(arg => arg.includes('production'))
  ? 'production'
  : 'development';
const OUTPUT_PATH = ENV === 'production' ? resolve('dist') : resolve('src');
const INDEX_TEMPLATE = resolve('./src/index.html');

const assetspath = join(__dirname, '/src/assets/*');

const assets = [
  {
    from: resolve(assetspath),
    to: join(OUTPUT_PATH, 'assets', '[name][ext]')
  },
];

const polyfills = [
  {
    from: resolve('./src/robots.txt'),
    to: OUTPUT_PATH
  }
];

const commonConfig = merge([
  {
    entry: './src/mimisiku-app.ts',
    output: {
      path: OUTPUT_PATH,
      filename: '[name].[chunkhash:8].js'
    },
    resolve: {
      extensions: [ '.ts', '.js', '.css' ],
      fallback: { 
        'buffer': require.resolve('buffer'), 
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['css-loader'],
        },
        {
            test: /\.tsx?$/,
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: 'chrome80'
            }
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              }
            },
          ],
         type: 'javascript/auto'
        },
        {
          test: /\.(graphql)$/,
          exclude: /node_modules/,
          loader: 'raw-loader',
        },
        {
          test: /\.scss?$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /node_modules/,
        },
      ]
    }
  }
]);

const developmentConfig = merge([
  {
    plugins: [
      new CopyWebpackPlugin({patterns:[...polyfills, ...assets]}),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE
      }),
      new ESLintPlugin(),
    ],

    devServer: {
      compress: true,
      port: 3006,
      historyApiFallback: true,
      host: 'localhost'
    }
  }
]);

const productionConfig = merge([
  {
    devtool: 'nosources-source-map',
    plugins: [
      new CleanWebpackPlugin({ verbose: true }),
      new CopyWebpackPlugin({patterns: [...polyfills, ...assets]}),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true
        }
      }),
    ]
  }
]);

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};


