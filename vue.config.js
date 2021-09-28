// const CompressionWebpackPlugin = require('compression-webpack-plugin') // gzip压缩插件
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // 打包分析插件
// const AutoDllPlugin = require('autodll-webpack-plugin')
// const IsProduction = process.env.NODE_ENV === 'production'
// const BuildType = process.env.VUE_APP_BUILD == 'ali'
// const BuildCheckBranchPlugin = require('./webpackPlugin/plugins')

// console.log(process.env.NODE_ENV, process.env.VUE_APP_LOCAL_ENV)

module.exports = {
  // lintOnSave: false,
  // assetsDir: BuildType ? 'static' : '',
  // publicPath: IsProduction ? `${process.env.VUE_APP_STATIC_URL}/${BuildType ? 'huaweihc-v2' : 'v2/dist'}/` : '/',
  // productionSourceMap: !IsProduction,
  // css: {
  //   sourceMap: !IsProduction
  // },
  // configureWebpack: config => {
  //   const obj = {
  //     resolve: {
  //       alias: {
  //         Vue: 'vue',
  //         ELEMENT: 'element-ui'
  //       }
  //     },
  //   }
  //   if (IsProduction) {
  //     const buildEnv = process.env.VUE_APP_LOCAL_ENV
  //     if (buildEnv === 'production') {
  //       config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
  //       config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
  //     }
  //     // obj.plugins.push(
  //     //   new CompressionWebpackPlugin({
  //     //     algorithm: 'gzip',
  //     //     test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
  //     //     threshold: 10240,
  //     //     minRatio: 0.8
  //     //   })
  //     //   // new BuildCheckBranchPlugin({ buildBranch: process.env.VUE_APP_BUILD_BRANCH })
  //     // )
  //   }
  //   return obj
  // },
  // chainWebpack: config => {
  //   // config.plugins.delete('prefetch')
  //   // config.plugins.delete('preload')
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap(options => Object.assign(options, { limit: 10240 }))
  //   config.plugin('html')
  //     .tap(args => {
  //       args[0].inject = true
  //       return args
  //     })
  // }
}
