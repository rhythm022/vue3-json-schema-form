const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const isLib = process.env.TYPE === 'lib'

module.exports = {
  devServer: {
    open: true,
    hot: true, //自动保存
  },
  configureWebpack(config) {
    // console.log(config.plugins)
  },
  chainWebpack(config) {
    if(!isLib){
      config.plugin('monaco').use(new MonacoWebpackPlugin())
    }
    // config.plugin('circular').use(new CircularDependencyPlugin())

  },
}
