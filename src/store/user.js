import api from '@/services/api'

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state: {
        isLoggedIn: false,
        id: '',
        name: '',
        email: '',
        image_file_path: '',
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        id: state => state.id,
        name: state => state.name,
        email: state => state.email,
        image_file_path: state => state.image_file_path,
        getUser: state => {
            return {
                id: state.id,
                name: state.name,
                email: state.email,
                image_file_path: state.image_file_path,
            }
        }
    },
    mutations: {
        set(state, payload) {
            state.isLoggedIn = true
            state.id = payload.user.id
            state.name = payload.user.name
            state.email = payload.user.email
            state.image_file_path = payload.user.image_file_path
        },
        clear(state) {
            state.isLoggedIn = false
            state.id = ''
            state.name = ''
            state.email = ''
            state.image_file_path = ''
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
                    return context.dispatch('load', {
                        id: response.data.id
                    })
                })
                .catch(error => error.response || error)
        },
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
                .catch(error => {
                    console.log(error)
                })
        },
        logout(context) {
            // 認証用トークンをlocalStorageから削除
            localStorage.removeItem('access')
            // storeのユーザー情報をクリア
            context.commit('clear')
        }
    }
}
