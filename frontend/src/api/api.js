import axios from "axios"

const API_BACKEND = "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BACKEND,
})

api.interceptors.request.use(function (config) {
  let token = localStorage.getItem("token")
  config.headers["Authorization"] = "Bearer " + token
  return config
})

api.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export const get = (path, config = {}) => {
  return api.get(path, config)
}

export const post = (path, data, config = {}) => {
  return api.post(path, data, config)
}

export const put = (path, data, config = {}) => {
  return api.put(path, data, config)
}

export const remove = (path, config = {}) => {
  return api.delete(path, config)
}
