import axios from 'axios'

const inLogginPage = window.location.pathname === '/login'
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api/' 
const $axios = axios.create({
  baseURL: baseUrl,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  }
})

$axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

$axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('refresh_token')
    if (error.response && error.response.status === 401 && refreshToken && !inLogginPage) {
        try {
          const { data } = await axios.post(`${baseUrl}/api/login/refresh/`, {
            refresh: refreshToken
          })
          localStorage.setItem('access_token', data.access)
          return $axios(originalRequest)
        } catch (error) {
          window.location.href = '/login'
          localStorage.clear()
        }
      }
      return Promise.reject(error)
    }
)
export default $axios