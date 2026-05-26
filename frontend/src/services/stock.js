import { apiRequest, downloadRequest } from './api'
import { normalizeMedicament } from './medicaments'

export function listStockMovements() {
  return apiRequest('/stock')
}

export function listMedicamentsLowStock() {
  return apiRequest('/medicament/alerts/low-stock')
}

export function replenishStock(medicamentId, payload) {
  return apiRequest(`/medicament/${medicamentId}/replenish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function normalizeStockMovement(item) {
  return {
    id: item.id,
    date: item.created_at?.slice(0, 10) ?? '',
    medicament: item.medicament?.designation ?? '',
    quantite: Math.abs(Number(item.quantity ?? 0)),
    fournisseur: item.notes ?? '',
    type: item.type ?? '',
    medicamentId: item.medicament_id,
  }
}

export function normalizeLowStock(items) {
  return items.map(normalizeMedicament)
}
