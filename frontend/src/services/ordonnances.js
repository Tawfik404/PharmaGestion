import { apiRequest } from './api'

export function listOrdonnances() {
  return apiRequest('/ordonnance')
}

export function createOrdonnance(formData) {
  return apiRequest('/ordonnance', {
    method: 'POST',
    body: formData,
  })
}

export function updateOrdonnance(id, formData) {
  formData.append('_method', 'PUT')

  return apiRequest(`/ordonnance/${id}`, {
    method: 'POST',
    body: formData,
  })
}

export function normalizeOrdonnance(item, lookups = {}) {
  const client = item.client ?? lookups.clientsById?.get(item.client_id)
  const medicamentList = Array.isArray(item.medicaments) ? item.medicaments : []
  const fallbackMedicament = lookups.medicamentsById?.get(item.medicament_id)
  const premierMedicament = medicamentList[0] ?? fallbackMedicament
  const pivot = medicamentList[0]?.pivot ?? {}
  const medecinNom = item.medecin
    ? `${item.medecin.prenom ?? ''} ${item.medecin.nom ?? ''}`.trim()
    : (item.medecin_id ? `Medecin #${item.medecin_id}` : '-')

  return {
    id: item.id,
    numero: item.numero ?? `ORD-${String(item.id).padStart(4, '0')}`,
    clientId: item.client_id ?? client?.id ?? '',
    clientNom: client ? `${client.prenom ?? ''} ${client.nom ?? ''}`.trim() : `Client #${item.client_id ?? '-'}`,
    medecin: medecinNom || '-',
    date: item.date_ordonnance ?? '',
    medicamentId: premierMedicament?.id ?? item.medicament_id ?? '',
    medicaments: medicamentList.length > 0
      ? medicamentList.map((medicament) => medicament.designation ?? 'Medicament')
      : (premierMedicament ? [premierMedicament.designation] : []),
    statut: item.statut ?? 'En attente',
    montantTotal: null,
    dosageMedicament: pivot.dosage_medicament ?? item.dosage_medicament ?? '',
    instructionsPosologie: pivot.instructions_posologie ?? item.instructions_posologie ?? '',
    notes: item.notes ?? '',
    scanPath: item.scan_path ?? '',
  }
}

export function buildOrdonnanceFormData(form) {
  const formData = new FormData()
  formData.append('client_id', String(form.clientId))
  formData.append('medicament_id', String(form.medicamentId))
  formData.append('date_ordonnance', form.date)
  formData.append('dosage_medicament', form.dosageMedicament)
  formData.append('instructions_posologie', form.instructionsPosologie)

  if (form.notes) {
    formData.append('notes', form.notes)
  }

  if (form.scan instanceof File) {
    formData.append('scan', form.scan)
  }

  return formData
}
