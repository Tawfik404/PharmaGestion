import { useState } from 'react'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { ordonnances as initialOrds, medications, clients } from '../data/mockData'
import { getStatusColor, formatCurrency } from '../utils/helpers'
import { HiOutlinePlus, HiOutlineEye, HiOutlineCamera } from 'react-icons/hi2'

export default function Ordonnances() {
  const [ords, setOrds] = useState(initialOrds)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState(null)
  const [form, setForm] = useState({ clientNom: '', medecin: '', medicaments: '', date: new Date().toISOString().split('T')[0] })

  const handleSave = () => {
    const newOrd = {
      id: Date.now(),
      numero: `ORD-2026-${String(ords.length + 1).padStart(3, '0')}`,
      ...form,
      medicaments: form.medicaments.split(',').map(s => s.trim()),
      statut: 'En attente',
      montantTotal: 0,
    }
    setOrds([...ords, newOrd])
    setModalOpen(false)
    setForm({ clientNom: '', medecin: '', medicaments: '', date: new Date().toISOString().split('T')[0] })
  }

  const columns = [
    { header: 'N° Ordonnance', key: 'numero', render: r => <span style={{ fontWeight: 500, color: 'var(--primary)' }}>{r.numero}</span> },
    { header: 'Client', key: 'clientNom', render: r => <strong>{r.clientNom}</strong> },
    { header: 'Médecin', key: 'medecin' },
    { header: 'Date', key: 'date' },
    { header: 'Médicaments', render: r => <span>{r.medicaments.length} article(s)</span> },
    { header: 'Statut', render: r => {
      const c = getStatusColor(r.statut)
      return <span style={{ fontSize: 12, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{r.statut}</span>
    }},
    { header: 'Montant', render: r => <span style={{ fontWeight: 600 }}>{formatCurrency(r.montantTotal)}</span> },
    { header: '', render: r => (
      <div className="btn-group">
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setViewModal(r) }}>
          <HiOutlineEye size={16} />
        </button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ordonnances</h1>
          <p>Gestion et numérisation des ordonnances</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline"><HiOutlineCamera size={16} /> Numériser</button>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><HiOutlinePlus size={16} /> Nouvelle Ordonnance</button>
        </div>
      </div>

      <DataTable columns={columns} data={ords} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle Ordonnance"
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave}>Enregistrer</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label>Client</label>
            <select value={form.clientNom} onChange={e => setForm({...form, clientNom: e.target.value})}>
              <option value="">Sélectionner un client...</option>
              {clients.map(c => <option key={c.id} value={`${c.prenom} ${c.nom}`}>{c.prenom} {c.nom}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Médecin</label><input value={form.medecin} onChange={e => setForm({...form, medecin: e.target.value})} placeholder="Dr. ..." /></div>
          <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div className="form-group"><label>Médicaments (séparés par virgule)</label>
            <textarea rows={3} value={form.medicaments} onChange={e => setForm({...form, medicaments: e.target.value})} placeholder="Paracétamol 500mg x2, Amoxicilline 1g x1" />
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title={viewModal?.numero || ''}
        footer={<><button className="btn btn-outline" onClick={() => setViewModal(null)}>Fermer</button></>}>
        {viewModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Client</label><p style={{ fontWeight: 600 }}>{viewModal.clientNom}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Médecin</label><p style={{ fontWeight: 600 }}>{viewModal.medecin}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Date</label><p style={{ fontWeight: 600 }}>{viewModal.date}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Statut</label><p style={{ fontWeight: 600 }}>{viewModal.statut}</p></div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Médicaments prescrits</label>
              <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                {viewModal.medicaments.map((m, i) => <li key={i} style={{ marginBottom: 4 }}>{m}</li>)}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
