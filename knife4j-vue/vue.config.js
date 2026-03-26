const TerserPlugin = require("terser-webpack-plugin");
var path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const productionGzipExtensions = ["js", "css"];

module.exports = {
  transpileDependencies: [
    /[/\\]node_modules[/\\](.+?)?mermaid(.*)/
  ],
  publicPath: "./",
  assetsDir: "static",
  outputDir: "dist",
  lintOnSave: false,
  productionSourceMap: false,
  indexPath: "index.html",
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    watchOptions: {
      ignored: /node_modules/
    },
    proxy: {
      "/": {
        target: process.env.VUE_APP_API_TARGET || 'http://beta.gateway.qianxuncc.cn:8081',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: false,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.debug', 'window.console.log', 'window.console.debug']
            }
          },
        }),
      ]
    },
    plugins: [
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8
      }),
      new CopyWebPackPlugin([
        { from: path.resolve(__dirname, 'public/oauth'), to: path.resolve(__dirname, 'dist/oauth') }
      ])
    ]
  }
};
