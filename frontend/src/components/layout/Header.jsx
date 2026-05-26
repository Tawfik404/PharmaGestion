import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowRightOnRectangle, HiBars3 } from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ toggleSidebar }) {
  const [search, setSearch] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={toggleSidebar}>
          <HiBars3 size={24} />
        </button>
        <div className="header-search">
          <HiOutlineMagnifyingGlass />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="header-actions">
 
        <button className="header-icon-btn" onClick={handleLogout} title="Déconnexion">
          <HiOutlineArrowRightOnRectangle />
        </button>
      </div>
    </header>
  )
}
