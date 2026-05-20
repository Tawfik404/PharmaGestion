import { useState } from 'react'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { clients as initialClients } from '../data/mockData'
import { formatCurrency, formatDate, exportToExcel } from '../utils/helpers'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineArrowUpTray, HiOutlineUserGroup } from 'react-icons/hi2'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const purchaseData = [
  { month: 'Jan', achats: 320 },
  { month: 'Fév', achats: 280 },
  { month: 'Mar', achats: 450 },
  { month: 'Avr', achats: 390 },
  { month: 'Mai', achats: 510 },
]

export default function Clients() {
  const [clientList, setClientList] = useState(initialClients)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [statsModal, setStatsModal] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '', dateNaissance: '', adresse: '', aDroitReduction: false, reduction: 0 })

  const openNew = () => {
    setEditingClient(null)
    setForm({ nom: '', prenom: '', telephone: '', email: '', dateNaissance: '', adresse: '', aDroitReduction: false, reduction: 0 })
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditingClient(c)
    setForm({ nom: c.nom, prenom: c.prenom, telephone: c.telephone, email: c.email, dateNaissance: c.dateNaissance, adresse: c.adresse, aDroitReduction: c.aDroitReduction, reduction: c.reduction })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingClient) {
      setClientList(clientList.map(c => c.id === editingClient.id ? { ...c, ...form } : c))
    } else {
      setClientList([...clientList, { id: Date.now(), ...form, achatsTotal: 0, derniereVisite: new Date().toISOString().split('T')[0] }])
    }
    setModalOpen(false)
  }

  const handleExport = () => {
    exportToExcel(clientList.map(c => ({
      Nom: c.nom, Prénom: c.prenom, Téléphone: c.telephone, Email: c.email,
      'Date Naissance': c.dateNaissance, Adresse: c.adresse,
      'Réduction': c.aDroitReduction ? c.reduction + '%' : 'Non',
      'Achats Total': c.achatsTotal,
    })), 'clients')
  }

  const columns = [
    { header: 'Nom Complet', render: r => <strong>{r.prenom} {r.nom}</strong> },
    { header: 'Téléphone', key: 'telephone' },
    { header: 'Email', key: 'email' },
    { header: 'Achats Total', render: r => <span style={{ fontWeight: 600 }}>{formatCurrency(r.achatsTotal)}</span> },
    { header: 'Réduction', render: r => r.aDroitReduction ?
      <span style={{ fontSize: 12, background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: 4 }}>{r.reduction}%</span> :
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>—</span>
    },
    { header: 'Dernière Visite', key: 'derniereVisite', render: r => formatDate(r.derniereVisite) },
    { header: 'Actions', render: r => (
      <div className="btn-group">
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setStatsModal(r) }} title="Statistiques">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
        </button>
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(r) }} title="Modifier">
          <HiOutlinePencilSquare size={16} />
        </button>
      </div>
    )},
  ]

  const totalAchats = clientList.reduce((s, c) => s + c.achatsTotal, 0)
  const clientsAvecReduction = clientList.filter(c => c.aDroitReduction).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p>Gestion de la base clients</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline" onClick={handleExport}><HiOutlineArrowUpTray size={16} /> Exporter Excel</button>
          <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus size={16} /> Ajouter Client</button>
        </div>
      </div>

      <StatsGrid>
        <StatsCard icon={<HiOutlineUserGroup />} label="Total Clients" value={clientList.length} color="blue" />
        <StatsCard icon={<HiOutlineUserGroup />} label="Achats Totaux" value={formatCurrency(totalAchats)} color="green" />
        <StatsCard icon={<HiOutlineUserGroup />} label="Avec Réduction" value={clientsAvecReduction} color="orange" />
      </StatsGrid>

      <DataTable columns={columns} data={clientList} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'Modifier Client' : 'Nouveau Client'}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave}>Enregistrer</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row">
            <div className="form-group"><label>Nom</label><input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} /></div>
            <div className="form-group"><label>Prénom</label><input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Téléphone</label><input value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Adresse</label><input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} /></div>
          <div className="form-group"><label>Date de naissance</label><input type="date" value={form.dateNaissance} onChange={e => setForm({...form, dateNaissance: e.target.value})} /></div>
          <div className="form-row">
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
              <input type="checkbox" checked={form.aDroitReduction} onChange={e => setForm({...form, aDroitReduction: e.target.checked})} id="reduction" />
              <label htmlFor="reduction" style={{ margin: 0 }}>Droit à réduction</label>
            </div>
            {form.aDroitReduction && <div className="form-group"><label>Réduction (%)</label><input type="number" value={form.reduction} onChange={e => setForm({...form, reduction: parseInt(e.target.value) || 0})} /></div>}
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!statsModal} onClose={() => setStatsModal(null)} title={`Stats: ${statsModal?.prenom} ${statsModal?.nom}`}
        footer={<button className="btn btn-outline" onClick={() => setStatsModal(null)}>Fermer</button>}>
        {statsModal && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Achats Total</label><p style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(statsModal.achatsTotal)}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Dernière Visite</label><p style={{ fontWeight: 600 }}>{formatDate(statsModal.derniereVisite)}</p></div>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 12 }}>Achats mensuels</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={purchaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="achats" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </div>
  )
}
