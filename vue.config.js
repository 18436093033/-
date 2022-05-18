module.exports = {
  //配置端口号和本机ip

    configureWebpack: {},
    devServer: { // 环境配置
      host: '0.0.0.0',
      // host:'127.0.0.1',
      public: '172.16.136.107', // 此处是自己电脑IP地址！
      port: '8080',
      https: false,
      disableHostCheck: true,
      open: false // 配置自动启动浏览器
  

    },
        //配置发布入口文件----开发入口文件 
        // 发布模式
      chainWebpack:config=>{
        config.when(process.env.NODE_ENV==='production',config=>{
          config.entry('app').clear().add('./src/main-prod.js')
          config.set('externals',{
            vue:'Vue',
            'vue-router':'VueRouter',
            axios:'axios',
            lodash:'_',
            echarts:"echarts",
            nprogress:'Nprogress',
            'vue-quill-editor':'VueQuillEditor'
          })
          config.plugin('html').tap(args=>{
            args[0].isProd=true
            return args
          })
        })
        // 开发模式
        config.when(process.env.NODE_ENV==='development',config=>{
          config.entry('app').clear().add('./src/main-dev.js')
          config.plugin('html').tap(args=>{
            args[0].isProd=true
            return args
          })
        }
        )
  
      }  
}