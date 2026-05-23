import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineArrowUpTray, HiOutlineUserGroup } from 'react-icons/hi2'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { formatCurrency, formatDate, exportToExcel } from '../utils/helpers'
import {
  buildClientPayload,
  createClient,
  getClientStats,
  listClients,
  normalizeClient,
  normalizeClientStats,
  updateClient,
} from '../services/clients'

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  dateNaissance: '',
  adresse: '',
  aDroitReduction: false,
  reduction: 0,
}

export default function Clients() {
  const [clientList, setClientList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [statsModal, setStatsModal] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    chargerClients()
  }, [])

  async function chargerClients() {
    try {
      setLoading(true)
      setError('')
      const response = await listClients()
      setClientList(response.map(normalizeClient))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditingClient(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (client) => {
    setEditingClient(client)
    setForm({ ...client })
    setModalOpen(true)
  }

  const openStats = async (client) => {
    try {
      setStatsModal(client)
      setStatsLoading(true)
      setError('')
      const response = await getClientStats(client.id)
      setStatsData(normalizeClientStats(response))
    } catch (err) {
      setError(err.message)
      setStatsData(null)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const payload = buildClientPayload(form)
      const response = editingClient
        ? await updateClient(editingClient.id, payload)
        : await createClient(payload)

      const saved = normalizeClient(response.donnees)
      if (editingClient) {
        setClientList((current) => current.map((item) => item.id === saved.id ? { ...item, ...saved } : item))
      } else {
        setClientList((current) => [...current, saved])
      }

      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    exportToExcel(clientList.map((client) => ({
      Nom: client.nom,
      Prenom: client.prenom,
      Telephone: client.telephone,
      Email: client.email,
      'Date Naissance': client.dateNaissance,
      Adresse: client.adresse,
      Reduction: client.aDroitReduction ? `${client.reduction}%` : 'Non',
      'Achats Total': client.achatsTotal,
    })), 'clients')
  }

  const columns = [
    { header: 'Nom Complet', render: (r) => <strong>{r.prenom} {r.nom}</strong> },
    { header: 'Telephone', key: 'telephone' },
    { header: 'Email', key: 'email' },
    { header: 'Achats Total', render: (r) => <span style={{ fontWeight: 600 }}>{formatCurrency(r.achatsTotal)}</span> },
    {
      header: 'Reduction',
      render: (r) => r.aDroitReduction
        ? <span style={{ fontSize: 12, background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: 4 }}>{r.reduction}%</span>
        : <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>-</span>,
    },
    { header: 'Derniere Visite', key: 'derniereVisite', render: (r) => formatDate(r.derniereVisite) },
    {
      header: 'Actions',
      render: (r) => (
        <div className="btn-group">
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openStats(r) }} title="Statistiques">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
          </button>
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(r) }} title="Modifier">
            <HiOutlinePencilSquare size={16} />
          </button>
        </div>
      ),
    },
  ]

  const totalAchats = clientList.reduce((sum, client) => sum + client.achatsTotal, 0)
  const clientsAvecReduction = clientList.filter((client) => client.aDroitReduction).length
  const statsChartData = statsData ? [
    { label: 'Ventes', value: statsData.nombreVentes },
    { label: 'Articles', value: statsData.nombreArticles },
  ] : []

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

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <StatsGrid>
        <StatsCard icon={<HiOutlineUserGroup />} label="Total Clients" value={clientList.length} color="blue" />
        <StatsCard icon={<HiOutlineUserGroup />} label="Achats Totaux" value={formatCurrency(totalAchats)} color="green" />
        <StatsCard icon={<HiOutlineUserGroup />} label="Avec Reduction" value={clientsAvecReduction} color="orange" />
      </StatsGrid>

      <DataTable columns={columns} data={clientList} emptyText={loading ? 'Chargement...' : 'Aucun client disponible'} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Modifier Client' : 'Nouveau Client'}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row">
            <div className="form-group"><label>Nom</label><input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div className="form-group"><label>Prenom</label><input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Telephone</label><input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Adresse</label><input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div>
          <div className="form-group"><label>Date de naissance</label><input type="date" value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
              <input type="checkbox" checked={form.aDroitReduction} onChange={(e) => setForm({ ...form, aDroitReduction: e.target.checked })} id="reduction" />
              <label htmlFor="reduction" style={{ margin: 0 }}>Droit a reduction</label>
            </div>
            {form.aDroitReduction && <div className="form-group"><label>Reduction (%)</label><input type="number" value={form.reduction} onChange={(e) => setForm({ ...form, reduction: parseInt(e.target.value, 10) || 0 })} /></div>}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!statsModal}
        onClose={() => { setStatsModal(null); setStatsData(null) }}
        title={`Stats: ${statsModal?.prenom} ${statsModal?.nom}`}
        footer={<button className="btn btn-outline" onClick={() => { setStatsModal(null); setStatsData(null) }}>Fermer</button>}
      >
        {statsModal && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Achats Total</label><p style={{ fontWeight: 700, fontSize: 18 }}>{statsLoading ? '...' : formatCurrency(statsData?.montantTotalAchats ?? 0)}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Derniere Visite</label><p style={{ fontWeight: 600 }}>{formatDate(statsModal.derniereVisite)}</p></div>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 12 }}>Activite client</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </div>
  )
}
