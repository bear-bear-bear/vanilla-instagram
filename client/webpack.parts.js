const path = require('path');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

const PUBLIC_PATH = '/';
const BUILD_PATH = '../server/src/public';

exports.PUBLIC_PATH = PUBLIC_PATH;
exports.BUILD_PATH = BUILD_PATH;

exports.devServer = ({ host } = {}) => ({
  devServer: {
    watchOptions: {
      ignored: /node_modules/,
    },
    publicPath: PUBLIC_PATH,

    // Enable history API fallback so HTML5 History API based
    // routing works. Good for complex setups.
    historyApiFallback: true,

    // Display only errors to reduce the amount of output.
    stats: 'errors-only',

    // Parse host and port from env to allow customization.
    //
    // If you use Docker, Vagrant or Cloud9, set
    // host: options.host || '0.0.0.0';
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    host, // Defaults to `localhost`
    port: 3000, // Defaults to 8080

    // overlay: true is equivalent
    overlay: {
      errors: true,
      warnings: false,
    },
  },
});

exports.loadPug = (options) => ({
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            options,
          },
        ],
      },
    ],
  },
});

// copy pug
// {
//   module: {
//     rules: [
//       {
//         test: /\.pug$/,
//         use: ['pug-loader'],
//       },
//     ],
//   },
//   plugins: [
//     new CopyPlugin({
//       patterns: [{ from: 'views', to: 'views' }],
//     }),
//   ],
// };

const sharedCSSLoaders = [
  {
    loader: 'css-loader',
    options: {
      localIdentName: '[hash:base64:5]',
      url: true,
    },
  },
];

// const cssPreprocessorLoader = { loader: 'fast-sass-loader' };
const cssPreprocessorLoader = [{ loader: 'sass-loader' }];

exports.purifyCSS = (options) => ({
  plugins: [new PurifyCSSPlugin(options)],
});

exports.minifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: options,
        canPrint: true, // false for analyzer
      }),
    ],
  },
});

exports.extractCSS = ({ include, exclude, options, isDevServer = false } = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,

        include,
        exclude,

        use: [
          // style-loader is for CSS HMR in webpack-dev-server
          isDevServer ? 'style-loader' : MiniCssExtractPlugin.loader,
          ...sharedCSSLoaders,
          ...cssPreprocessorLoader,
        ],
      },
    ],
  },
  plugins: isDevServer ? [] : [new MiniCssExtractPlugin(options)],
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,

        include,
        exclude,

        use: {
          loader: 'url-loader',
          options: {
            limit: 15000,
            publicPath: '../',
            useRelativePaths: true,
            ...options,
          },
        },
      },
    ],
  },
});

exports.optimizeImages = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,

        include,
        exclude,

        use: {
          loader: 'image-webpack-loader',

          options: {
            progressive: true,

            // optimizationLevel: 7,

            gifsicle: {
              interlaced: false,
            },

            /*
            mozjpeg: {

            },

            svgo: {

            }, */

            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      },
    ],
  },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,

        include,
        exclude,

        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});

exports.loadJS = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,

        include,
        exclude,

        loader: 'babel-loader',
        options,
      },
    ],
  },
});

exports.minifyJS = (options) => ({
  optimization: {
    minimizer: [new TerserPlugin(options)],
  },
});

const createPage = ({
  filename,
  entry,
  template = require.resolve('html-webpack-plugin/default_index.ejs'),
  chunks,
} = {}) => ({
  entry,
  plugins: [
    new HtmlWebpackPlugin({
      filename,
      template,
      chunks,
      inject: 'head',
      scriptLoading: 'defer',
    }),
  ],
});

/**
 * @param {string} appPath - 작업한 파일들이 있는 디렉터리 (ex - client/app/)
 * @param {array} pageNames - page name array
 */
exports.createPages = (appPath, pageNames) => {
  return pageNames.map((page) => {
    const pageSourceDir = path.join(appPath, 'pages', page);
    const htmlFileName = page !== 'home' ? page : 'index';

    return createPage({
      filename: `${htmlFileName}.html`,
      entry: {
        [page]: path.join(pageSourceDir, 'entry.js'), // page's unique entry
      },
      template: path.join(pageSourceDir, `${page}.pug`),
      chunks: [page, 'common', 'runtime', 'vendors'],
    });
  });
};
