import { apiRequest } from './api'

export function listVentes(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString()

  return apiRequest(`/vente${query ? `?${query}` : ''}`).then((payload) => payload.donnees ?? [])
}

export function normalizeVente(item) {
  const items = item.items ?? []
  const clientNom = item.client
    ? `${item.client.prenom ?? ''} ${item.client.nom ?? ''}`.trim()
    : (item.customer_name || 'Client anonyme')

  return {
    id: item.id,
    date: item.sold_at?.slice(0, 10) ?? '',
    clientNom,
    articles: items.reduce((sum, ligne) => sum + Number(ligne.quantity ?? 0), 0),
    total: Number(item.subtotal ?? 0),
    reduction: Number(item.discount_amount ?? 0),
    net: Number(item.total ?? 0),
    caissier: item.admin?.prenom ? `${item.admin.prenom} ${item.admin.nom}`.trim() : '-',
    paymentMethod: item.payment_method ?? '',
    discountRate: Number(item.discount_rate ?? 0),
    items: items.map((ligne) => ({
      designation: ligne.medicament?.designation ?? '',
      qty: Number(ligne.quantity ?? 0),
      prixVente: Number(ligne.unit_sale_price ?? 0),
    })),
  }
}
