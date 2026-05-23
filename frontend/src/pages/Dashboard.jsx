import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineUserGroup, HiOutlineShoppingCart, HiOutlineExclamationTriangle, HiOutlineTruck } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { formatCurrency, getStockLevel } from '../utils/helpers'
import { listMedicaments, normalizeMedicament } from '../services/medicaments'
import { listClients, normalizeClient } from '../services/clients'
import { listFournisseurs, normalizeFournisseur } from '../services/fournisseurs'
import { listVentes, normalizeVente } from '../services/ventes'
import { fetchSalesReport } from '../services/reports'
import './Dashboard.css'

const chartColors = ['#2563eb', '#059669', '#d97706', '#dc2626', '#64748b', '#0891b2']

export default function Dashboard() {
  const { hasPermission } = useAuth()
  const [medications, setMedications] = useState([])
  const [clients, setClients] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [ventes, setVentes] = useState([])
  const [salesReport, setSalesReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    chargerDashboard()
  }, [])

  async function chargerDashboard() {
    try {
      setLoading(true)
      setError('')
      const [medicamentsResponse, clientsResponse, ventesResponse] = await Promise.all([
        listMedicaments(),
        listClients(),
        listVentes(),
      ])
      const fournisseursResponse = hasPermission('fournisseurs')
        ? await listFournisseurs().catch(() => [])
        : []
      const salesReportResponse = hasPermission('rapports')
        ? await fetchSalesReport().catch(() => null)
        : null

      setMedications(medicamentsResponse.map(normalizeMedicament))
      setClients(clientsResponse.map(normalizeClient))
      setFournisseurs(fournisseursResponse.map((item) => normalizeFournisseur(item)))
      setVentes(ventesResponse.map(normalizeVente))
      setSalesReport(salesReportResponse)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalStock = medications.reduce((sum, medicament) => sum + medicament.quantiteDisponible, 0)
  const lowStockItems = useMemo(() => medications.filter((medicament) => medicament.quantiteDisponible < medicament.quantiteMin), [medications])
  const totalVentesMois = Number(salesReport?.montant_total_ventes ?? ventes.reduce((sum, vente) => sum + vente.net, 0))
  const recentSales = ventes.slice(0, 5)
  const today = new Intl.DateTimeFormat('en-CA').format(new Date())
  const todaysSales = ventes.filter((vente) => vente.date === today).length

  const groupedSales = ventes.reduce((acc, vente) => {
    const key = vente.date || ''
    if (!key) return acc
    acc[key] = (acc[key] ?? 0) + vente.net
    return acc
  }, {})
  const salesDataSource = salesReport?.ventes_par_jour?.length
    ? salesReport.ventes_par_jour.map((item) => ({
      date: item.date ?? '',
      montant_total: Number(item.montant_total ?? 0),
    }))
    : Object.entries(groupedSales).map(([date, montant_total]) => ({ date, montant_total }))
  const salesData = salesDataSource.slice(-7).map((item) => ({
    month: item.date?.slice(5) ?? '',
    ventes: Number(item.montant_total ?? 0),
  }))

  const categoryMap = medications.reduce((acc, medicament) => {
    const key = medicament.categorie || 'Autres'
    acc[key] = (acc[key] ?? 0) + medicament.quantiteDisponible
    return acc
  }, {})

  const categoryData = Object.entries(categoryMap).map(([name, value], index) => ({
    name,
    value,
    color: chartColors[index % chartColors.length],
  }))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de votre pharmacie</p>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <StatsGrid>
        <StatsCard icon={<HiOutlineCube />} label="Total Medicaments" value={medications.length} color="blue" />
        <StatsCard icon={<HiOutlineCurrencyDollar />} label="Ventes de la periode" value={formatCurrency(totalVentesMois)} color="green" />
        <StatsCard icon={<HiOutlineUserGroup />} label="Clients enregistres" value={clients.length} color="cyan" />
        <StatsCard icon={<HiOutlineShoppingCart />} label="Ventes aujourd'hui" value={todaysSales} color="orange" />
        <StatsCard icon={<HiOutlineExclamationTriangle />} label="Stock bas" value={lowStockItems.length} color="red" />
        <StatsCard icon={<HiOutlineTruck />} label="Fournisseurs" value={fournisseurs.length} color="blue" />
      </StatsGrid>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Ventes recentes</h3>
          {salesData.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="ventes" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h3>Repartition par Categorie</h3>
          {categoryData.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>Aucune donnee disponible.</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {categoryData.map((cat, index) => (
                  <span key={index} className="legend-item">
                    <span className="legend-dot" style={{ background: cat.color }}></span>
                    {cat.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="chart-card">
          <h3>Ventes Recentes</h3>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ color: 'var(--text-secondary)' }}>Chargement...</td></tr>
              ) : recentSales.length === 0 ? (
                <tr><td colSpan="4" style={{ color: 'var(--text-secondary)' }}>Aucune vente disponible.</td></tr>
              ) : recentSales.map((vente) => (
                <tr key={vente.id}>
                  <td>{vente.clientNom}</td>
                  <td>{vente.date}</td>
                  <td>{vente.articles}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(vente.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-card">
          <h3>Stock Critique</h3>
          <div className="stock-alerts">
            {lowStockItems.map((medicament) => {
              const level = getStockLevel(medicament.quantiteDisponible, medicament.quantiteMin)
              return (
                <div key={medicament.id} className="stock-alert-item">
                  <div>
                    <strong>{medicament.designation}</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Seuil: {medicament.quantiteMin}</span>
                  </div>
                  <span style={{ color: level.color, fontWeight: 600, fontSize: 13 }}>{medicament.quantiteDisponible} restant(s)</span>
                </div>
              )
            })}
            {!loading && lowStockItems.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Aucun stock critique.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
