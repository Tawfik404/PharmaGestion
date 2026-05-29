import { createContext, useContext, useEffect, useState } from 'react'
import { loginRequest, logoutRequest, meRequest } from '../services/auth'

const AuthContext = createContext(null)

const ROLE_PERMISSIONS = {
  gestionnaire: ['dashboard','medicaments','stock','ordonnances','pos','clients','fournisseurs','rapports','utilisateurs'],
  caissier: ['dashboard','pos','clients'],
  pharmacien: ['dashboard','medicaments','stock','clients','fournisseurs','rapports'],
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await meRequest(storedToken)
        setUser(formatUser(response.utilisateur))
        setToken(storedToken)
      } catch {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const login = async (email, password) => {
    const response = await loginRequest(email, password)
    localStorage.setItem('token', response.token)
    setToken(response.token)
    setUser(formatUser(response.utilisateur))
    return response.utilisateur
  }

  const logout = async () => {
    try {
      if (token) {
        await logoutRequest()
      }
    } catch {
      // Ignorer l echec de deconnexion distante si le token local doit etre nettoye.
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  const hasPermission = (perm) => {
    if (!user) return false
    const role = user.role?.toLowerCase().trim()
    if (role === 'gestionnaire') return true
    return ROLE_PERMISSIONS[role]?.includes(perm)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

function formatUser(utilisateur) {
  if (!utilisateur) return null

  return {
    ...utilisateur,
    name: `${utilisateur.prenom} ${utilisateur.nom}`.trim(),
  }
}
