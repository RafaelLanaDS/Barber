import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [role, setRole] = useState('client')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleBarberLogin = (e) => {
    e.preventDefault()
    const ok = login(username, password)
    if (ok) {
      navigate('/barber/agenda')
    } else {
      setError('Usuário ou senha incorretos.')
    }
  }

  return (
    <div className="page" style={{ justifyContent: 'center' }}>
      <div className="logo-box">
        <div className="logo-icon">✂</div>
        <div className="logo-name">NAVALHA</div>
        <div className="logo-sub">Barbearia</div>
      </div>

      <div className="role-toggle">
        <button
          className={`role-btn ${role === 'client' ? 'active' : ''}`}
          onClick={() => { setRole('client'); setError('') }}
        >
          Sou Cliente
        </button>
        <button
          className={`role-btn ${role === 'barber' ? 'active' : ''}`}
          onClick={() => { setRole('barber'); setError('') }}
        >
          Sou Barbeiro
        </button>
      </div>

      {role === 'client' ? (
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: 'var(--dark3)',
            border: '1px dashed #2A2A2A',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>💈</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
              Sem cadastro necessário
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Agende seu horário direto,<br />sem criar uma conta.
            </div>
          </div>
          <button className="btn btn-gold" onClick={() => navigate('/client/services')}>
            ✂ Ver Serviços & Agendar
          </button>
        </div>
      ) : (
        <form onSubmit={handleBarberLogin} style={{ padding: '0 16px' }}>
          <div className="input-group">
            <label className="input-label">Usuário</label>
            <input
              className="input-field"
              type="text"
              placeholder="seu usuário"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Senha</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--danger)',
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 10,
              padding: '8px 12px',
              background: '#2A1010',
              borderRadius: 'var(--radius-sm)',
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-gold" style={{ margin: '4px 0 0' }}>
            🔐 Entrar como Barbeiro
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', padding: '20px 0 12px', fontSize: 11, color: '#444' }}>
        v1.0 · Navalha Barbearia
      </div>
    </div>
  )
}
