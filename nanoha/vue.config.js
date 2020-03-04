const webpack = require('webpack')

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  chainWebpack(config) {
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        $: 'jquery/dist/jquery.slim.js',
        jQuery: 'jquery/dist/jquery.slim.js',
      }])

    if(config.get('mode') === 'production') {
    }
  },
  devServer: {
    hot: false,
    inline: true,
    port: process.env.DEV_PORT || 8080,
    proxy: { '/api': { target: `${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 8000}` } },
  },
}
