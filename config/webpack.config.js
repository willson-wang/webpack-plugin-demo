const path = require('path');
const { ProgressPlugin } = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin')

const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')



const smp = new SpeedMeasurePlugin();

const config = {
  mode: 'production',
  devtool: 'source-map',
  cache: {
    type: 'filesystem',
    name: 'production-cache',
    version: 'production',
  },
  profile: false,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'chunk/[name].[chunkhash].js',
    publicPath: './'
  },
  resolve: {
    symlinks: true,
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@store': path.resolve(__dirname, '../src/store'),
      '@api': path.resolve(__dirname, '../src/api'),
      '@types': path.resolve(__dirname, '../src/types'),
    },
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js'
    ],
    mainFields: [
      'browser',
      'main:h5',
      'module',
      'main'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(css|less|s[a|c]ss)(\?.*)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          }
        ]
      },
      {
        test: /\.[tj]sx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|bpm|svg|webp)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10240
          }
        },
        generator: {
          filename: 'image/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10240
          }
        },
        generator: {
          filename: 'static/fonts/[name].[hash][ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|m4a|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10240
          }
        },
        generator: {
          filename: 'static/media/[name].[hash][ext]'
        }
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source'
      }
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 819200,
      minChunks: 1,
      maxSize: 1843200,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      cacheGroups: {
        'default': false,
        vendors: {
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors'
        },
        common: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name: 'common'
        },
        react: {
          test: /[\\\/]node_modules[\\\/](core-js|react.*|redux.*|props-type|immer|history|@reduxjs\/toolkit)[\\\/]/,
          priority: 0,
          reuseExistingChunk: true,
          name: 'react',
          minSize: 0
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    },
    emitOnErrors: true,
    minimizer: [
      new TerserPlugin({
        parallel: false,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
      new CssMinimizerPlugin({}),
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new ProgressPlugin(
      {
        percentBy: 'entries',
        profile: !!process.env.PROFILE
      }
    ),
    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        template: path.join(__dirname, '../public/index.html'),
        minify: {
          collapseWhitespace: true,
          minifyJS: true,
          html5: true,
          minifyCSS: true,
          removeComments: true,
          removeTagWhitespace: false
        },
      }
    ),
  ],
  entry: {
    app: path.join(__dirname, '../src/app')
  },
}

if (process.env.ANALYZER) {
  config.plugins.push(new BundleAnalyzerPlugin())
}


const lastCofig = process.env.SPEED_MEASURE ? smp.wrap(config) : config

// MiniCssExtractPlugin不能与SpeedMeasurePlugin一起使用，不然会抛错
config.plugins.push(new MiniCssExtractPlugin(
  {
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[name].[contenthash].css',
    experimentalUseImportModule: false
  }
))


module.exports = lastCofig
