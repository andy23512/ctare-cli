module.exports = {
  fonts: [{ name: 'Noto Sans TC', affectedFiles: ['global.sass']}],
  functions: [
    { name: 'Check Mobile', cond: ['jquery'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'Save UTM', cond: ['router'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'Image Optimization', checked: true, devPackages: ['imagemin', 'imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant', 'img-loader'], affectedFiles: ['vue.config.js'] },
    { name: 'Add Dist to Git Repo' },
    { name: 'Track Scroll Position', depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] }
  ],
  modules: [
    { name: 'axios', packages: ['axios'], affectedFiles: ['main.js', 'App.vue'] },
    {
      name: 'jquery',
      checked: true,
      packages: ['jquery'],
      affectedFiles: ['vue.config.js']
    },
    { name: 'rxjs', packages: ['vue-rx', 'rxjs'], affectedFiles: ['main.js'] },
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
  others: [
    { name: 'TechOrange favicon' }
  ]
};
