import api from '@/services/api'

export default {
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
