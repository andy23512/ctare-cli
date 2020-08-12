import { Store } from 'vuex'
import { map, fromPairs } from 'ramda'
import { action } from '@storybook/addon-actions';

class StoreMock extends Store {
  constructor({state = {}, mutations, actions}, {checkMobile = false}) {
    if(mutations) {
      mutations = fromPairs(map(m => [m, action('[Mutation] ' + m)], mutations))
    }
    if(actions) {
      actions = fromPairs(map(m => [m, action('[Action] ' + m)], actions))
    }

    if(checkMobile) {
      state.mobile = window.innerWidth < 1024
      window.addEventListener("resize", () => {
        const mobile = window.innerWidth < 1024
        if(this.state.mobile !== mobile) {
          this.state.mobile = mobile
          action('[Mutation] checkMobile')(this.state, this.state.mobile)
        }
      })
      const event = document.createEvent('HTMLEvents')
      event.initEvent('resize', true, false)
      window.dispatchEvent(event)
    }

    super({state, mutations, actions})
  }
}

export default StoreMock
