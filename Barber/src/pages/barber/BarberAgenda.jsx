import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BarberNav from '../../components/Barber/BarberNav'
import { getAppointmentsByDate, deleteAppointment, WORKING_HOURS } from '../../data/db'
import { getWeekDays, todayStr, formatDate } from '../../utils/date'

export default function BarberAgenda() {
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [appointments, setAppointments] = useState([])
  const [toast, setToast] = useState('')
  const weekDays = getWeekDays()

  const load = () => setAppointments(getAppointmentsByDate(selectedDate))

  useEffect(() => { load() }, [selectedDate])

  const handleDelete = (id) => {
    if (window.confirm('Remover este agendamento?')) {
      deleteAppointment(id)
      load()
      showToast('Agendamento removido')
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  const getSlotStatus = (time) => {
    const appt = appointments.find(a => a.time === time)
    if (appt) return { appt, taken: true }
    return { appt: null, taken: false }
  }

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Navalha</span>
        <span style={{ color: 'var(--gold)', fontSize: 12 }}>{formatDate(selectedDate)}</span>
      </div>

      <div className="page-header">
        <div className="eyebrow">Painel do Barbeiro</div>
        <h1>Agenda <span>do dia</span></h1>
      </div>
      <div className="gold-divider" />

      <div className="page-content">
        {/* Semana */}
        <div className="section-label">Semana</div>
        <div className="week-scroll">
          {weekDays.map(d => (
            <div
              key={d.dateStr}
              className={`day-chip ${selectedDate === d.dateStr ? 'active' : ''}`}
              onClick={() => setSelectedDate(d.dateStr)}
            >
              <span className="dn">{d.dayName}</span>
              <span className="dd">{d.dayNum}</span>
              <span className="dot" />
            </div>
          ))}
        </div>

        {/* Horários */}
        <div className="section-label" style={{ marginTop: 8 }}>
          Horários — {formatDate(selectedDate)}
        </div>

        {WORKING_HOURS.map(time => {
          const { appt, taken } = getSlotStatus(time)
          return (
            <div key={time} className={`appt-card ${taken ? 'gold-border' : ''}`}
              style={{ borderColor: taken ? 'var(--gold)' : undefined }}>
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                {taken ? (
                  <>
                    <div className="appt-name">👤 {appt.clientName}</div>
                    <div className="appt-service">💈 {appt.service}</div>
                  </>
                ) : (
                  <div className="appt-service" style={{ color: 'var(--muted)' }}>Horário livre</div>
                )}
              </div>
              {taken ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div className="appt-price">R$ {appt.price}</div>
                  <span className="badge badge-confirmed">Agendado</span>
                  <button
                    onClick={() => handleDelete(appt.id)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--muted)',
                      fontSize: 11, cursor: 'pointer', marginTop: 2
                    }}
                  >
                    ✕ remover
                  </button>
                </div>
              ) : (
                <span className="badge badge-free">Livre</span>
              )}
            </div>
          )
        })}

        {appointments.length === 0 && (
          <div className="empty-state">
            <div className="icon">📅</div>
            <div>Nenhum agendamento para este dia</div>
            <div style={{ fontSize: 11 }}>Os clientes agendam pelo app</div>
          </div>
        )}
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
      <BarberNav />
    </div>
  )
}
