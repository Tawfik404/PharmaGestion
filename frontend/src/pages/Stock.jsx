import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { formatCurrency, getStockLevel } from '../utils/helpers'
import { HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlineArchiveBox, HiOutlineArrowUpTray } from 'react-icons/hi2'
import { exportStock, listMedicamentsLowStock, listStockMovements, normalizeLowStock, normalizeStockMovement, replenishStock } from '../services/stock'
import { listMedicaments, normalizeMedicament } from '../services/medicaments'

export default function Stock() {
  const [medications, setMedications] = useState([])
  const [entries, setEntries] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ medicamentId: '', quantite: '', fournisseur: '', date: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    try {
      setLoading(true)
      setError('')
      const [medicamentsResponse, stockResponse] = await Promise.all([
        listMedicaments(),
        listStockMovements(),
      ])

      setMedications(medicamentsResponse.map(normalizeMedicament))
      setEntries(stockResponse.donnees.map(normalizeStockMovement))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalStock = useMemo(() => medications.reduce((s, m) => s + m.quantiteDisponible, 0), [medications])
  const lowStock = useMemo(() => medications.filter((m) => m.quantiteDisponible <= m.quantiteMin), [medications])
  const expiringSoon = useMemo(() => medications.filter((m) => {
    const exp = new Date(m.dateExpiration)
    const now = new Date()
    return (exp - now) / (1000 * 60 * 60 * 24) < 90
  }), [medications])

  const handleAddEntry = async () => {
    try {
      setSaving(true)
      setError('')
      const movementResponse = await replenishStock(form.medicamentId, {
        quantity: form.quantite,
        notes: form.fournisseur ? `Fournisseur: ${form.fournisseur}` : null,
      })

      const medicamentsResponse = await listMedicaments()
      setMedications(medicamentsResponse.map(normalizeMedicament))
      setEntries((current) => [normalizeStockMovement(movementResponse.donnees), ...current])
      setModalOpen(false)
      setForm({ medicamentId: '', quantite: '', fournisseur: '', date: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleExportStock = async () => {
    try {
      setError('')
      await exportStock()
    } catch (err) {
      setError(err.message)
    }
  }

  const stockColumns = [
    { header: 'N°', key: 'numero', render: (r) => <span style={{ fontWeight: 500, color: 'var(--primary)' }}>{`MED${String(r.numero).padStart(3, '0')}`}</span> },
    { header: 'Designation', key: 'designation', render: (r) => <strong>{r.designation}</strong> },
    { header: 'Qte Min', key: 'quantiteMin' },
    { header: 'Qte Disponible', key: 'quantiteDisponible', render: (r) => {
      const level = getStockLevel(r.quantiteDisponible, r.quantiteMin)
      return <span style={{ color: level.color, fontWeight: 600 }}>{r.quantiteDisponible}</span>
    }},
    { header: 'Statut', render: (r) => {
      const level = getStockLevel(r.quantiteDisponible, r.quantiteMin)
      return <span style={{ fontSize: 12, background: `${level.color}20`, color: level.color, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{level.label}</span>
    }},
    { header: 'Expiration', key: 'dateExpiration', render: (r) => {
      const exp = new Date(r.dateExpiration)
      const days = Math.ceil((exp - new Date()) / (1000 * 60 * 60 * 24))
      return <span style={{ color: days < 90 ? 'var(--warning)' : 'var(--text-primary)' }}>{r.dateExpiration} ({days}j)</span>
    }},
  ]

  const entryColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Medicament', key: 'medicament', render: (r) => <strong>{r.medicament}</strong> },
    { header: 'Quantite', key: 'quantite' },
    { header: 'Fournisseur / Notes', key: 'fournisseur' },
    { header: 'Type', key: 'type', render: (r) => <span style={{ fontSize: 12, background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: 4 }}>{r.type}</span> },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Gestion des Stocks</h1>
          <p>Suivi des stocks et alertes de reapprovisionnement</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline" onClick={handleExportStock}>
            <HiOutlineArrowUpTray size={16} /> Exporter Stock
          </button>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <HiOutlineArchiveBox size={16} /> Nouvelle Entree
          </button>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <StatsGrid>
        <StatsCard icon={<HiOutlineArchiveBox />} label="Stock Total" value={`${totalStock} unites`} color="blue" />
        <StatsCard icon={<HiOutlineExclamationTriangle />} label="Stock Bas" value={lowStock.length} color="red" />
        <StatsCard icon={<HiOutlineExclamationTriangle />} label="Expiration Proche" value={expiringSoon.length} color="orange" />
        <StatsCard icon={<HiOutlineCheckCircle />} label="Stock OK" value={Math.max(medications.length - lowStock.length, 0)} color="green" />
      </StatsGrid>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Etat du Stock</h2>
      <DataTable columns={stockColumns} data={medications} emptyText={loading ? 'Chargement...' : 'Aucun stock disponible'} />

      <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>Historique des Entrees</h2>
      <DataTable columns={entryColumns} data={entries} emptyText={loading ? 'Chargement...' : 'Aucun mouvement de stock disponible'} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouvelle Entree de Stock"
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleAddEntry} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="form-group"><label>Medicament</label>
            <select value={form.medicamentId} onChange={(e) => setForm({ ...form, medicamentId: e.target.value })}>
              <option value="">Selectionner...</option>
              {medications.map((m) => <option key={m.id} value={m.id}>{m.designation}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Quantite</label><input type="number" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: parseInt(e.target.value, 10) || 0 })} /></div>
          <div className="form-group"><label>Fournisseur</label><input value={form.fournisseur} onChange={(e) => setForm({ ...form, fournisseur: e.target.value })} /></div>
        </div>
      </Modal>
    </div>
  )
}
