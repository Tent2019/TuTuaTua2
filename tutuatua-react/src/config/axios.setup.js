import Axios from 'axios'

Axios.defaults.baseURL = 'http://localhost:8080'

Axios.interceptors.request.use(
    async config => {
        let token = localStorage.getItem('ACCESS_TOKEN')
        config.headers['Authorization'] = `Bearer ${token}`
        return config
    },
    async error => {
        throw error
    }
)

export default Axios