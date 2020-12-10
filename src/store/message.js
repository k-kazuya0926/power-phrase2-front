export default {
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
