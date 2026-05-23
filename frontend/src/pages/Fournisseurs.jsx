import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTruck } from 'react-icons/hi2'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { formatCurrency, formatDate } from '../utils/helpers'
import { listMedicaments, normalizeMedicament } from '../services/medicaments'
import {
  buildFournisseurPayload,
  createFournisseur,
  createFournisseurOrder,
  getFournisseurStats,
  listFournisseurOrders,
  listFournisseurs,
  normalizeFournisseur,
  normalizeFournisseurOrder,
  normalizeFournisseurStats,
  updateFournisseur,
} from '../services/fournisseurs'

const EMPTY_FORM = { nom: '', contact: '', telephone: '', email: '', adresse: '', specialite: '' }
const EMPTY_ORDER = { medicamentId: '', quantite: '', prixUnitaire: '', date: '', notes: '' }

export default function Fournisseurs() {
  const [fournList, setFournList] = useState([])
  const [medicaments, setMedicaments] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFourn, setEditingFourn] = useState(null)
  const [statsModal, setStatsModal] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [ordersData, setOrdersData] = useState([])
  const [orderModal, setOrderModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [orderSaving, setOrderSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    try {
      setLoading(true)
      setError('')
      const [fournisseursResponse, medicamentsResponse] = await Promise.all([
        listFournisseurs(),
        listMedicaments(),
      ])

      const normalizedMedicaments = medicamentsResponse.map(normalizeMedicament)
      setMedicaments(normalizedMedicaments)
      setFournList(fournisseursResponse.map((fournisseur) => normalizeFournisseur(fournisseur)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditingFourn(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (fournisseur) => {
    setEditingFourn(fournisseur)
    setForm({
      nom: fournisseur.nom,
      contact: fournisseur.contact,
      telephone: fournisseur.telephone,
      email: fournisseur.email,
      adresse: fournisseur.adresse,
      specialite: fournisseur.specialite,
    })
    setModalOpen(true)
  }

  const openStats = async (fournisseur) => {
    try {
      setStatsModal(fournisseur)
      setStatsLoading(true)
      setError('')
      const [statsResponse, ordersResponse] = await Promise.all([
        getFournisseurStats(fournisseur.id),
        listFournisseurOrders(fournisseur.id),
      ])

      setStatsData(normalizeFournisseurStats(statsResponse))
      setOrdersData(ordersResponse.map(normalizeFournisseurOrder))
    } catch (err) {
      setError(err.message)
      setStatsData(null)
      setOrdersData([])
    } finally {
      setStatsLoading(false)
    }
  }

  const openOrder = (fournisseur) => {
    setOrderModal(fournisseur)
    setOrderForm(EMPTY_ORDER)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const payload = buildFournisseurPayload(form)
      const response = editingFourn
        ? await updateFournisseur(editingFourn.id, payload)
        : await createFournisseur(payload)

      const savedBase = response.donnees
      const statsResponse = await getFournisseurStats(savedBase.id).catch(() => null)
      const saved = normalizeFournisseur(savedBase, statsResponse)

      if (editingFourn) {
        setFournList((current) => current.map((item) => item.id === saved.id ? saved : item))
      } else {
        setFournList((current) => [...current, saved])
      }

      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleOrderSave = async () => {
    if (!orderModal) return

    try {
      setOrderSaving(true)
      setError('')
      await createFournisseurOrder(orderModal.id, {
        ordered_at: orderForm.date || null,
        notes: orderForm.notes || null,
        items: [{
          medicament_id: Number(orderForm.medicamentId),
          quantity: Number(orderForm.quantite),
          unit_price: Number(orderForm.prixUnitaire),
        }],
      })

      const statsResponse = await getFournisseurStats(orderModal.id)
      const ordersResponse = await listFournisseurOrders(orderModal.id)
      setStatsData(normalizeFournisseurStats(statsResponse))
      setOrdersData(ordersResponse.map(normalizeFournisseurOrder))
      setFournList((current) => current.map((item) => item.id === orderModal.id ? normalizeFournisseur(item, statsResponse) : item))
      setOrderModal(null)
      setOrderForm(EMPTY_ORDER)
    } catch (err) {
      setError(err.message)
    } finally {
      setOrderSaving(false)
    }
  }

  const columns = [
    { header: 'Fournisseur', key: 'nom', render: (r) => <strong>{r.nom}</strong> },
    { header: 'Contact', key: 'contact' },
    { header: 'Specialite', render: (r) => <span style={{ fontSize: 12, background: 'var(--info-light)', color: 'var(--info)', padding: '2px 8px', borderRadius: 4 }}>{r.specialite}</span> },
    { header: 'Telephone', key: 'telephone' },
    { header: 'Commandes', key: 'commandesTotal', render: (r) => <span style={{ fontWeight: 600 }}>{r.commandesTotal}</span> },
    { header: 'Montant Total', render: (r) => <span style={{ fontWeight: 600 }}>{formatCurrency(r.montantTotal)}</span> },
    { header: 'Derniere Cmd', render: (r) => formatDate(r.derniereCommande) },
    {
      header: 'Actions',
      render: (r) => (
        <div className="btn-group">
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openOrder(r) }} title="Commander">
            <HiOutlineTruck size={16} />
          </button>
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

  const totalCommandes = fournList.reduce((sum, fournisseur) => sum + fournisseur.commandesTotal, 0)
  const totalMontant = fournList.reduce((sum, fournisseur) => sum + fournisseur.montantTotal, 0)
  const statsChartData = ordersData.length > 0
    ? ordersData.slice(0, 6).reverse().map((order) => ({ month: formatDate(order.date), montant: order.montantTotal }))
    : [{ month: 'Aucune', montant: 0 }]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Fournisseurs</h1>
          <p>Gestion des fournisseurs et commandes</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus size={16} /> Ajouter Fournisseur</button>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <StatsGrid>
        <StatsCard icon={<HiOutlineTruck />} label="Total Fournisseurs" value={fournList.length} color="blue" />
        <StatsCard icon={<HiOutlineTruck />} label="Total Commandes" value={totalCommandes} color="green" />
        <StatsCard icon={<HiOutlineTruck />} label="Montant Total" value={formatCurrency(totalMontant)} color="orange" />
      </StatsGrid>

      <DataTable columns={columns} data={fournList} emptyText={loading ? 'Chargement...' : 'Aucun fournisseur disponible'} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFourn ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label>Nom</label><input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
          <div className="form-group"><label>Contact</label><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label>Telephone</label><input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Adresse</label><input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div>
          <div className="form-group"><label>Specialite</label><input value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal
        isOpen={!!orderModal}
        onClose={() => setOrderModal(null)}
        title={`Commander - ${orderModal?.nom}`}
        footer={<><button className="btn btn-outline" onClick={() => setOrderModal(null)}>Annuler</button><button className="btn btn-success" onClick={handleOrderSave} disabled={orderSaving}>{orderSaving ? 'Enregistrement...' : 'Passer la commande'}</button></>}
      >
        {orderModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label>Medicament</label>
              <select value={orderForm.medicamentId} onChange={(e) => setOrderForm({ ...orderForm, medicamentId: e.target.value })}>
                <option value="">Selectionner un medicament...</option>
                {medicaments.map((medicament) => <option key={medicament.id} value={medicament.id}>{medicament.designation}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Quantite</label><input type="number" value={orderForm.quantite} onChange={(e) => setOrderForm({ ...orderForm, quantite: e.target.value })} /></div>
              <div className="form-group"><label>Prix unitaire (DH)</label><input type="number" value={orderForm.prixUnitaire} onChange={(e) => setOrderForm({ ...orderForm, prixUnitaire: e.target.value })} /></div>
            </div>
            <div className="form-group"><label>Date de livraison souhaitee</label><input type="date" value={orderForm.date} onChange={(e) => setOrderForm({ ...orderForm, date: e.target.value })} /></div>
            <div className="form-group"><label>Notes</label><textarea rows={2} value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} /></div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!statsModal}
        onClose={() => { setStatsModal(null); setStatsData(null); setOrdersData([]) }}
        title={`Stats: ${statsModal?.nom}`}
        footer={<button className="btn btn-outline" onClick={() => { setStatsModal(null); setStatsData(null); setOrdersData([]) }}>Fermer</button>}
      >
        {statsModal && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Commandes Totales</label><p style={{ fontWeight: 700, fontSize: 18 }}>{statsLoading ? '...' : (statsData?.nombreCommandes ?? 0)}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Montant Total</label><p style={{ fontWeight: 700, fontSize: 18 }}>{statsLoading ? '...' : formatCurrency(statsData?.montantTotal ?? 0)}</p></div>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 12 }}>Commandes recentes</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="montant" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </div>
  )
}
