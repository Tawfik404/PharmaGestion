import { apiRequest } from './api'

export function listFournisseurs() {
  return apiRequest('/fournisseur')
}

export function createFournisseur(payload) {
  return apiRequest('/fournisseur', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateFournisseur(id, payload) {
  return apiRequest(`/fournisseur/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteFournisseur(id) {
  return apiRequest(`/fournisseur/${id}`, {
    method: 'DELETE',
  })
}

export function getFournisseurStats(id, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString()

  return apiRequest(`/fournisseur/${id}/stats${query ? `?${query}` : ''}`)
}

export function listFournisseurOrders(id) {
  return apiRequest(`/fournisseur/${id}/orders`).then((payload) => payload.donnees ?? [])
}

export function createFournisseurOrder(id, payload) {
  return apiRequest(`/fournisseur/${id}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function normalizeFournisseur(item, stats = null) {
  return {
    id: item.id,
    nom: item.nom ?? '',
    contact: item.contact ?? '',
    telephone: item.telephone ?? '',
    email: item.email ?? '',
    adresse: item.adresse ?? '',
    specialite: item.specialite ?? '',
    commandesTotal: Number(stats?.nombre_commandes ?? item.commandes_total ?? 0),
    montantTotal: Number(stats?.montant_total ?? item.montant_total ?? 0),
    derniereCommande: item.derniere_commande ?? stats?.derniere_commande ?? null,
  }
}

export function normalizeFournisseurStats(payload) {
  return {
    nombreCommandes: Number(payload.nombre_commandes ?? 0),
    montantTotal: Number(payload.montant_total ?? 0),
    derniereCommande: payload.derniere_commande ?? null,
  }
}

export function normalizeFournisseurOrder(item) {
  return {
    id: item.id,
    date: item.ordered_at ?? '',
    statut: item.status ?? '',
    montantTotal: Number(item.total_amount ?? 0),
    items: item.items ?? [],
  }
}

export function buildFournisseurPayload(form) {
  return {
    nom: form.nom,
    contact: form.contact || null,
    telephone: form.telephone,
    email: form.email || null,
    adresse: form.adresse || null,
    specialite: form.specialite || null,
  }
}
