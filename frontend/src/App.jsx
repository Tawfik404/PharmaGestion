import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Medicaments from './pages/Medicaments'
import Stock from './pages/Stock'
import Ordonnances from './pages/Ordonnances'
import POS from './pages/POS'
import Clients from './pages/Clients'
import Fournisseurs from './pages/Fournisseurs'
import Rapports from './pages/Rapports'
import Utilisateurs from './pages/Utilisateurs'

function PrivateLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">{children}</div>
      </div>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <PrivateLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medicaments" element={<Medicaments />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/ordonnances" element={<Ordonnances />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/fournisseurs" element={<Fournisseurs />} />
        <Route path="/rapports" element={<Rapports />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PrivateLayout>
  )
}

export default App
