import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HiOutlineHome, HiOutlineCube, HiOutlineArchiveBox, HiOutlineDocumentText,
  HiOutlineShoppingCart, HiOutlineUserGroup, HiOutlineTruck, HiOutlineChartBar,
  HiOutlineCog6Tooth, HiArrowLeftOnRectangle
} from 'react-icons/hi2'
import './Sidebar.css'

const navItems = [
  { label: 'ACCUEIL', items: [
    { path: '/', icon: <HiOutlineHome />, label: 'Tableau de bord' },
  ]},
  { label: 'GESTION', items: [
    { path: '/medicaments', icon: <HiOutlineCube />, label: 'Médicaments', perm: 'medicaments' },
    { path: '/stock', icon: <HiOutlineArchiveBox />, label: 'Stock', perm: 'stock' },
    { path: '/ordonnances', icon: <HiOutlineDocumentText />, label: 'Ordonnances', perm: 'ordonnances' },
    { path: '/pos', icon: <HiOutlineShoppingCart />, label: 'Point de Vente', perm: 'pos' },
  ]},
  { label: 'RELATIONS', items: [
    { path: '/clients', icon: <HiOutlineUserGroup />, label: 'Clients', perm: 'clients' },
    { path: '/fournisseurs', icon: <HiOutlineTruck />, label: 'Fournisseurs', perm: 'fournisseurs' },
  ]},
  { label: 'ANALYSE', items: [
    { path: '/rapports', icon: <HiOutlineChartBar />, label: 'Rapports', perm: 'rapports' },
    { path: '/utilisateurs', icon: <HiOutlineCog6Tooth />, label: 'Utilisateurs', perm: 'utilisateurs' },
  ]},
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, hasPermission } = useAuth()

  const roleLabels = { pharmacien: 'Pharmacien', caissier: 'Caissier', gestionnaire: 'Gestionnaire' }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚕</div>
        <div>
          <h2>Pharmacie WFS</h2>
          <span>Système de Gestion</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((section, i) => {
          const items = section.items.filter(item => !item.perm || hasPermission(item.perm))
          if (items.length === 0) return null
          return (
            <div className="sidebar-section" key={i}>
              <div className="sidebar-section-title">{section.label}</div>
              {items.map(item => (
                <Link key={item.path} to={item.path}>
                  <button className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}>
                    {item.icon}{item.label}
                  </button>
                </Link>
              ))}
            </div>
          )
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{roleLabels[user?.role]}</div>
          </div>
          <button className="btn-icon" style={{ color: 'var(--text-sidebar)' }} onClick={async () => { await logout(); navigate('/login') }}>
            <HiArrowLeftOnRectangle size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
