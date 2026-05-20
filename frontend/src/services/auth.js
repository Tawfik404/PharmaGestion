import { apiRequest } from './api'

export function loginRequest(email, password) {
  return apiRequest('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    token: null,
  })
}

export function meRequest(token) {
  return apiRequest('/me', { token })
}

export function logoutRequest() {
  return apiRequest('/logout', {
    method: 'POST',
  })
}
