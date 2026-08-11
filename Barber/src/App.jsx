import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import SplashPage      from './pages/SplashPage'
import BarberAgenda    from './pages/barber/BarberAgenda'
import BarberProfits   from './pages/barber/BarberProfits'
import BarberFixed     from './pages/barber/BarberFixed'
import ClientServices  from './pages/client/ClientServices'
import ClientSchedule  from './pages/client/ClientSchedule'
import ClientConfirm   from './pages/client/ClientConfirm'
import ClientSuccess   from './pages/client/ClientSuccess'
import ClientHistory   from './pages/client/ClientHistory'

const BarberGuard = ({ children }) => {
  const { user, barber, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner"/></div>
  if (!user || !barber) return <Navigate to="/" replace />
  return children
}

const ClientGuard = ({ children }) => {
  const { user, barber, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner"/></div>
  if (!user || barber) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<SplashPage />} />

        <Route path="/barber/agenda"  element={<BarberGuard><BarberAgenda /></BarberGuard>} />
        <Route path="/barber/profits" element={<BarberGuard><BarberProfits /></BarberGuard>} />
        <Route path="/barber/fixed"   element={<BarberGuard><BarberFixed /></BarberGuard>} />

        <Route path="/client/services" element={<ClientGuard><ClientServices /></ClientGuard>} />
        <Route path="/client/schedule" element={<ClientGuard><ClientSchedule /></ClientGuard>} />
        <Route path="/client/confirm"  element={<ClientGuard><ClientConfirm /></ClientGuard>} />
        <Route path="/client/success"  element={<ClientGuard><ClientSuccess /></ClientGuard>} />
        <Route path="/client/history"  element={<ClientGuard><ClientHistory /></ClientGuard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
