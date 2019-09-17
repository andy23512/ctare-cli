const webpack = require('webpack') //[[jquery@module]]

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  chainWebpack(config) {
    //<<jquery@module>>
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        $: 'jquery/dist/jquery.slim.js',
        jQuery: 'jquery/dist/jquery.slim.js',
      }])

    //<</jquery@module>>
    if(config.get('mode') === 'production') {
      //<<image-optimization@function>>
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
      //<</image-optimization@function>>
    }
  },
  devServer: {
    hot: false,
    inline: true,
    port: process.env.DEV_PORT || 8080,
    proxy: { '/api': { target: `${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || 8000}` } },
  },
  //<<jquery@module&storybook@plugin>>
  pluginOptions: {
    storybook: {
      allowedPlugins: [
        'provide'
      ]
    }
  },
  //<</jquery@module&storybook@plugin>>
}
