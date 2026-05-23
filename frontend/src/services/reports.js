import { apiRequest } from './api'

function buildQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString()

  return query ? `?${query}` : ''
}

export function fetchSalesReport(params = {}) {
  return apiRequest(`/reports/sales${buildQuery(params)}`)
}

export function fetchStockReport() {
  return apiRequest('/reports/stock')
}

export function fetchFinancialReport(params = {}) {
  return apiRequest(`/reports/financial${buildQuery(params)}`)
}

export function fetchSuppliersReport(params = {}) {
  return apiRequest(`/reports/suppliers${buildQuery(params)}`)
}

export function fetchMedicinesReport() {
  return apiRequest('/reports/medicines')
}
