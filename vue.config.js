const webpack = require('webpack') //[[jquery]]

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "src/mixin.sass"\n@import "src/reset-mixin.sass"'
      },
    },
  },
  chainWebpack(config) {
    config //[[jquery]]
      .plugin('provide') //[[jquery]]
      .use(webpack.ProvidePlugin, [{ //[[jquery]]
        $: 'jquery/dist/jquery.slim.js', //[[jquery]]
        jQuery: 'jquery/dist/jquery.slim.js', //[[jquery]]
      }]) //[[jquery]]
//[[jquery]]
    if(config.get('mode') === 'production') {
      config.module.rules.delete('images') //[[Image Optimization]]
      config.module.rule('images') //[[Image Optimization]]
        .test(/\.(png|jpe?g|gif)(\?.*)?$/) //[[Image Optimization]]
        .use('file-loader') //[[Image Optimization]]
          .loader('file-loader') //[[Image Optimization]]
          .options({ //[[Image Optimization]]
            name: `img/[name].[hash:8].[ext]` //[[Image Optimization]]
          }) //[[Image Optimization]]
          .end() //[[Image Optimization]]
        .use('img-loader') //[[Image Optimization]]
          .loader('img-loader') //[[Image Optimization]]
          .options({ //[[Image Optimization]]
            plugins: [ //[[Image Optimization]]
              require('imagemin-gifsicle')(), //[[Image Optimization]]
              require('imagemin-mozjpeg')(), //[[Image Optimization]]
              require('imagemin-pngquant')(), //[[Image Optimization]]
            ] //[[Image Optimization]]
          }) //[[Image Optimization]]
    }
  },
  devServer: {
    hot: false,
    inline: true,
    port: process.env.DEV_PORT || 8080,
    proxy: { '/api': { target: `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 8000}` } },
  }
}
