import { useState } from 'react'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineShieldCheck } from 'react-icons/hi2'

const initialUsers = [
  { id: 1, nom: 'Dr. Ahmed Benali', email: 'ahmed@pharmacie.dz', role: 'pharmacien', statut: 'Actif' },
  { id: 2, nom: 'Fatima Zahra', email: 'fatima@pharmacie.dz', role: 'caissier', statut: 'Actif' },
  { id: 3, nom: 'Mohamed Said', email: 'mohamed@pharmacie.dz', role: 'gestionnaire', statut: 'Actif' },
]

const roleLabels = { pharmacien: 'Pharmacien', caissier: 'Caissier', gestionnaire: 'Gestionnaire' }
const roleColors = { pharmacien: { bg: '#dbeafe', color: '#2563eb' }, caissier: { bg: '#d1fae5', color: '#059669' }, gestionnaire: { bg: '#fef3c7', color: '#d97706' } }
const rolePermissions = {
  pharmacien: ['Tableau de bord', 'Médicaments', 'Stock', 'Ordonnances', 'Point de Vente', 'Clients', 'Fournisseurs', 'Rapports', 'Utilisateurs'],
  caissier: ['Tableau de bord', 'Point de Vente', 'Clients'],
  gestionnaire: ['Tableau de bord', 'Médicaments', 'Stock', 'Fournisseurs', 'Rapports'],
}

export default function Utilisateurs() {
  const [users, setUsers] = useState(initialUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [permModal, setPermModal] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ nom: '', email: '', role: 'caissier' })

  const openNew = () => {
    setEditingUser(null)
    setForm({ nom: '', email: '', role: 'caissier' })
    setModalOpen(true)
  }

  const openEdit = (u) => {
    setEditingUser(u)
    setForm({ nom: u.nom, email: u.email, role: u.role })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u))
    } else {
      setUsers([...users, { id: Date.now(), ...form, statut: 'Actif' }])
    }
    setModalOpen(false)
  }

  const columns = [
    { header: 'Nom', key: 'nom', render: r => <strong>{r.nom}</strong> },
    { header: 'Email', key: 'email' },
    { header: 'Rôle', render: r => {
      const c = roleColors[r.role]
      return <span style={{ fontSize: 12, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{roleLabels[r.role]}</span>
    }},
    { header: 'Statut', render: r => <span style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 500 }}>● {r.statut}</span> },
    { header: 'Actions', render: r => (
      <div className="btn-group">
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setPermModal(r) }} title="Permissions">
          <HiOutlineShieldCheck size={16} />
        </button>
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(r) }} title="Modifier">
          <HiOutlinePencilSquare size={16} />
        </button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Utilisateurs & Rôles</h1>
          <p>Gestion des accès et autorisations</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus size={16} /> Ajouter Utilisateur</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {Object.entries(rolePermissions).map(([role, perms]) => (
          <div key={role} className="chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <HiOutlineShieldCheck size={20} style={{ color: roleColors[role].color }} />
              <h3 style={{ margin: 0 }}>{roleLabels[role]}</h3>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {perms.map(p => <li key={p} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={users} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave}>Enregistrer</button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group"><label>Nom complet</label><input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>Rôle</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="pharmacien">Pharmacien</option>
              <option value="caissier">Caissier</option>
              <option value="gestionnaire">Gestionnaire</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!permModal} onClose={() => setPermModal(null)} title={`Permissions — ${permModal?.nom}`}
        footer={<button className="btn btn-outline" onClick={() => setPermModal(null)}>Fermer</button>}>
        {permModal && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Rôle: </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: roleColors[permModal.role].color }}>{roleLabels[permModal.role]}</span>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Modules autorisés:</h4>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {rolePermissions[permModal.role].map(p => (
                <li key={p} style={{ fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  )
}
