import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function BarberNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${pathname === '/barber/agenda' ? 'active' : ''}`}
        onClick={() => navigate('/barber/agenda')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Agenda
      </button>
      <button
        className={`nav-item ${pathname === '/barber/profits' ? 'active' : ''}`}
        onClick={() => navigate('/barber/profits')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        Lucros
      </button>
      <button className="nav-item" onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sair
      </button>
    </nav>
  )
}
