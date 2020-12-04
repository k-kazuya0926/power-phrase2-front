import axios from 'axios';
// import store from '@/store'

// axiosインスタンス
const api = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// 共通前処理
api.interceptors.request.use(function (config) {
    // 認証用トークンがあればリクエストヘッダに乗せる
    const token = localStorage.getItem('access')
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
        return config
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

export default api
