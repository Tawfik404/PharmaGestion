import { useState } from 'react'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { medications, ventes, clients, fournisseurs } from '../data/mockData'
import { formatCurrency, exportToExcel } from '../utils/helpers'
import { HiOutlineArrowUpTray, HiOutlineDocumentChartBar } from 'react-icons/hi2'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import './Rapports.css'

const reportTypes = [
  { id: 'ventes', label: 'Rapport de Ventes' },
  { id: 'stock', label: 'Rapport de Stock' },
  { id: 'financier', label: 'Rapport Financier' },
  { id: 'fournisseurs', label: 'Rapport Fournisseurs' },
  { id: 'medicaments', label: 'Rapport Médicaments' },
]

const salesData = [
  { month: 'Jan', ventes: 4200, achats: 2800 },
  { month: 'Fév', ventes: 3800, achats: 2500 },
  { month: 'Mar', ventes: 5100, achats: 3200 },
  { month: 'Avr', ventes: 4700, achats: 2900 },
  { month: 'Mai', ventes: 5500, achats: 3400 },
]

const categoryData = [
  { name: 'Antalgique', value: 35, color: '#2563eb' },
  { name: 'Antibiotique', value: 25, color: '#059669' },
  { name: 'Anti-inflammatoire', value: 15, color: '#d97706' },
  { name: 'Gastro', value: 12, color: '#dc2626' },
  { name: 'Autres', value: 13, color: '#64748b' },
]

export default function Rapports() {
  const [activeReport, setActiveReport] = useState('ventes')

  const totalVentes = ventes.reduce((s, v) => s + v.net, 0)
  const totalAchats = medications.reduce((s, m) => s + m.prixAchat * m.quantiteDisponible, 0)
  const benefice = totalVentes - totalAchats

  const handleExport = () => {
    if (activeReport === 'ventes') {
      exportToExcel(ventes.map(v => ({
        Date: v.date, Client: v.clientNom, Articles: v.articles,
        Total: v.total, Réduction: v.reduction, Net: v.net, Caissier: v.caissier,
      })), 'rapport_ventes')
    } else if (activeReport === 'stock') {
      exportToExcel(medications.map(m => ({
        Médicament: m.designation, Catégorie: m.categorie,
        'Qté Min': m.quantiteMin, 'Qté Dispo': m.quantiteDisponible,
      })), 'rapport_stock')
    } else if (activeReport === 'medicaments') {
      exportToExcel(medications.map(m => ({
        Médicament: m.designation, 'Prix Achat': m.prixAchat, 'Prix Vente': m.prixVente,
        Marge: (m.prixVente - m.prixAchat).toFixed(2),
      })), 'rapport_medicaments')
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

      <div className="rapports-tabs">
        {reportTypes.map(r => (
          <button key={r.id} className={`rapports-tab ${activeReport === r.id ? 'active' : ''}`} onClick={() => setActiveReport(r.id)}>
            {r.label}
          </button>
        ))}
      </div>

      {activeReport === 'ventes' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Ventes Totales" value={formatCurrency(totalVentes)} change={12} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Nombre de Ventes" value={ventes.length} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Moyenne/Vente" value={formatCurrency(totalVentes / ventes.length)} color="cyan" />
          </StatsGrid>
          <div className="rapports-chart-grid">
            <div className="chart-card">
              <h3>Évolution des Ventes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventes" fill="#2563eb" name="Ventes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="achats" fill="#059669" name="Achats" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Détail des Ventes Récentes</h3>
              <table>
                <thead><tr><th>Date</th><th>Client</th><th>Net</th></tr></thead>
                <tbody>
                  {ventes.map(v => (
                    <tr key={v.id}><td>{v.date}</td><td>{v.clientNom}</td><td style={{ fontWeight: 600 }}>{formatCurrency(v.net)}</td></tr>
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
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Total Unités" value={medications.reduce((s, m) => s + m.quantiteDisponible, 0)} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Stock Bas" value={medications.filter(m => m.quantiteDisponible < m.quantiteMin).length} color="red" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Valeur Stock" value={formatCurrency(medications.reduce((s, m) => s + m.prixVente * m.quantiteDisponible, 0))} color="green" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Répartition du Stock par Catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'financier' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Revenus" value={formatCurrency(totalVentes)} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Dépenses (Achats)" value={formatCurrency(totalAchats)} color="orange" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Bénéfice" value={formatCurrency(benefice)} change={8} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Marge Moyenne" value={((benefice / totalVentes) * 100).toFixed(1) + '%'} color="cyan" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Suivi Financier</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventes" stroke="#059669" name="Revenus" strokeWidth={2} />
                <Line type="monotone" dataKey="achats" stroke="#dc2626" name="Dépenses" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'fournisseurs' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Fournisseurs" value={fournisseurs.length} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Total Commandes" value={fournisseurs.reduce((s, f) => s + f.commandesTotal, 0)} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Montant Total" value={formatCurrency(fournisseurs.reduce((s, f) => s + f.montantTotal, 0))} color="orange" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Commandes par Fournisseur</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fournisseurs.map(f => ({ nom: f.nom.substring(0, 15), commandes: f.commandesTotal, montant: f.montantTotal }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="montant" fill="#2563eb" name="Montant (DA)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'medicaments' && (
        <div>
          <StatsGrid>
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Total Médicaments" value={medications.length} color="blue" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Catégories" value={new Set(medications.map(m => m.categorie)).size} color="green" />
            <StatsCard icon={<HiOutlineDocumentChartBar />} label="Prix Moyen" value={formatCurrency(medications.reduce((s, m) => s + m.prixVente, 0) / medications.length)} color="orange" />
          </StatsGrid>
          <div className="chart-card">
            <h3>Prix de Vente par Médicament</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medications.map(m => ({ nom: m.designation.substring(0, 12), prix: m.prixVente, marge: m.prixVente - m.prixAchat }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nom" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="prix" fill="#2563eb" name="Prix Vente" radius={[4, 4, 0, 0]} />
                <Bar dataKey="marge" fill="#059669" name="Marge" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
