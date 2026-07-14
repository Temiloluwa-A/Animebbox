import axios from 'axios'
import useAuthStore from '../store/useAuthStore'

// axios instance for our backend. attaches the JWT to every request if we have one.
const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
})
// interceptor to attach the JWT token to every request if it exists
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api
