import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './user'
import messageModule from './message'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    message: messageModule,
    user: userModule,
  },
  plugins: [createPersistedState({
    key: 'example',
    storage: window.sessionStorage
  })]
})
