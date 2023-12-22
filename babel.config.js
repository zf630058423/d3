const proPlugins = [];
// 如果当前是生产环境，则使用去掉console的插件
// if (process.env.NODE_ENV !== 'development') {
//   proPlugins.push('transform-remove-console');
// }

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...proPlugins
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    }
  }
}
