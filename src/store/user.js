import api from '@/services/api'

export default {
    strict: process.env.NODE_ENV !== 'production',
    namespaced: true,
    state: {
        id: '',
        name: '',
        email: '',
        image_file_path: '',
    },
    getters: {
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
            state.id = payload.user.id
            state.name = payload.user.name
            state.email = payload.user.email
            state.image_file_path = payload.user.image_file_path
        },
        clear(state) {
            state.id = ''
            state.name = ''
            state.email = ''
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
