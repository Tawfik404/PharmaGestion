import { useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineShieldCheck } from 'react-icons/hi2'
import DataTable from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { createAdmin, listAdmins, updateAdmin, buildAdminPayload } from '../services/admins'

const roleLabels = { gestionnaire: 'Gestionnaire', caissier: 'Caissier', pharmacien: 'Pharmacien' }
const roleColors = {
  gestionnaire: { bg: '#dbeafe', color: '#2563eb' },
  caissier: { bg: '#d1fae5', color: '#059669' },
  pharmacien: { bg: '#fef3c7', color: '#d97706' },
}
const rolePermissions = {
  gestionnaire: ['Tableau de bord', 'Medicaments', 'Stock', 'Ordonnances', 'Point de Vente', 'Clients', 'Fournisseurs', 'Rapports', 'Utilisateurs'],
  caissier: ['Tableau de bord', 'Point de Vente', 'Clients'],
  pharmacien: ['Tableau de bord', 'Medicaments', 'Stock', 'Clients', 'Fournisseurs', 'Rapports'],
}

const EMPTY_FORM = {
  prenom: '',
  nomFamille: '',
  email: '',
  telephone: '',
  role: 'caissier',
  password: '',
}

export default function Utilisateurs() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [permModal, setPermModal] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    chargerUtilisateurs()
  }, [])

  async function chargerUtilisateurs() {
    if (!hasPermission('utilisateurs')) {
      setUsers([])
      setLoading(false)
      setError('Acces non autorise a cette section.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await listAdmins()
      setUsers(response)
    } catch (err) {
      setError(err.status === 403 ? 'Acces non autorise a cette section.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setForm({
      prenom: user.prenom,
      nomFamille: user.nomFamille,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      password: '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const payload = buildAdminPayload(form, !editingUser)
      const saved = editingUser
        ? await updateAdmin(editingUser.id, payload)
        : await createAdmin(payload)

      if (editingUser) {
        setUsers((current) => current.map((item) => item.id === saved.id ? saved : item))
      } else {
        setUsers((current) => [...current, saved])
      }

      setModalOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.status === 403 ? 'Acces non autorise a cette action.' : err.message)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { header: 'Nom', key: 'nom', render: (r) => <strong>{r.nom}</strong> },
    { header: 'Email', key: 'email' },
    {
      header: 'Role',
      render: (r) => {
        const c = roleColors[r.role] ?? roleColors.caissier
        return <span style={{ fontSize: 12, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{roleLabels[r.role]}</span>
      },
    },
    { header: 'Statut', render: (r) => <span style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 500 }}>● {r.statut}</span> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="btn-group">
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setPermModal(r) }} title="Permissions">
            <HiOutlineShieldCheck size={16} />
          </button>
          <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openEdit(r) }} title="Modifier">
            <HiOutlinePencilSquare size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Utilisateurs & Roles</h1>
          <p>Gestion des acces et autorisations</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus size={16} /> Ajouter Utilisateur</button>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {Object.entries(rolePermissions).map(([role, perms]) => (
          <div key={role} className="chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <HiOutlineShieldCheck size={20} style={{ color: roleColors[role].color }} />
              <h3 style={{ margin: 0 }}>{roleLabels[role]}</h3>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {perms.map((permission) => <li key={permission} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{permission}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={users} emptyText={loading ? 'Chargement...' : 'Aucun utilisateur disponible'} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
        footer={<><button className="btn btn-outline" onClick={() => setModalOpen(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row">
            <div className="form-group"><label>Prenom</label><input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
            <div className="form-group"><label>Nom</label><input value={form.nomFamille} onChange={(e) => setForm({ ...form, nomFamille: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label>Telephone</label><input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="gestionnaire">Gestionnaire</option>
              <option value="caissier">Caissier</option>
              <option value="pharmacien">Pharmacien</option>
            </select>
          </div>
          <div className="form-group"><label>{editingUser ? 'Mot de passe (laisser vide pour conserver)' : 'Mot de passe'}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal isOpen={!!permModal} onClose={() => setPermModal(null)} title={`Permissions - ${permModal?.nom}`}
        footer={<button className="btn btn-outline" onClick={() => setPermModal(null)}>Fermer</button>}>
        {permModal && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Role: </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: roleColors[permModal.role].color }}>{roleLabels[permModal.role]}</span>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Modules autorises:</h4>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {rolePermissions[permModal.role].map((permission) => (
                <li key={permission} style={{ fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> {permission}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  )
}
