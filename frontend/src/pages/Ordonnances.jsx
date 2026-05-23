import { useEffect, useMemo, useState } from 'react'
import { HiOutlinePlus, HiOutlineEye, HiOutlineCamera } from 'react-icons/hi2'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { getStatusColor, formatCurrency } from '../utils/helpers'
import { listClients, normalizeClient } from '../services/clients'
import { listMedicaments, normalizeMedicament } from '../services/medicaments'
import { buildOrdonnanceFormData, createOrdonnance, listOrdonnances, normalizeOrdonnance } from '../services/ordonnances'

const EMPTY_FORM = {
  clientId: '',
  medicamentId: '',
  date: new Date().toISOString().split('T')[0],
  dosageMedicament: '',
  instructionsPosologie: '',
  notes: '',
  scan: null,
}

export default function Ordonnances() {
  const [ords, setOrds] = useState([])
  const [clients, setClients] = useState([])
  const [medicaments, setMedicaments] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const lookups = useMemo(() => ({
    clientsById: new Map(clients.map((client) => [client.id, client])),
    medicamentsById: new Map(medicaments.map((medicament) => [medicament.id, medicament])),
  }), [clients, medicaments])

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    try {
      setLoading(true)
      setError('')
      const [ordonnancesResponse, clientsResponse, medicamentsResponse] = await Promise.all([
        listOrdonnances(),
        listClients(),
        listMedicaments(),
      ])

      const normalizedClients = clientsResponse.map(normalizeClient)
      const normalizedMedicaments = medicamentsResponse.map(normalizeMedicament)
      const nextLookups = {
        clientsById: new Map(normalizedClients.map((client) => [client.id, client])),
        medicamentsById: new Map(normalizedMedicaments.map((medicament) => [medicament.id, medicament])),
      }

      setClients(normalizedClients)
      setMedicaments(normalizedMedicaments)
      setOrds(ordonnancesResponse.map((item) => normalizeOrdonnance(item, nextLookups)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const formData = buildOrdonnanceFormData(form)
      const response = await createOrdonnance(formData)
      const saved = normalizeOrdonnance(response.donnees, lookups)
      setOrds((current) => [...current, saved])
      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { header: 'N° Ordonnance', key: 'numero', render: (r) => <span style={{ fontWeight: 500, color: 'var(--primary)' }}>{r.numero}</span> },
    { header: 'Client', key: 'clientNom', render: (r) => <strong>{r.clientNom}</strong> },
    { header: 'Medecin', key: 'medecin' },
    { header: 'Date', key: 'date' },
    { header: 'Medicaments', render: (r) => <span>{r.medicaments.length} article(s)</span> },
    {
      header: 'Statut',
      render: (r) => {
        const c = getStatusColor(r.statut)
        return <span style={{ fontSize: 12, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{r.statut}</span>
      },
    },
    { header: 'Montant', render: (r) => <span style={{ fontWeight: 600 }}>{r.montantTotal == null ? '-' : formatCurrency(r.montantTotal)}</span> },
    {
      header: '',
      render: (r) => (
        <div className="btn-group">
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setViewModal(r) }}>
            <HiOutlineEye size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ordonnances</h1>
          <p>Gestion et numerisation des ordonnances</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline" onClick={() => setModalOpen(true)}><HiOutlineCamera size={16} /> Numeriser</button>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><HiOutlinePlus size={16} /> Nouvelle Ordonnance</button>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <DataTable columns={columns} data={ords} emptyText={loading ? 'Chargement...' : 'Aucune ordonnance disponible'} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouvelle Ordonnance"
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label>Client</label>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Selectionner un client...</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.prenom} {client.nom}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Medicament</label>
            <select value={form.medicamentId} onChange={(e) => setForm({ ...form, medicamentId: e.target.value })}>
              <option value="">Selectionner un medicament...</option>
              {medicaments.map((medicament) => <option key={medicament.id} value={medicament.id}>{medicament.designation}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="form-group"><label>Dosage</label><input value={form.dosageMedicament} onChange={(e) => setForm({ ...form, dosageMedicament: e.target.value })} placeholder="1 comprime x 2/jour" /></div>
          <div className="form-group"><label>Instructions</label><textarea rows={3} value={form.instructionsPosologie} onChange={(e) => setForm({ ...form, instructionsPosologie: e.target.value })} /></div>
          <div className="form-group"><label>Notes</label><textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="form-group"><label>Scan</label><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, scan: e.target.files?.[0] ?? null })} /></div>
        </div>
      </Modal>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title={viewModal?.numero || ''}
        footer={<><button className="btn btn-outline" onClick={() => setViewModal(null)}>Fermer</button></>}>
        {viewModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Client</label><p style={{ fontWeight: 600 }}>{viewModal.clientNom}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Medecin</label><p style={{ fontWeight: 600 }}>{viewModal.medecin}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Date</label><p style={{ fontWeight: 600 }}>{viewModal.date}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Statut</label><p style={{ fontWeight: 600 }}>{viewModal.statut}</p></div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Medicaments prescrits</label>
              <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                {viewModal.medicaments.length > 0
                  ? viewModal.medicaments.map((medicament, index) => <li key={index} style={{ marginBottom: 4 }}>{medicament}</li>)
                  : <li style={{ marginBottom: 4 }}>Information indisponible</li>}
              </ul>
            </div>
            <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Notes</label><p>{viewModal.notes || '-'}</p></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
