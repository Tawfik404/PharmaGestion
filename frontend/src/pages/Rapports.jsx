import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { HiOutlineArrowUpTray, HiOutlineDocumentChartBar } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { formatCurrency, exportToExcel } from '../utils/helpers'
import { listMedicaments, normalizeMedicament } from '../services/medicaments'
import { listFournisseurs } from '../services/fournisseurs'
import { listVentes, normalizeVente } from '../services/ventes'
import {
  fetchFinancialReport,
  fetchMedicinesReport,
  fetchSalesReport,
  fetchStockReport,
  fetchSuppliersReport,
} from '../services/reports'
import './Rapports.css'

const reportTypes = [
  { id: 'ventes', label: 'Rapport de Ventes' },
  { id: 'stock', label: 'Rapport de Stock' },
  { id: 'financier', label: 'Rapport Financier' },
  { id: 'fournisseurs', label: 'Rapport Fournisseurs' },
  { id: 'medicaments', label: 'Rapport Medicaments' },
]

const chartColors = ['#2563eb', '#059669', '#d97706', '#dc2626', '#64748b', '#0891b2']

function getErrorMessage(error) {
  return error?.message ?? 'Une erreur est survenue pendant le chargement des rapports.'
}

function collectRejectedMessages(results) {
  return results
    .filter((result) => result.status === 'rejected')
    .map((result) => getErrorMessage(result.reason))
}

export default function Rapports() {
  const { hasPermission } = useAuth()
  const [activeReport, setActiveReport] = useState('ventes')
  const [medications, setMedications] = useState([])
  const [ventes, setVentes] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [salesReport, setSalesReport] = useState(null)
  const [stockReport, setStockReport] = useState(null)
  const [financialReport, setFinancialReport] = useState(null)
  const [suppliersReport, setSuppliersReport] = useState(null)
  const [medicinesReport, setMedicinesReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function chargerRapports() {
    if (!hasPermission('rapports')) {
      setError('Acces non autorise a cette section.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const dataResults = await Promise.allSettled([
        listMedicaments(),
        listVentes(),
        listFournisseurs(),
      ])
      const reportResults = await Promise.allSettled([
        fetchSalesReport(),
        fetchStockReport(),
        fetchFinancialReport(),
        fetchSuppliersReport(),
        fetchMedicinesReport(),
      ])
      const [medicamentsResult, ventesResult, fournisseursResult] = dataResults
      const [salesResult, stockResult, financialResult, suppliersResult, medicinesResult] = reportResults

      setMedications(medicamentsResult.status === 'fulfilled' ? medicamentsResult.value.map(normalizeMedicament) : [])
      setVentes(ventesResult.status === 'fulfilled' ? ventesResult.value.map(normalizeVente) : [])
      setFournisseurs(fournisseursResult.status === 'fulfilled' ? fournisseursResult.value : [])
      setSalesReport(salesResult.status === 'fulfilled' ? salesResult.value : null)
      setStockReport(stockResult.status === 'fulfilled' ? stockResult.value : null)
      setFinancialReport(financialResult.status === 'fulfilled' ? financialResult.value : null)
      setSuppliersReport(suppliersResult.status === 'fulfilled' ? suppliersResult.value : null)
      setMedicinesReport(medicinesResult.status === 'fulfilled' ? medicinesResult.value : null)

      const loadErrors = [...collectRejectedMessages(dataResults), ...collectRejectedMessages(reportResults)]
      if (loadErrors.length > 0) {
        setError(loadErrors[0])
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void chargerRapports()
    })
    // Le chargement initial doit rester execute une seule fois au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalVentes = Number(salesReport?.montant_total_ventes ?? 0)
  const totalAchats = Number(financialReport?.achats_fournisseurs ?? 0)
  const benefice = Number(financialReport?.benefice_brut ?? 0)

  const salesData = (salesReport?.ventes_par_jour ?? []).map((item) => ({
    month: item.date?.slice(5) ?? '',
    ventes: Number(item.montant_total ?? 0),
  }))

  const categoryData = useMemo(() => {
    const grouped = medications.reduce((acc, medicament) => {
      const key = medicament.categorie || 'Autres'
      acc[key] = (acc[key] ?? 0) + medicament.quantiteDisponible
      return acc
    }, {})

    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      color: chartColors[index % chartColors.length],
    }))
  }, [medications])

  const supplierChartData = (suppliersReport?.par_fournisseur ?? []).map((item) => ({
    nom: ((item.nom ?? `Fournisseur #${item.id ?? ''}`) || 'Fournisseur').slice(0, 15),
    montant: Number(item.montant_total ?? 0),
  }))

  const medicineChartData = medications.map((medicament) => ({
    nom: medicament.designation.slice(0, 12),
    prix: medicament.prixVente,
    marge: medicament.prixVente - medicament.prixAchat,
  }))

  const handleExport = () => {
    if (activeReport === 'ventes') {
      exportToExcel(ventes.map((vente) => ({
        Date: vente.date,
        Client: vente.clientNom,
        Articles: vente.articles,
        Total: vente.total,
        Reduction: vente.reduction,
        Net: vente.net,
        Caissier: vente.caissier,
      })), 'ventes')
    } else if (activeReport === 'stock') {
      exportToExcel(medications.map((medicament) => ({
        Medicament: medicament.designation,
        Categorie: medicament.categorie,
        'Qte Min': medicament.quantiteMin,
        'Qte Dispo': medicament.quantiteDisponible,
      })), 'stock')
    } else if (activeReport === 'medicaments') {
      exportToExcel(medications.map((medicament) => ({
        Medicament: medicament.designation,
        'Prix Achat': medicament.prixAchat,
        'Prix Vente': medicament.prixVente,
        Marge: (medicament.prixVente - medicament.prixAchat).toFixed(2),
      })), 'medicaments')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rapports & Analyses</h1>
          <p>Suivi des performances de la pharmacie</p>
        </div>
        <button className="btn btn-outline" onClick={handleExport}>
          <HiOutlineArrowUpTray size={16} /> Exporter
        </button>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="rapports-tabs">
        {reportTypes.map((report) => (
          <button key={report.id} className={`rapports-tab ${activeReport === report.id ? 'active' : ''}`} onClick={() => setActiveReport(report.id)}>
            {report.label}
          </button>
        ))}
      </div>

      {activeReport === 'ventes' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Ventes Totales" value={formatCurrency(totalVentes)} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Nombre de Ventes" value={Number(salesReport?.nombre_ventes ?? ventes.length)} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Moyenne/Vente" value={formatCurrency(Number(salesReport?.nombre_ventes) ? totalVentes / Number(salesReport.nombre_ventes) : 0)} color="cyan" />
          </StatsGrid>
          <div className="rapports-chart-grid">
            <div className="chart-card">
              <h3>Evolution des Ventes</h3>
              {salesData.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventes" fill="#2563eb" name="Ventes" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="chart-card">
              <h3>Detail des Ventes Recentes</h3>
              <table>
                <thead><tr><th>Date</th><th>Client</th><th>Net</th></tr></thead>
                <tbody>
                  {ventes.slice(0, 10).map((vente) => (
                    <tr key={vente.id}><td>{vente.date}</td><td>{vente.clientNom}</td><td style={{ fontWeight: 600 }}>{formatCurrency(vente.net)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'stock' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Total Unites" value={medications.reduce((sum, medicament) => sum + medicament.quantiteDisponible, 0)} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Stock Bas" value={Number(stockReport?.nombre_alertes_stock_faible ?? 0)} color="red" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Valeur Stock" value={formatCurrency(Number(stockReport?.valeur_stock_vente ?? 0))} color="green" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Repartition du Stock par Categorie</h3>
            {categoryData.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {activeReport === 'financier' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Revenus" value={formatCurrency(Number(financialReport?.chiffre_affaires ?? 0))} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Depenses (Achats)" value={formatCurrency(totalAchats)} color="orange" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Benefice" value={formatCurrency(benefice)} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Marge Moyenne" value={`${totalVentes ? ((benefice / totalVentes) * 100).toFixed(1) : '0.0'}%`} color="cyan" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Suivi Financier</h3>
            {salesData.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ventes" stroke="#059669" name="Revenus" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {activeReport === 'fournisseurs' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Fournisseurs" value={fournisseurs.length} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Total Commandes" value={Number(suppliersReport?.nombre_commandes ?? 0)} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Montant Total" value={formatCurrency(Number(suppliersReport?.montant_total ?? 0))} color="orange" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Commandes par Fournisseur</h3>
            {supplierChartData.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="montant" fill="#2563eb" name="Montant (DH)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {activeReport === 'medicaments' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Total Medicaments" value={medications.length} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Alertes Stock Faible" value={(medicinesReport?.alertes_stock_faible ?? []).length} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Prix Moyen" value={formatCurrency(medications.length ? medications.reduce((sum, medicament) => sum + medicament.prixVente, 0) / medications.length : 0)} color="orange" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Prix de Vente par Medicament</h3>
            {medicineChartData.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={medicineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="nom" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="prix" fill="#2563eb" name="Prix Vente" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marge" fill="#059669" name="Marge" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {loading && <div style={{ color: 'var(--text-secondary)' }}>Chargement des rapports...</div>}
    </div>
  )
}
