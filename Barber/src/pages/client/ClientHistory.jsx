import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientNav from '../../components/Client/ClientNav'
import { getClientAppointments, cancelAppointment } from '../../firebase/config'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, todayStr } from '../../utils/date'

export default function ClientHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')

  const load = async () => {
    if (!user) return
    setLoading(true)
    const list = await getClientAppointments(user.uid)
    setAppointments(list)
    setLoading(false)
  }

  useEffect(()=>{ load() },[user])

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 2600) }

  const handleCancel = async (appt) => {
    if (!window.confirm('Cancelar este agendamento?')) return
    await cancelAppointment(appt.id)
    showToast('Agendamento cancelado')
    load()
  }

  const today = todayStr()
  const upcoming = appointments.filter(a => a.date >= today).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))
  const past     = appointments.filter(a => a.date < today).sort((a,b)=>b.date.localeCompare(a.date))

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight:600 }}>✂ Valtinho Barber</span>
        <span style={{ color:'var(--muted)', fontSize:11 }}>Meus agendamentos</span>
      </div>
      <div className="page-header">
        <div className="eyebrow">Histórico</div>
        <h1>Meus <span>Agendamentos</span></h1>
      </div>
      <div className="red-divider"/>

      <div className="page-content">
        {loading && (
          <div className="empty-state"><div className="spinner"/></div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            <div className="icon">📋</div>
            <div>Nenhum agendamento ainda</div>
            <button className="btn btn-red" style={{ marginTop:12 }} onClick={()=>navigate('/client/services')}>
              ✂ Agendar agora
            </button>
          </div>
        )}

        {upcoming.length > 0 && (
          <>
            <div className="section-label">Próximos</div>
            {upcoming.map(appt=>(
              <div key={appt.id} className="appt-card" style={{ borderColor:'var(--red)' }}>
                <div className="appt-info">
                  <div className="appt-time">{appt.time}</div>
                  <div className="appt-name">{formatDate(appt.date)}</div>
                  <div className="appt-service">💈 {appt.service} · R$ {appt.price}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                  <span className="badge badge-confirmed">Agendado</span>
                  {appt.date >= today && (
                    <button style={{
                      background:'none', border:'none', color:'var(--muted)',
                      fontSize:11, cursor:'pointer'
                    }} onClick={()=>handleCancel(appt)}>
                      ✕ cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {past.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop:8 }}>Histórico</div>
            {past.map(appt=>(
              <div key={appt.id} className="appt-card" style={{ opacity:.6 }}>
                <div className="appt-info">
                  <div className="appt-time">{appt.time}</div>
                  <div className="appt-name">{formatDate(appt.date)}</div>
                  <div className="appt-service">💈 {appt.service} · R$ {appt.price}</div>
                </div>
                <span className="badge badge-free">Concluído</span>
              </div>
            ))}
          </>
        )}
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
      <ClientNav/>
    </div>
  )
}
