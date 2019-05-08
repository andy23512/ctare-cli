module.exports = {
  font: [{ name: 'noto-sans-tc', affectedFiles: ['global.sass']}],
  function: [
    { name: 'check-mobile', cond: ['jquery'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'save-utm', cond: ['router'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'image-optimization', checked: true, devPackages: ['imagemin', 'imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant', 'img-loader'], affectedFiles: ['vue.config.js'] },
    { name: 'add-dist-to-git-repo', packages: ['pre-commit'] },
    { name: 'track-scroll-position', depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] }
  ],
  module: [
    { name: 'axios', packages: ['axios'], affectedFiles: ['main.js', 'App.vue'] },
    {
      name: 'jquery',
      checked: true,
      packages: ['jquery'],
      affectedFiles: ['vue.config.js']
    },
    {
      name: 'normalize.css',
      checked: true,
      packages: ['normalize.css'],
      affectedFiles: ['main.js']
    },
    {
      name: 'vue-scrollto',
      packages: ['vue-scrollto'],
      affectedFiles: ['main.js']
    }
  ],
  plugin: [
    { name: 'storybook' }
  ],
  other: [
    { name: 'tech-orange-favicon' }
  ]
};
