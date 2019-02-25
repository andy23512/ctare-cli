module.exports = {
  fonts: [{ name: 'Noto Sans TC', devPackages: ['awesome-fontmin-loader', 'charactor-scanner'], affectedFiles: ['vue.config.js']}],
  functions: [
    { name: 'Check Mobile', cond: ['jquery'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'Save UTM', cond: ['router'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'Image Optimization', checked: true, devPackages: ['imagemin', 'imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant', 'img-loader'], affectedFiles: ['vue.config.js'] },
    { name: 'Add Dist to Git Repo' }
  ],
  modules: [
    { name: 'axios', packages: ['axios'], affectedFiles: ['main.js'] },
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
  ]
};
