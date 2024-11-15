import { get, post } from "./api"

export const login = async (userData) => {
  try {
    const response = await post(`/login`, userData)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const validateToken = async () => {
  try {
    const response = await get(`/userinfo`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getMe = async () => {
  try {
    const response = await get(`/userinfo`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const refreshToken = async () => {
  try {
    const response = await get(`/refresh`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await post(`/profile/logout`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await post("/profile/change-password", {
      oldPassword,
      newPassword,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const resetPasswordRequest = async (username) => {
  try {
    const response = await post(`/reset-password`, { username })
    return response.data
  } catch (error) {
    throw error
  }
}

export const register = async (userData) => {
  try {
    const response = await post(`/register`, userData)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const setSecretQuestion = async (question, answer) => {
  try {
    const response = await post("/profile/set-secret-question", {
      question,
      answer,
    })
    return response.data
  } catch (error) {
    console.error("Error setting secret question:", error)
    throw error
  }
}
