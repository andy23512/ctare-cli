
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  chainWebpack(config) {
    if(config.get('mode') === 'production') {
    }
  },
  devServer: {
    hot: false,
    inline: true,
    port: process.env.DEV_PORT || 8080,
    proxy: { '/api': { target: `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 8000}` } },
  }
}
