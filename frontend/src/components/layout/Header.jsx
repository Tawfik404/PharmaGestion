import { useState } from 'react'
import { HiOutlineBell, HiOutlineMagnifyingGlass, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [search, setSearch] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-search">
        <HiOutlineMagnifyingGlass />
        <input
          type="text"
          placeholder="Rechercher médicaments, clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="header-actions">
        <button className="header-icon-btn">
          <HiOutlineBell />
          <span className="header-badge"></span>
        </button>
        <button className="header-icon-btn" onClick={handleLogout} title="Déconnexion">
          <HiOutlineArrowRightOnRectangle />
        </button>
      </div>
    </header>
  )
}
