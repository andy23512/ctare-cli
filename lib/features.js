module.exports = {
  fonts: [{ name: 'Noto Sans TC', checked: true }],
  modules: [
    { name: 'axios', packages: ['axios'], affectedFiles: ['main.js'] },
    {
      name: 'jquery',
      checked: true,
      packages: ['jquery'],
      affectedFiles: ['vue.config.js']
    },
    { name: 'query-string', packages: ['query-string'], affectedFiles: ['App.vue', 'store.js'] },
    { name: 'ramdajs', packages: ['ramda'], affectedFiles: ['vue.config.js'] },
    { name: 'rxjs', packages: ['vue-rx', 'rxjs'], affectedFiles: ['main.js'] },
    { name: 'semantic-ui-css', packages: ['semantic-ui-css'] },
    {
      name: 'semantic-ui-reset',
      checked: true,
      packages: ['semantic-ui-reset'],
      affectedFiles: ['main.js']
    },
    {
      name: 'vue-analytics',
      packages: ['vue-analytics'],
      affectedFiles: ['main.js']
    },
    {
      name: 'vue-scrollto',
      packages: ['vue-scrollto'],
      affectedFiles: ['main.js']
    }
  ]
};
