import { apiRequest } from './api'

export function listClients() {
  return apiRequest('/client')
}

export function createClient(payload) {
  return apiRequest('/client', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateClient(id, payload) {
  return apiRequest(`/client/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteClient(id) {
  return apiRequest(`/client/${id}`, {
    method: 'DELETE',
  })
}

export function getClientStats(id, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString()

  return apiRequest(`/client/${id}/stats${query ? `?${query}` : ''}`)
}

export function normalizeClient(item) {
  return {
    id: item.id,
    nom: item.nom ?? '',
    prenom: item.prenom ?? '',
    telephone: item.telephone ?? '',
    email: item.email ?? '',
    dateNaissance: item.date_naissance ?? '',
    adresse: item.adresse ?? '',
    aDroitReduction: Boolean(item.is_discounted),
    reduction: Number(item.discount_rate ?? 0),
    achatsTotal: Number(item.achats_total ?? 0),
    derniereVisite: item.derniere_visite ?? '',
  }
}

export function normalizeClientStats(payload) {
  return {
    montantTotalAchats: Number(payload.montant_total_achats ?? 0),
    nombreVentes: Number(payload.nombre_ventes ?? 0),
    nombreArticles: Number(payload.nombre_articles ?? 0),
  }
}

export function buildClientPayload(form) {
  return {
    nom: form.nom,
    prenom: form.prenom,
    telephone: form.telephone,
    email: form.email || null,
    date_naissance: form.dateNaissance || null,
    adresse: form.adresse || null,
    is_discounted: Boolean(form.aDroitReduction),
    discount_rate: form.aDroitReduction ? Number(form.reduction ?? 0) : 0,
  }
}
