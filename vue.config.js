const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  devServer: {
    open: true,
    hot: true, //自动保存
  },
  configureWebpack(config) {
    // console.log(config.plugins)
  },
  chainWebpack(config) {
    config.plugin('monaco').use(new MonacoWebpackPlugin())
    // config.plugin('circular').use(new CircularDependencyPlugin())
  },
}
