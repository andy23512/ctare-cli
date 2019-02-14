const webpack = require('webpack')

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "src/mixin.sass"'
      },
    },
  },
  chainWebpack: (config) => {
    config //[[jquery]]
      .plugin('provide') //[[jquery]]
      .use(webpack.ProvidePlugin, [{ //[[jquery]]
        $: 'jquery/dist/jquery.slim.js', //[[jquery]]
        jQuery: 'jquery/dist/jquery.slim.js', //[[jquery]]
      }]) //[[jquery]]

    if(config.get('mode') === 'production') {
      const { join } = require('path') //[[font]]
      const scanner = require('charactor-scanner') //[[font]]
      const text = scanner({ //[[font]]
        dir: join(__dirname, 'src'), //[[font]]
        ext: 'vue', //[[font]]
        sync: true, //[[font]]
      }).join('') //[[font]]
      //[[font]]
      config.module.rules.delete('fonts') //[[font]]
      config.module.rule('fonts') //[[font]]
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i) //[[font]]
        .oneOf('fontmin') //[[font]]
          .test(/.ttf$/i) //[[font]]
          .include //[[font]]
            .add(join(__dirname, 'src/assets/fonts')) //[[font]]
            .end() //[[font]]
          .use('awesome-fontmin-loader') //[[font]]
            .loader('awesome-fontmin-loader') //[[font]]
            .options({ //[[font]]
              context: config.get('context'), //[[font]]
              text: text, //[[font]]
              limit: 10000, //[[font]]
              name: 'fonts/[name].[hash:8].[ext]', //[[font]]
            }) //[[font]]
            .end() //[[font]]
          .end() //[[font]]
        .oneOf('other-fonts') //[[font]]
          .use('url-loader') //[[font]]
            .loader('url-loader') //[[font]]
            .options({ //[[font]]
              limit: 10000, //[[font]]
              name: 'fonts/[name].[hash:8].[ext]' //[[font]]
            }) //[[font]]
      //[[font]]
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
