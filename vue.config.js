const webpack = require('webpack')

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "src/mixin.sass";'
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
      const { join } = require('path')
      const scanner = require('charactor-scanner')
      const text = scanner({
        dir: join(__dirname, 'src'),
        ext: 'vue',
        sync: true,
      }).join('')

      config.module.rules.delete('fonts') //[[Noto Sans TC]]
      config.module.rule('fonts') //[[Noto Sans TC]]
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i) //[[Noto Sans TC]]
        .oneOf('fontmin') //[[Noto Sans TC]]
          .test(/.ttf$/i) //[[Noto Sans TC]]
          .include //[[Noto Sans TC]]
            .add(join(__dirname, 'src/assets/fonts')) //[[Noto Sans TC]]
            .end() //[[Noto Sans TC]]
          .use('awesome-fontmin-loader') //[[Noto Sans TC]]
            .loader('awesome-fontmin-loader') //[[Noto Sans TC]]
            .options({ //[[Noto Sans TC]]
              context: config.get('context'), //[[Noto Sans TC]]
              text: text, //[[Noto Sans TC]]
              limit: 10000, //[[Noto Sans TC]]
              name: 'fonts/[name].[hash:8].[ext]', //[[Noto Sans TC]]
            }) //[[Noto Sans TC]]
            .end() //[[Noto Sans TC]]
          .end() //[[Noto Sans TC]]
        .oneOf('other-fonts') //[[Noto Sans TC]]
          .use('url-loader') //[[Noto Sans TC]]
            .loader('url-loader') //[[Noto Sans TC]]
            .options({ //[[Noto Sans TC]]
              limit: 10000, //[[Noto Sans TC]]
              name: 'fonts/[name].[hash:8].[ext]' //[[Noto Sans TC]]
            }) //[[Noto Sans TC]]

      config.module.rules.delete('images')
      config.module.rule('images')
        .test(/\.(png|jpe?g|gif)(\?.*)?$/)
        .use('file-loader')
          .loader('file-loader')
          .options({
            name: `img/[name].[hash:8].[ext]`
          })
          .end()
        .use('img-loader')
          .loader('img-loader')
          .options({
            plugins: [
              require('imagemin-gifsicle')(),
              require('imagemin-mozjpeg')(),
              require('imagemin-pngquant')(),
            ]
          })
    }
  },
  devServer: {
    hot: false,
    inline: true,
    port: process.env.DEV_PORT || 8080,
    proxy: { '/api': { target: `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 8000}` } },
  }
}
