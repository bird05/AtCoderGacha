const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/bootstrap.tsx"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bootstrap.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
    ]
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    historyApiFallback: true,
    //contentBase: path.resolve(__dirname, "public")
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicons/favicon.ico'
    }),
  ]
};