import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/services/api'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 認証情報
// TODO userModuleへ統合する
const authModule = {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    isLoggedIn: false,
    id: '',
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    id: state => state.id,
  },
  mutations: {
    set(state, payload) {
      state.isLoggedIn = true
      state.id = payload.user.id
    },
    clear(state) {
      state.isLoggedIn = false
      state.id = ''
    }
  },
  actions: {
    // ログイン
    login(context, payload) {
      return api.post('/login', {
        'email': payload.email,
        'password': payload.password
      })
        .then(response => {
          // JWTトークン
          // 認証用トークンをlocalStorageに保存
          localStorage.setItem('access', response.data.token)
          // ユーザー情報を取得してstoreのユーザー情報を更新
          return context.dispatch('reload', {
            id: response.data.id
          })
            .then(user => user)
        })
        .catch(error => error.response || error)
    },
    // ログアウト
    logout(context) {
      // 認証用トークンをlocalStorageから削除
      localStorage.removeItem('access')
      // storeのユーザー情報をクリア
      context.commit('clear')
    },
    // ユーザー情報更新
    reload(context, payload) {
      return api.get('/users/' + payload.id)
        .then(response => {
          const user = response.data
          // storeのユーザー情報を更新
          context.commit('set', {
            user: user
          })
          return user
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}

// グローバルメッセージ
const messageModule = {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    success: '',
    info: '',
    warnings: '',
    error: '',
  },
  getters: {
    success: state => state.success,
    info: state => state.info,
    warnings: state => state.warnings,
    error: state => state.error,
  },
  mutations: {
    set(state, payload) {
      if (payload.success) {
        state.success = payload.success
      }
      if (payload.info) {
        state.info = payload.info
      }
      if (payload.warnings) {
        state.warnings = payload.warnings
      }
      if (payload.error) {
        state.error = payload.error
      }
    },
    clear(state) {
      state.success = ''
      state.info = ''
      state.warnings = ''
      state.error = ''
    }
  },
  actions: {
    // サクセスメッセージ表示
    setSuccessMessage(context, payload) {
      context.commit('set', {
        'success': payload.message
      })
      // 一時的に保存する
      setTimeout(() => {
        context.dispatch('clearMessages')
      }, 1500)
    },
    // インフォメーションメッセージ表示
    setInfoMessage(context, payload) {
      context.commit('set', {
        'info': payload.message
      })
      // 一時的に保存する
      setTimeout(() => {
        context.dispatch('clearMessages')
      }, 1500)
    },
    // 警告メッセージ表示
    setWarningMessages(context, payload) {
      context.commit('set', {
        'warnings': payload.message
      })
      // 一時的に保存する
      setTimeout(() => {
        context.dispatch('clearMessages')
      }, 1500)
    },
    // エラーメッセージ表示
    setErrorMessage(context, payload) {
      context.commit('set', {
        'error': payload.message
      })
      // 一時的に保存する
      setTimeout(() => {
        context.dispatch('clearMessages')
      }, 1500)
    },
    /**
     * 全メッセージ削除
     */
    clearMessages(context) {
      context.commit('clear')
    }
  }
}

// ユーザー情報
const userModule = {
  srtict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    id: '',
    name: '',
    image_file_path: '',
  },
  getters: {
    id: state => state.id,
    name: state => state.name,
    image_file_path: state => state.image_file_path,
    getUser: state => {
      return {
        id: state.id,
        name: state.name,
        image_file_path: state.image_file_path,
      }
    }
  },
  mutations: {
    set(state, payload) {
      state.id = payload.user.id
      state.name = payload.user.name
      state.image_file_path = payload.user.image_file_path
    },
    clear(state) {
      state.id = ''
      state.name = ''
      state.image_file_path = ''
    }
  },
  actions: {
    load(context, payload) {
      return api.get('/users/' + payload.id)
        .catch(error => {
          console.log(error)
        })
        .then(response => {
          const user = response.data
          // storeのユーザー情報を更新
          context.commit('set', {
            user: user
          })
          return user
        })
    },
    logout(context) {
      // storeのユーザー情報をクリア
      context.commit('clear')
    }
  }
}

export default new Vuex.Store({
  modules: {
    auth: authModule,
    message: messageModule,
    user: userModule,
  },
  plugins: [createPersistedState({
    key: 'example',
    storage: window.sessionStorage
  })]
})
