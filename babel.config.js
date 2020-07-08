//这个文件是全局共享的,不管是项目开发还是生产都会执行

// 定义一个发布阶段要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

const { productionSourceMap } = require("./vue.config");

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    // 'transform-remove-console'

    //发布产品时候的插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
};
