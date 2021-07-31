const path = require('path');
const glob = require('glob');

const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const parts = require('./webpack.parts');
const pageInfos = require('./page.config');

const pageNameMap = pageInfos.reduce((acc, { pug: pugPath }) => {
  const pageName = path.basename(pugPath, path.extname(pugPath));
  const htmlPath = `/${pageName}.html`;

  acc[pageName] = htmlPath;
  return acc;
}, {});

const getPaths = ({
  sourceDir = 'app',
  buildDir = parts.BUILD_PATH,
  staticDir = '',
  entries = 'entries',
  images = 'images',
  fonts = 'fonts',
  js = 'scripts',
  css = 'styles',
} = {}) => {
  const assets = { entries, images, fonts, js, css };

  return Object.keys(assets).reduce(
    (acc, assetName) => {
      const assetPath = assets[assetName];

      acc[assetName] = !staticDir ? assetPath : `${staticDir}/${assetPath}`;

      return acc;
    },
    {
      app: path.join(__dirname, sourceDir),
      build: path.join(__dirname, buildDir),
      staticDir,
    }
  );
};

/*
  To move all assets to some static folder
  getPaths({ staticDir: 'some-name' })

  To rename asset build folder
  getPaths({ js: 'some-name' })

  To move assets to the root build folder
  getPaths({ css: '' })

  Defaults values:
     sourceDir - 'app',
      buildDir - 'build',
     staticDir - '',

        images - 'images',
         fonts - 'fonts',
           css - 'styles',
            js - 'scripts'
*/
const paths = getPaths({
  sourceDir: 'app',
  buildDir: parts.BUILD_PATH,
});
exports.paths = paths;

const lintStylesOptions = {
  context: path.resolve(__dirname, `${paths.app}/styles`),
  syntax: 'scss',
  emitErrors: false,
  // fix: true,
};

const commonConfig = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false,
      extensions: ['.pug', '.js', '.json', '.scss'],
      alias: {
        '@entries': path.resolve(paths.app, 'entries'),
        '@fonts': path.resolve(paths.app, 'fonts'),
        '@images': path.resolve(paths.app, 'images'),
        '@includes': path.resolve(paths.app, 'includes'),
        '@pages': path.resolve(paths.app, 'pages'),
        '@scripts': path.resolve(paths.app, 'scripts'),
        '@styles': path.resolve(paths.app, 'styles'),
      },
    },
    entry: {
      common: path.join(paths.app, 'entries/common.js'), // common entry
    },
    output: {
      path: paths.build,
      publicPath: parts.PUBLIC_PATH,
    },
    stats: {
      warningsFilter: (warning) => warning.includes('entrypoint size limit'),
      children: false,
      modules: false,
    },
    plugins: [
      new ManifestPlugin({
        fileName: 'manifest.json',
        // filter: (file) => !file.path.match(/\.map$/), // 맵 파일 제거
        // map: (file) => {
        //   const extension = path.extname(file.name).slice(1);

        //   return {
        //     ...file,
        //     name: ['css', 'js'].includes(extension)
        //       ? `${extension}/${file.name}`
        //       : file.name
        //   }
        // },
        // useEntryKeys: true,
      }),
      new FriendlyErrorsPlugin(),
      new StylelintPlugin(lintStylesOptions),
    ],
    module: {
      noParse: /\.min\.js/,
    },
  },
  parts.loadPug({
    data: pageNameMap,
  }),
  parts.loadFonts({
    include: paths.app,
    options: {
      name: `${paths.fonts}/[name].[hash:8].[ext]`,
    },
  }),
]);

const productionBuildConfig = merge([
  {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: 'single',
    },
    output: {
      chunkFilename: `${paths.js}/[name].[chunkhash:8].js`,
      filename: `${paths.js}/[name].[chunkhash:8].js`,
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    plugins: [new webpack.HashedModuleIdsPlugin(), new CleanPlugin()],
  },
  parts.minifyJS({
    terserOptions: {
      parse: {
        // we want terser to parse ecma 8 code. However, we don't want it
        // to apply any minfication steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    },
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: true,
  }),
  parts.loadJS({
    include: paths.app,
    options: {
      cacheDirectory: true,
    },
  }),
  parts.extractCSS({
    include: paths.app,
    options: {
      filename: `${paths.css}/[name].[contenthash:8].css`,
      chunkFilename: `${paths.css}/[id].[contenthash:8].css`,
    },
  }),
  parts.purifyCSS({
    paths: glob.sync(`${paths.app}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss'],
  }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
    },
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      name: `${paths.images}/[name].[hash:8].[ext]`,
    },
  }),
  // should go after loading images
  parts.optimizeImages(),
]);

const developmentBuildConfig = merge([
  {
    mode: 'development',
    output: {
      chunkFilename: `${paths.js}/[name].js`,
      filename: `${paths.js}/[name].js`,
    },
    devtool: 'inline-source-map',
  },
  parts.extractCSS({
    include: paths.app,
    options: {
      filename: `${paths.css}/[name].css`,
      chunkFilename: `${paths.css}/[id].css`,
    },
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      name: `${paths.images}/[name].[ext]`,
    },
  }),
  parts.loadJS({ include: paths.app }),
]);

const devServerConfig = merge([
  {
    mode: 'development',
    output: {
      chunkFilename: `${paths.js}/[name].js`,
      filename: `${paths.js}/[name].js`,
    },
    devtool: 'inline-source-map',
  },
  parts.devServer(),
  parts.extractCSS({
    include: paths.app,
    options: {
      filename: `${paths.css}/[name].css`,
      chunkFilename: `${paths.css}/[id].css`,
    },
    isDevServer: true,
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      name: `${paths.images}/[name].[ext]`,
    },
  }),
  parts.loadJS({ include: paths.app }),
]);

const pages = parts.createPages(paths.app, pageInfos);

module.exports = (env) => {
  process.env.NODE_ENV = env === 'production' ? 'production' : 'development'; // env === 'devServer' 일때 NODE_ENV는 'development'로 매핑

  const configMap = {
    devServer: devServerConfig,
    development: developmentBuildConfig,
    production: productionBuildConfig,
  };

  return merge(commonConfig, configMap[env], ...pages);
};
