module.exports = {
  fonts: [{ name: 'Noto Sans TC' }],
  functions: [
    { name: 'Check Mobile', packages: ['jquery'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'Save UTM', packages: ['jquery'], depend_on: ['store'], affectedFiles: ['App.vue', 'store.js'] },
  ],
  modules: [
    { name: 'axios', packages: ['axios'], affectedFiles: ['main.js'] },
    {
      name: 'jquery',
      checked: true,
      packages: ['jquery'],
      affectedFiles: ['vue.config.js']
    },
    { name: 'query-string', packages: ['query-string'], affectedFiles: ['App.vue', 'store.js'] },
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
