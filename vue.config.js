var path = require('path');

const HOST = '169.254.100.201'

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/'  //生产环境路径
    : '/', //开发环境路径
    outputDir: 'dist', //生产环境构建文件的目录
    assetsDir: 'static', //放置生成的静态资源 (js、css、img、fonts) 目录。
    indexPath: 'index.html',  //打包文件名称
    // filenameHashing: false,
    productionSourceMap: false, //是否需要.map文件
    // crossorigin: 'anonymous', //设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
    // integrity: true,  //部署在cdn上设为true时具备安全性
    lintOnSave: process.env.NODE_ENV !== 'production',
    //webpack配置
    chainWebpack: config => {
        // 移除 preload 插件
        // config.plugins.delete('preload')
        // 移除 prefetch 插件
        // config.plugins.delete('prefetch')
        config.module
          .rule('images')
            .use('url-loader')
              .loader('url-loader')
              .tap(options => Object.assign(options, { limit: 1 }))
    },
    configureWebpack: {
        performance: {  //关闭webpack打包文件过大提示
            hints: false
        }
    },
    //vue-loader 配置
    // vueLoader: {},
    //css 配置
    css: {
        extract: true, //是否使用css分离插件ExtractTextPlugin
        sourceMap: false, //关闭css source map
        loaderOptions: {}, //css预设器配置
        modules: false, //启用 CSS modules for all css / pre-processor files.
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    //PWA 插件相关配置
    pwa: {},
    devServer: {
        // host: '0.0.0.0',
        host: HOST,
        hot: true,
        hotOnly: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        open: true,
        allowedHosts: [
            'http://' + HOST + ':5000/'
        ],
        proxy:{
            '/api': {
                target: 'http://' + HOST + ':5000/api/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                  '^/api' : ''
                }
              },
              '/shell': {
                target: 'http://' + HOST + ':5000/shell/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                  '^/shell' : ''
                }
              },
        }, //设置代理
        // before: app=> {}
    }
}