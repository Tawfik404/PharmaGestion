import * as XLSX from 'xlsx'

export function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function formatCurrency(val) {
  return new Intl.NumberFormat('fr-DZ', { style: 'decimal', minimumFractionDigits: 2 }).format(val) + ' DA'
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

export function getStatusColor(statut) {
  const colors = {
    'Traitée': { bg: '#d1fae5', color: '#059669' },
    'En attente': { bg: '#fef3c7', color: '#d97706' },
    'Annulée': { bg: '#fee2e2', color: '#dc2626' },
    'Livrée': { bg: '#dbeafe', color: '#2563eb' },
    'Brouillon': { bg: '#f1f5f9', color: '#64748b' },
  }
  return colors[statut] || { bg: '#f1f5f9', color: '#64748b' }
}

export function getStockLevel(qte, min) {
  if (qte <= 0) return { label: 'Rupture', color: '#dc2626' }
  if (qte < min) return { label: 'Critique', color: '#d97706' }
  if (qte < min * 1.5) return { label: 'Bas', color: '#ea580c' }
  return { label: 'OK', color: '#059669' }
}
