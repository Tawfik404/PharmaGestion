import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    try {
      setSubmitting(true)
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">⚕</div>
          <h1>Gestion Pharmacie WFS</h1>
          <p>Connectez-vous à votre compte</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px 16px' }} disabled={submitting}>
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
            <p><strong>Comptes de test:</strong></p>
            <p>Utilisateur initialise: tawfik@gmail.com</p>
            <p style={{ marginTop: 4 }}>Mot de passe: tawfik</p>
          </div>
        </form>
      </div>
    </div>
  )
}
