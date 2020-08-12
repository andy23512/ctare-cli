import { Dict, Feature } from './interfaces';

export const fixedDeps = ['ramda', 'jquery'];
export const fixedDevDeps = ['pug', 'pug-plain-loader'];
export const features: Dict<Feature[]> = {
  font: [{ name: 'noto-sans-tc', affectedFiles: ['global.sass'] }],
  function: [
    {
      name: 'check-mobile',
      dependOn: ['store'],
      affectedFiles: ['App.vue', 'store.js'],
    },
    {
      name: 'save-utm',
      dependOn: ['store'],
      affectedFiles: ['App.vue', 'store.js'],
    },
    {
      name: 'image-optimization',
      checked: true,
      devPackages: [
        'imagemin',
        'imagemin-gifsicle',
        'imagemin-mozjpeg',
        'imagemin-pngquant',
        'img-loader',
      ],
      affectedFiles: ['vue.config.js'],
    },
    { name: 'add-dist-to-git-repo' },
    {
      name: 'track-scroll-position',
      dependOn: ['store'],
      affectedFiles: ['App.vue', 'store.js'],
    },
  ],
  module: [
    {
      name: 'axios',
      packages: ['axios'],
      affectedFiles: ['main.js', 'App.vue'],
    },
    {
      name: 'normalize.css',
      checked: true,
      packages: ['normalize.css'],
      affectedFiles: ['main.js'],
    },
    {
      name: 'vue-scrollto',
      packages: ['vue-scrollto'],
      affectedFiles: ['main.js'],
    },
  ],
  plugin: [
    {
      name: 'storybook',
      devPackages: ['@storybook/addon-viewport'],
    },
  ],
};
