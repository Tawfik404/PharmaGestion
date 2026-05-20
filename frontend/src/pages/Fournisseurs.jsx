import { useState } from 'react'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { StatsCard, StatsGrid } from '../components/ui/StatsCard'
import { fournisseurs as initialFourn } from '../data/mockData'
import { formatCurrency, formatDate } from '../utils/helpers'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTruck } from 'react-icons/hi2'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Fournisseurs() {
  const [fournList, setFournList] = useState(initialFourn)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFourn, setEditingFourn] = useState(null)
  const [statsModal, setStatsModal] = useState(null)
  const [orderModal, setOrderModal] = useState(null)
  const [form, setForm] = useState({ nom: '', contact: '', telephone: '', email: '', adresse: '', specialite: '' })

  const openNew = () => {
    setEditingFourn(null)
    setForm({ nom: '', contact: '', telephone: '', email: '', adresse: '', specialite: '' })
    setModalOpen(true)
  }

  const openEdit = (f) => {
    setEditingFourn(f)
    setForm({ nom: f.nom, contact: f.contact, telephone: f.telephone, email: f.email, adresse: f.adresse, specialite: f.specialite })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingFourn) {
      setFournList(fournList.map(f => f.id === editingFourn.id ? { ...f, ...form } : f))
    } else {
      setFournList([...fournList, { id: Date.now(), ...form, commandesTotal: 0, montantTotal: 0, derniereCommande: null }])
    }
    setModalOpen(false)
  }

  const columns = [
    { header: 'Fournisseur', key: 'nom', render: r => <strong>{r.nom}</strong> },
    { header: 'Contact', key: 'contact' },
    { header: 'Spécialité', render: r => <span style={{ fontSize: 12, background: 'var(--info-light)', color: 'var(--info)', padding: '2px 8px', borderRadius: 4 }}>{r.specialite}</span> },
    { header: 'Téléphone', key: 'telephone' },
    { header: 'Commandes', key: 'commandesTotal', render: r => <span style={{ fontWeight: 600 }}>{r.commandesTotal}</span> },
    { header: 'Montant Total', render: r => <span style={{ fontWeight: 600 }}>{formatCurrency(r.montantTotal)}</span> },
    { header: 'Dernière Cmd', render: r => formatDate(r.derniereCommande) },
    { header: 'Actions', render: r => (
      <div className="btn-group">
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setOrderModal(r) }} title="Commander">
          <HiOutlineTruck size={16} />
        </button>
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setStatsModal(r) }} title="Statistiques">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
        </button>
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(r) }} title="Modifier">
          <HiOutlinePencilSquare size={16} />
        </button>
      </div>
    )},
  ]

  const totalCommandes = fournList.reduce((s, f) => s + f.commandesTotal, 0)
  const totalMontant = fournList.reduce((s, f) => s + f.montantTotal, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Fournisseurs</h1>
          <p>Gestion des fournisseurs et commandes</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus size={16} /> Ajouter Fournisseur</button>
      </div>

      <StatsGrid>
        <StatsCard icon={<HiOutlineTruck />} label="Total Fournisseurs" value={fournList.length} color="blue" />
        <StatsCard icon={<HiOutlineTruck />} label="Total Commandes" value={totalCommandes} color="green" />
        <StatsCard icon={<HiOutlineTruck />} label="Montant Total" value={formatCurrency(totalMontant)} color="orange" />
      </StatsGrid>

      <DataTable columns={columns} data={fournList} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingFourn ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave}>Enregistrer</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label>Nom</label><input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} /></div>
          <div className="form-group"><label>Contact</label><input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
          <div className="form-row">
            <div className="form-group"><label>Téléphone</label><input value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Adresse</label><input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} /></div>
          <div className="form-group"><label>Spécialité</label><input value={form.specialite} onChange={e => setForm({...form, specialite: e.target.value})} /></div>
        </div>
      </Modal>

      <Modal isOpen={!!orderModal} onClose={() => setOrderModal(null)} title={`Commander — ${orderModal?.nom}`}
        footer={<><button className="btn btn-outline" onClick={() => setOrderModal(null)}>Annuler</button><button className="btn btn-success" onClick={() => setOrderModal(null)}>Passer la commande</button></>}>
        {orderModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group"><label>Médicament</label><input placeholder="Nom du médicament" /></div>
            <div className="form-row">
              <div className="form-group"><label>Quantité</label><input type="number" placeholder="0" /></div>
              <div className="form-group"><label>Prix unitaire (DA)</label><input type="number" placeholder="0.00" /></div>
            </div>
            <div className="form-group"><label>Date de livraison souhaitée</label><input type="date" /></div>
            <div className="form-group"><label>Notes</label><textarea rows={2} placeholder="Instructions spéciales..." /></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!statsModal} onClose={() => setStatsModal(null)} title={`Stats: ${statsModal?.nom}`}
        footer={<button className="btn btn-outline" onClick={() => setStatsModal(null)}>Fermer</button>}>
        {statsModal && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Commandes Totales</label><p style={{ fontWeight: 700, fontSize: 18 }}>{statsModal.commandesTotal}</p></div>
              <div><label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Montant Total</label><p style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(statsModal.montantTotal)}</p></div>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 12 }}>Commandes mensuelles</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { month: 'Jan', montant: 15000 },
                { month: 'Fév', montant: 22000 },
                { month: 'Mar', montant: 18000 },
                { month: 'Avr', montant: 28000 },
              ]}>
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
