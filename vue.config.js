const webpack = require('webpack')

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "src/mixin.sass";'
      },
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        $: 'jquery/dist/jquery.slim.js',
        jQuery: 'jquery/dist/jquery.slim.js',
      }])

    if(config.get('mode') === 'production') {
      const { join } = require('path')
      const scanner = require('charactor-scanner')
      const text = scanner({
        dir: join(__dirname, 'src'),
        ext: 'vue',
        sync: true,
      }).join('')

      config.module.rules.delete('fonts')
      config.module.rule('fonts')
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .oneOf('fontmin')
          .test(/.ttf$/i)
          .include
            .add(join(__dirname, 'src/assets/fonts'))
            .end()
          .use('awesome-fontmin-loader')
            .loader('awesome-fontmin-loader')
            .options({
              context: config.get('context'),
              text: text,
              limit: 10000,
              name: 'fonts/[name].[hash:8].[ext]',
            })
            .end()
          .end()
        .oneOf('other-fonts')
          .use('url-loader')
            .loader('url-loader')
            .options({
              limit: 10000,
              name: 'fonts/[name].[hash:8].[ext]'
            })

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
