module.exports = {
  fonts: [{ name: 'Noto Sans TC', checked: true }],
  modules: [
    { name: 'axios', packages: ['axios'], affectedFile: 'main.js' },
    {
      name: 'jquery',
      checked: true,
      packages: ['jquery'],
      affectedFile: 'vue.config.js'
    },
    { name: 'query-string', packages: ['query-string'], affectedFile: 'App.vue' },
    { name: 'ramdajs', packages: ['ramda'], affectedFile: 'vue.config.js' },
    { name: 'rxjs', packages: ['vue-rx', 'rxjs'], affectedFile: 'main.js' },
    { name: 'semantic-ui-css', packages: ['semantic-ui-css'] },
    {
      name: 'semantic-ui-reset',
      checked: true,
      packages: ['semantic-ui-reset'],
      affectedFile: 'main.js'
    },
    {
      name: 'vue-analytics',
      packages: ['vue-analytics'],
      affectedFile: 'main.js'
    },
    {
      name: 'vue-scrollto',
      packages: ['vue-scrollto'],
      affectedFile: 'main.js'
    }
  ]
};
