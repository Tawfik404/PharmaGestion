import { apiRequest } from './api'

export async function listAdmins() {
  const payload = await apiRequest('/admin')
  return Array.isArray(payload) ? payload.map(normalizeAdmin) : []
}

export async function createAdmin(payload) {
  const response = await apiRequest('/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return normalizeAdmin(response.donnees)
}

export async function updateAdmin(id, payload) {
  const response = await apiRequest(`/admin/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return normalizeAdmin(response.donnees)
}

export function deleteAdmin(id) {
  return apiRequest(`/admin/${id}`, {
    method: 'DELETE',
  })
}

export function normalizeAdmin(item) {
  return {
    id: item.id,
    nom: `${item.prenom ?? ''} ${item.nom ?? ''}`.trim(),
    prenom: item.prenom ?? '',
    nomFamille: item.nom ?? '',
    email: item.email ?? '',
    telephone: item.telephone ?? '',
    role: item.role ?? 'caissier',
    statut: 'Actif',
  }
}

export function buildAdminPayload(form, includePassword = false) {
  const payload = {
    nom: form.nomFamille,
    prenom: form.prenom,
    email: form.email,
    telephone: form.telephone,
    role: form.role,
  }

  if (includePassword || form.password) {
    payload.password = form.password
  }

  return payload
}
