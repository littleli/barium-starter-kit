const { resolve } = require('path');

const webpack = require('webpack');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// PostCSS plugins
const cssnext = require('postcss-cssnext');

// webpack config helpers
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

module.exports = (env) => {
  const { ifProd, ifNotProd } = getIfUtils(env);

  return {
    context: resolve('src'),
    entry: removeEmpty( [
      // this must be executed first for the HMR to work correctly
      ifNotProd( 'react-hot-loader/patch' ),
      './main.tsx'
    ] ),
    output: {
      filename: '[name].[hash].js',
      path: resolve('dist'),
      // Include comments with information about the modules.
      pathinfo: ifNotProd(),
    },
    resolve: {
      extensions: [
        '.js',
        '.ts',
        '.tsx'
      ]
    },

    devtool: ifProd('source-map', 'cheap-module-source-map'),

    module: {
      rules: [
        // Typescript
        { test: /\.tsx?$/, use: [ 'awesome-typescript-loader' ], exclude: /node_modules/ },
        // CSS
        {
          test: /\.css$/,
          // @TODO replace with "use"
          // we need to use legacy "loader" instead of "use" to make ExtractTextPlugin@2-beta.4 work
          loader: ifNotProd(
            [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 1,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                }
              },
              {
                loader: 'postcss-loader',
                // @TODO
                // allow this instead of legacy loader plugin config (webpack.LoaderOptionsPlugin)
                // when https://github.com/postcss/postcss-loader/issues/99 is fixed
                /*query: {
                  plugins: () => [
                    // Allow future CSS features to be used, also auto-prefixes the CSS...
                    cssnext( {
                      // ...based on this browser list
                      browsers: [ 'last 2 versions', 'IE > 10' ],
                    } )
                  ]
                }*/
              }
            ],
            ExtractTextPlugin.extract( {
              // the loader(s) that should be used when the css is not extracted (i.e. in an additional chunk when allChunks: false)
              fallbackLoader: 'style-loader',
              // @TODO replace with "use"
              // ExtractTextPlugin doesn't follows latest webpack 2.0 api for loaders :(
              loader: [
                {
                  loader: 'css-loader',
                  // @TODO replace with "options" when ExtractTextPlugin is fixed
                  query: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                  }
                },
                { loader: 'postcss-loader' }
              ]
            } )
          )
        }
      ],
    },

    // This is required, when using Hot Code Replacement between multiple calls to the compiler.
    recordsPath: resolve(__dirname, './tmp/webpack-records.json'),

    plugins: removeEmpty([

      // Legacy loader plugin configs
      new webpack.LoaderOptionsPlugin( {
        options: {
          postcss: {
            plugins: [
              // Allow future CSS features to be used, also auto-prefixes the CSS...
              cssnext( {
                // ...based on this browser list
                browsers: [ 'last 2 versions', 'IE > 10' ],
              } )
            ]
          }
        }
      } ),

      // Add nice progress bar
      new ProgressBarPlugin(),

      new HtmlWebpackPlugin({
        template: resolve('src','index.html')
      }),

      // Set NODE_ENV to enable production react version
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),

      //prints more readable module names in the browser console on HMR updates
      ifNotProd( new webpack.NamedModulesPlugin() ),

      ifProd(new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      })),

      ifProd(new webpack.optimize.CommonsChunkPlugin({
        minChunks: Infinity,
        name: 'inline',
      })),

      // We use ExtractTextPlugin so we get a seperate CSS file instead
      // of the CSS being in the JS and injected as a style tag
      ifProd( new ExtractTextPlugin( '[name].[contenthash].css' ) ),

      // Deduplicate node modules dependencies
      ifProd(new webpack.optimize.DedupePlugin()),

      // Default webpack build options
      ifProd(new webpack.LoaderOptionsPlugin({
        debug: false
      })),

      // Uglify bundles
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        output: {
          comments: false
        }
      }))

    ]),
  }
};
