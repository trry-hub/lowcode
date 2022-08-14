import axios from 'axios'
// import qs from 'qs'
// import router from '@/router/index'
import useTokenStore from '@/store/modules/token'

const toLogin = () => {
    window.open('https://kshdoctor-dev3.yaomaitong.net/login?redirect=' + encodeURIComponent(window.location.href))
    // router.push({
    //     path: '/login',
    //     query: {
    //         redirect: router.currentRoute.value.fullPath
    //     }
    // })
}

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASEURL,
    timeout: 10000,
    responseType: 'json'
})

api.interceptors.request.use(
    config => {
        const tokenOutsideStore = useTokenStore()
        /**
         * 全局拦截请求发送前提交的参数
         * 以下代码为示例，在请求头里带上 token 信息
         */
        if (tokenOutsideStore.isLogin && config.headers) {
            config.headers.token = tokenOutsideStore.token
        }

        // 是否将 POST 请求参数进行字符串化处理
        if (config.method === 'post') {
            // config.data = qs.stringify(config.data, {
            //   arrayFormat: 'brackets',
            // })
        }
        return config
    }
)

api.interceptors.response.use(
    response => {
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 假设返回数据格式为：{ status: 1, error: '', data: '' }
     * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
     * 请求出错时 error 会返回错误信息
     */
        if (response.data.code === 0) {
            // 请求成功并且没有报错
            return Promise.resolve(response.data)
        } else if (response.data.code == 401) {
            toLogin()
        } else {
            return Promise.reject(response.data)
        }
    },
    error => {
        let { message, response } = error
        if (message === 'Network Error') {
            message = '后端网络故障'
        } else if (message.includes('timeout')) {
            message = '接口请求超时'
        } else if (message.includes('Request failed with status code')) {
            message = `接口${message.substr(message.length - 3)}异常`
        }
        if (response.status === 401) {
            toLogin()
        }

        return Promise.reject(error)
    }
)

export default api
