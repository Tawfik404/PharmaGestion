import { apiRequest } from './api'

export async function fetchInventory() {
  const data = await apiRequest('/medicament')
  return data
}

export async function fetchClients() {
  const data = await apiRequest('/client')
  return data
}

export async function processSale(saleData) {
  return apiRequest('/vente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData),
  })
}
