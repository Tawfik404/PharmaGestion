import { useEffect, useState } from 'react'
import MedicamentImage from '../components/ui/MedicamentImage'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { formatCurrency, formatDate, getStockLevel } from '../utils/helpers'
import { CATEGORIES_MED } from '../constants/medicaments'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineArrowUpTray } from 'react-icons/hi2'
import {
  buildMedicamentFormData,
  createMedicament,
  deleteMedicament,
  exportMedicaments,
  listMedicaments,
  normalizeMedicament,
  updateMedicament,
} from '../services/medicaments'

const EMPTY_FORM = {
  designation: '',
  prixAchat: '',
  prixVente: '',
  quantiteMin: '',
  quantiteDisponible: '',
  categorie: '',
  utilisations: '',
  contreIndications: '',
  effetsSecondaires: '',
  tauxPriseEnCharge: '',
  codeBarres: '',
  dateExpiration: '',
  photo: null,
}

export default function Medicaments() {
  const [meds, setMeds] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [viewModal, setViewModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    chargerMedicaments()
  }, [])

  async function chargerMedicaments() {
    try {
      setLoading(true)
      setError('')
      const response = await listMedicaments()
      setMeds(response.map(normalizeMedicament))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditingMed(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (med) => {
    setEditingMed(med)
    setForm({ ...EMPTY_FORM, ...med, photo: null })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const numero = editingMed?.numero ?? getNextNumero(meds)
      const formData = buildMedicamentFormData(form, numero)

      const response = editingMed
        ? await updateMedicament(editingMed.id, formData)
        : await createMedicament(formData)

      const medicament = normalizeMedicament(response.donnees)

      if (editingMed) {
        setMeds((current) => current.map((item) => item.id === medicament.id ? medicament : item))
      } else {
        setMeds((current) => [...current, medicament])
      }

      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce medicament ?')) {
      return
    }

    try {
      setError('')
      await deleteMedicament(id)
      setMeds((current) => current.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleExport = async () => {
    try {
      setError('')
      await exportMedicaments()
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    { header: 'N°', key: 'numero', render: (r) => <span style={{ fontWeight: 500, color: 'var(--primary)' }}>{`MED${String(r.numero).padStart(3, '0')}`}</span> },
    { header: 'Designation', key: 'designation', render: (r) => <strong>{r.designation}</strong> },
    { header: 'Categorie', key: 'categorie', render: (r) => <span style={{ fontSize: 12, background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4 }}>{r.categorie}</span> },
    { header: 'Prix Vente', key: 'prixVente', render: (r) => formatCurrency(r.prixVente) },
    { header: 'Stock', key: 'quantiteDisponible', render: (r) => {
      const level = getStockLevel(r.quantiteDisponible, r.quantiteMin)
      return <span style={{ color: level.color, fontWeight: 600 }}>{r.quantiteDisponible}</span>
    }},
    { header: 'Expire le', key: 'dateExpiration', render: (r) => formatDate(r.dateExpiration) },
    { header: 'Actions', render: (r) => (
      <div className="btn-group">
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(r) }} title="Modifier">
          <HiOutlinePencilSquare size={16} />
        </button>
        <button className="btn-icon danger" onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} title="Supprimer">
          <HiOutlineTrash size={16} />
        </button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Medicaments</h1>
          <p>Gestion du catalogue de medicaments</p>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline" onClick={handleExport}>
            <HiOutlineArrowUpTray size={16} /> Exporter Excel
          </button>
          <button className="btn btn-primary" onClick={openNew}>
            <HiOutlinePlus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <DataTable
        columns={columns}
        data={meds}
        onRowClick={setViewModal}
        emptyText={loading ? 'Chargement...' : 'Aucun medicament disponible'}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMed ? 'Modifier le medicament' : 'Ajouter un medicament'}
        large
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row">
            <div className="form-group"><label>Designation</label><input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
            <div className="form-group"><label>Categorie</label><select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}><option value="">Selectionner...</option>{CATEGORIES_MED.map((c) => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Prix Achat (DH)</label><input type="number" value={form.prixAchat} onChange={(e) => setForm({ ...form, prixAchat: parseFloat(e.target.value) || 0 })} /></div>
            <div className="form-group"><label>Prix Vente (DH)</label><input type="number" value={form.prixVente} onChange={(e) => setForm({ ...form, prixVente: parseFloat(e.target.value) || 0 })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Qte Minimale</label><input type="number" value={form.quantiteMin} onChange={(e) => setForm({ ...form, quantiteMin: parseInt(e.target.value, 10) || 0 })} /></div>
            <div className="form-group"><label>Qte Disponible</label><input type="number" value={form.quantiteDisponible} onChange={(e) => setForm({ ...form, quantiteDisponible: parseInt(e.target.value, 10) || 0 })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Taux Prise en Charge (%)</label><input type="number" value={form.tauxPriseEnCharge} onChange={(e) => setForm({ ...form, tauxPriseEnCharge: parseInt(e.target.value, 10) || 0 })} /></div>
            <div className="form-group"><label>Date d expiration</label><input type="date" value={form.dateExpiration} onChange={(e) => setForm({ ...form, dateExpiration: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Code a barres</label><input value={form.codeBarres} onChange={(e) => setForm({ ...form, codeBarres: e.target.value })} /></div>
          <div className="form-group"><label>Photo</label><input type="file" accept="image/*" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] ?? null })} /></div>
          <div className="form-group"><label>Utilisations</label><textarea rows={2} value={form.utilisations} onChange={(e) => setForm({ ...form, utilisations: e.target.value })} /></div>
          <div className="form-group"><label>Contre-indications</label><textarea rows={2} value={form.contreIndications} onChange={(e) => setForm({ ...form, contreIndications: e.target.value })} /></div>
          <div className="form-group"><label>Effets secondaires</label><textarea rows={2} value={form.effetsSecondaires} onChange={(e) => setForm({ ...form, effetsSecondaires: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        title={viewModal?.designation || ''}
        large
        footer={<><button className="btn btn-outline" onClick={() => setViewModal(null)}>Fermer</button><button className="btn btn-primary" onClick={() => { setViewModal(null); openEdit(viewModal) }}>Modifier</button></>}
      >
        {viewModal && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, alignItems: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MedicamentImage src={viewModal.photoUrl} alt={viewModal.designation} size="xl" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Numero</label><p style={{ fontWeight: 600 }}>{`MED${String(viewModal.numero).padStart(3, '0')}`}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Categorie</label><p style={{ fontWeight: 600 }}>{viewModal.categorie}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Prix Achat</label><p style={{ fontWeight: 600 }}>{formatCurrency(viewModal.prixAchat)}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Prix Vente</label><p style={{ fontWeight: 600 }}>{formatCurrency(viewModal.prixVente)}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Stock</label><p style={{ fontWeight: 600 }}>{viewModal.quantiteDisponible} / seuil: {viewModal.quantiteMin}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Expiration</label><p style={{ fontWeight: 600 }}>{formatDate(viewModal.dateExpiration)}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Taux PC</label><p style={{ fontWeight: 600 }}>{viewModal.tauxPriseEnCharge}%</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Code-barres</label><p style={{ fontWeight: 600 }}>{viewModal.codeBarres}</p></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Utilisations</label><p>{viewModal.utilisations}</p></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Contre-indications</label><p>{viewModal.contreIndications}</p></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Effets secondaires</label><p>{viewModal.effetsSecondaires}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function getNextNumero(medicaments) {
  const maximum = medicaments.reduce((max, item) => Math.max(max, Number(item.numero) || 0), 0)
  return maximum + 1
}
