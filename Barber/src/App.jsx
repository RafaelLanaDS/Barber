import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BarberAgenda from './pages/barber/BarberAgenda'
import BarberProfits from './pages/barber/BarberProfits'
import ClientServices from './pages/client/ClientServices'
import ClientSchedule from './pages/client/ClientSchedule'
import ClientConfirm from './pages/client/ClientConfirm'
import ClientSuccess from './pages/client/ClientSuccess'
import { isAuthenticated } from './data/db'

const BarberGuard = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Rotas do barbeiro */}
        <Route path="/barber/agenda" element={<BarberGuard><BarberAgenda /></BarberGuard>} />
        <Route path="/barber/profits" element={<BarberGuard><BarberProfits /></BarberGuard>} />

        {/* Rotas do cliente */}
        <Route path="/client/services" element={<ClientServices />} />
        <Route path="/client/schedule" element={<ClientSchedule />} />
        <Route path="/client/confirm" element={<ClientConfirm />} />
        <Route path="/client/success" element={<ClientSuccess />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
