const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

function buildHeaders(token, extraHeaders = {}) {
  return {
    Accept: 'application/json',
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiRequest(path, options = {}) {
  const token = options.token ?? localStorage.getItem('token')
  const headers = buildHeaders(token, options.headers)

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.blob()

  if (!response.ok) {
    const message = payload?.message ?? 'Une erreur est survenue.'
    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export function getApiUrl() {
  return API_URL
}

export async function downloadRequest(path, filename) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}${path}`, {
    headers: buildHeaders(token),
  })

  if (!response.ok) {
    let message = 'Une erreur est survenue.'

    try {
      const payload = await response.json()
      message = payload?.message ?? message
    } catch {
      // Rien a faire.
    }

    throw new Error(message)
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
