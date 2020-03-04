import 'normalize.css/normalize.css' //[[normalize.css@module]]
import '@/global.sass'
import '@/storybook.sass'
import { configure } from '@storybook/vue'
import Vue from 'vue'
import Vuex from 'vuex' //[[store@internal]]

Vue.use(Vuex) //[[store@internal]]

const req = require.context('../src/stories', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
