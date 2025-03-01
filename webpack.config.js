const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = async (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'inline-cheap-module-source-map' : false,
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    entry: './src/src/main.js',
    output: {
      filename: 'rr-manager.js',
      path: path.resolve(__dirname, 'src/app'),
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
    },
    plugins: [new VueLoaderPlugin()],
    externals: {
      vue: 'Vue',
    },
    watchOptions: {
      poll: true,
    },
  };
};
