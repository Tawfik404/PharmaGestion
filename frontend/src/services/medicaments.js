import { apiRequest, downloadRequest, getApiUrl } from './api'

export function listMedicaments() {
  return apiRequest('/medicament')
}

export function createMedicament(formData) {
  return apiRequest('/medicament', {
    method: 'POST',
    body: formData,
  })
}

export function updateMedicament(id, formData) {
  formData.append('_method', 'PUT')

  return apiRequest(`/medicament/${id}`, {
    method: 'POST',
    body: formData,
  })
}

export function deleteMedicament(id) {
  return apiRequest(`/medicament/${id}`, {
    method: 'DELETE',
  })
}

export function normalizeMedicament(item) {
  return {
    id: item.id,
    numero: item.numero,
    designation: item.designation,
    prixAchat: Number(item.prix_achat ?? 0),
    prixVente: Number(item.prix_vente ?? 0),
    quantiteMin: Number(item.qte_min ?? 0),
    quantiteDisponible: Number(item.qte_dispo ?? 0),
    categorie: item.categorie ?? '',
    utilisations: item.utilisations ?? '',
    contreIndications: item.contre_indications ?? '',
    effetsSecondaires: item.effets_secondaires ?? '',
    tauxPriseEnCharge: Number(item.taux_prise_en_charge ?? 0),
    codeBarres: item.code_barre ?? '',
    dateExpiration: item.date_expiration ?? '',
    photo: item.photo ?? null,
    photoUrl: resolveMedicamentPhotoUrl(item.photo),
  }
}

export function resolveMedicamentPhotoUrl(photo) {
  if (!photo || typeof photo !== 'string') {
    return null
  }

  if (/^https?:\/\//i.test(photo) || photo.startsWith('data:') || photo.startsWith('blob:')) {
    return photo
  }

  if (photo.startsWith('/')) {
    const apiOrigin = new URL(getApiUrl()).origin
    return `${apiOrigin}${photo}`
  }

  return photo
}

export function buildMedicamentFormData(form, numero) {
  const formData = new FormData()
  formData.append('numero', String(numero))
  formData.append('designation', form.designation)
  formData.append('categorie', form.categorie)
  formData.append('prix_achat', String(form.prixAchat ?? 0))
  formData.append('prix_vente', String(form.prixVente ?? 0))
  formData.append('qte_min', String(form.quantiteMin ?? 0))
  formData.append('qte_dispo', String(form.quantiteDisponible ?? 0))
  formData.append('utilisations', form.utilisations)
  formData.append('contre_indications', form.contreIndications)
  formData.append('effets_secondaires', form.effetsSecondaires)
  formData.append('taux_prise_en_charge', String(form.tauxPriseEnCharge ?? 0))
  formData.append('code_barre', form.codeBarres)
  formData.append('date_expiration', form.dateExpiration)

  if (form.photo instanceof File) {
    formData.append('photo', form.photo)
  }

  return formData
}
