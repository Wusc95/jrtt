import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken } from '../utils/token.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getToken('jrtoken') || {}
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      setToken('jrtoken', payload)
    }
  }
})
