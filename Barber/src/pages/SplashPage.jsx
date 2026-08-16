import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginBarber, loginClient } from '../firebase/config'
import { useAuth } from '../hooks/useAuth.jsx'

export default function SplashPage() {
  const [role, setRole]       = useState('client')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, barber } = useAuth()

  // se já logado, redireciona
  if (user && barber)  { navigate('/barber/agenda');   return null }
  if (user && !barber) { navigate('/client/services'); return null }

  const handleBarberLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await loginBarber(password)
      navigate('/barber/agenda')
    } catch {
      setError('Senha incorreta.')
    } finally { setLoading(false) }
  }

  const handleClientLogin = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) { setError('Preencha nome e WhatsApp.'); return }
    setError(''); setLoading(true)
    try {
      await loginClient(name.trim(), phone.trim())
      navigate('/client/services')
    } catch (err) {
      setError('Erro ao entrar. Tente novamente.')
    } finally { setLoading(false) }
  }

  return (
    <div className="splash">
      {/* Badge de versão — top right */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: '#C0392B', color: '#fff',
        fontSize: 10, fontWeight: 700, letterSpacing: 1,
        padding: '3px 8px', borderRadius: 20,
      }}>
        v1.0.0
      </div>

      {/* Logo SVG inline representando Stúdio Valtinho Barber */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <img  
          src="/Barber/logo (2).png"
          alt="Stúdio Valtinho Barber"
          style={{ width: 380, maxWidth: '100%' }}
        />
      </div>
      

      {/* Toggle */}
      <div className="role-toggle">
        <button className={`role-btn ${role==='client'?'active ':''}`} onClick={()=>{setRole('client');setError('')}}>
          Sou Cliente
        </button>
        <button className={`role-btn ${role==='barber'?'active':''}`} onClick={()=>{setRole('barber');setError('')}}>
          Sou Barbeiro
        </button>
      </div>

      {/* Cliente */}
      {role === 'client' && (
        <form onSubmit={handleClientLogin} style={{ width: '100%' }}>
          <div className="input-group">
            <label className="input-label" style={{ color: '#555' }}>Seu nome</label>
            <input className="input-field" placeholder="Ex: Carlos Silva"
              value={name} onChange={e=>{setName(e.target.value);setError('')}} />
          </div>
          <div className="input-group">
            <label className="input-label" style={{ color: '#555' }}>WhatsApp</label>
            <input className="input-field" placeholder="(14) 99999-9999" type="tel"
              value={phone} onChange={e=>{setPhone(e.target.value);setError('')}} />
          </div>
          {error && <div style={{ color:'#C0392B', fontSize:12, marginBottom:10, textAlign:'center' }}>{error}</div>}
          <button type="submit" className="btn btn-red" style={{ margin:'4px 0 0', width:'100%' }} disabled={loading}>
            {loading ? 'Entrando...' : '✂ Entrar & Agendar'}
          </button>
          <div style={{ fontSize:11, color:'#AAA', textAlign:'center', marginTop:10 }}>
            Sem necessidade de senha — seu WhatsApp é sua conta
          </div>
        </form>
      )}

      {/* Barbeiro */}
      {role === 'barber' && (
        <form onSubmit={handleBarberLogin} style={{ width: '100%' }}>
          <div className="input-group">
            <label className="input-label" style={{ color: '#555' }}>Senha</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={password} onChange={e=>{setPassword(e.target.value);setError('')}}
              autoComplete="current-password" />
          </div>
          {error && <div style={{ color:'#C0392B', fontSize:12, marginBottom:10, textAlign:'center' }}>{error}</div>}
          <button type="submit" className="btn btn-red" style={{ margin:'4px 0 0', width:'100%' }} disabled={loading}>
            {loading ? 'Entrando...' : '🔐 Entrar como Barbeiro'}
          </button>
        </form>
      )}

      <div style={{ fontSize:10, color:'#BBB', marginTop:24 }}>v1.0 · Stúdio Valtinho Barber</div>
    </div>
  )
}
