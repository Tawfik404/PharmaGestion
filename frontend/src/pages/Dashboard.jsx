import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineUserGroup, HiOutlineShoppingCart, HiOutlineExclamationTriangle, HiOutlineTruck } from 'react-icons/hi2'
import { medications, clients, fournisseurs, ventes } from '../data/mockData'
import { formatCurrency, getStockLevel } from '../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import './Dashboard.css'

const salesData = [
  { month: 'Jan', ventes: 4200 },
  { month: 'Fév', ventes: 3800 },
  { month: 'Mar', ventes: 5100 },
  { month: 'Avr', ventes: 4700 },
  { month: 'Mai', ventes: 5500 },
]

const categoryData = [
  { name: 'Antalgique', value: 35, color: '#2563eb' },
  { name: 'Antibiotique', value: 25, color: '#059669' },
  { name: 'Anti-inflammatoire', value: 15, color: '#d97706' },
  { name: 'Gastro', value: 12, color: '#dc2626' },
  { name: 'Autres', value: 13, color: '#64748b' },
]

export default function Dashboard() {
  const totalStock = medications.reduce((s, m) => s + m.quantiteDisponible, 0)
  const lowStockCount = medications.filter(m => m.quantiteDisponible < m.quantiteMin).length
  const totalVentesMois = ventes.reduce((s, v) => s + v.net, 0)

  const recentSales = [...ventes].reverse().slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de votre pharmacie</p>
        </div>
      </div>

      <StatsGrid>
        <StatsCard icon={<HiOutlineCube />} label="Total Médicaments" value={medications.length} change={5} color="blue" />
        <StatsCard icon={<HiOutlineCurrencyDollar />} label="Ventes du mois" value={formatCurrency(totalVentesMois)} change={12} color="green" />
        <StatsCard icon={<HiOutlineUserGroup />} label="Clients enregistrés" value={clients.length} change={3} color="cyan" />
        <StatsCard icon={<HiOutlineShoppingCart />} label="Ventes aujourd'hui" value={ventes.filter(v => v.date === '2026-05-02').length} color="orange" />
        <StatsCard icon={<HiOutlineExclamationTriangle />} label="Stock bas" value={lowStockCount} color="red" />
        <StatsCard icon={<HiOutlineTruck />} label="Fournisseurs" value={fournisseurs.length} color="blue" />
      </StatsGrid>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Ventes Mensuelles</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="ventes" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Répartition par Catégorie</h3>
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
            {categoryData.map((cat, i) => (
              <span key={i} className="legend-item">
                <span className="legend-dot" style={{ background: cat.color }}></span>
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="chart-card">
          <h3>Ventes Récentes</h3>
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
              {recentSales.map(v => (
                <tr key={v.id}>
                  <td>{v.clientNom}</td>
                  <td>{v.date}</td>
                  <td>{v.articles}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(v.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-card">
          <h3>Stock Critique</h3>
          <div className="stock-alerts">
            {medications.filter(m => m.quantiteDisponible < m.quantiteMin).map(m => {
              const level = getStockLevel(m.quantiteDisponible, m.quantiteMin)
              return (
                <div key={m.id} className="stock-alert-item">
                  <div>
                    <strong>{m.designation}</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Seuil: {m.quantiteMin}</span>
                  </div>
                  <span style={{ color: level.color, fontWeight: 600, fontSize: 13 }}>{m.quantiteDisponible} restant(s)</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
