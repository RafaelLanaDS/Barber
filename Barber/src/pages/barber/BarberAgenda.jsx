import { useState, useEffect } from 'react'
import BarberNav from '../../components/Barber/BarberNav'
import {
  listenAppointmentsByDate, cancelAppointment,
  listenFixedSlots, getFixedExceptions,
  createFixedException, deleteFixedException,
  WORKING_HOURS,
} from '../../firebase/config'
import { getWeekDays, todayStr, formatDate } from '../../utils/date'
import { DAYS_PT } from '../../utils/date'

export default function BarberAgenda() {
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [appointments, setAppointments] = useState([])
  const [fixedSlots, setFixedSlots]     = useState([])
  const [exceptions, setExceptions]     = useState([])
  const [toast, setToast]               = useState('')
  const weekDays = getWeekDays()

  // escuta agendamentos em tempo real
  useEffect(() => {
    const unsub = listenAppointmentsByDate(selectedDate, setAppointments)
    return unsub
  }, [selectedDate])

  // escuta horários fixos em tempo real
  useEffect(() => {
    const unsub = listenFixedSlots(setFixedSlots)
    return unsub
  }, [])

  // carrega exceções do dia selecionado
  useEffect(() => {
    getFixedExceptions(selectedDate).then(setExceptions)
  }, [selectedDate])

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 2600) }

  const selectedDayOfWeek = new Date(selectedDate + 'T12:00:00').getDay()

  // fixo ativo neste dia (sem exceção)
  const getFixedForTime = (time) => {
    const slot = fixedSlots.find(f => f.dayOfWeek === selectedDayOfWeek && f.time === time)
    if (!slot) return null
    const hasException = exceptions.some(e => e.fixedSlotId === slot.id)
    return hasException ? null : slot
  }

  const getAppointmentForTime = (time) =>
    appointments.find(a => a.time === time)

  const handleCancelAppointment = async (appt) => {
    if (!window.confirm(`Cancelar agendamento de ${appt.clientName}?`)) return
    await cancelAppointment(appt.id)
    showToast('Agendamento cancelado')
  }

  const handleToggleFixed = async (time) => {
    const fixed = fixedSlots.find(f => f.dayOfWeek === selectedDayOfWeek && f.time === time)
    if (!fixed) return
    const hasException = exceptions.some(e => e.fixedSlotId === fixed.id)

    if (hasException) {
      // reativar fixo nesta semana
      await deleteFixedException(fixed.id, selectedDate)
      setExceptions(prev => prev.filter(e => e.fixedSlotId !== fixed.id))
      showToast(`Horário fixo reativado para ${fixed.clientName}`)
    } else {
      // liberar esta semana
      await createFixedException({ fixedSlotId: fixed.id, date: selectedDate })
      const updated = await getFixedExceptions(selectedDate)
      setExceptions(updated)
      showToast(`Horário liberado para outros clientes`)
    }
  }

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Valtinho Barber</span>
        <span style={{ color: 'var(--red)', fontSize: 12 }}>{formatDate(selectedDate)}</span>
      </div>

      <div className="page-header">
        <div className="eyebrow">Painel do Barbeiro</div>
        <h1>Agenda <span>do dia</span></h1>
      </div>
      <div className="red-divider" />

      <div className="page-content">
        <div className="section-label">Semana</div>
        <div className="week-scroll">
          {weekDays.map(d => (
            <div key={d.dateStr} className={`day-chip ${selectedDate===d.dateStr?'active':''}`}
              onClick={()=>setSelectedDate(d.dateStr)}>
              <span className="dn">{d.dayName}</span>
              <span className="dd">{d.dayNum}</span>
              <span className="dot"/>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 8 }}>
          Horários — {formatDate(selectedDate)}
        </div>

        {/* legenda */}
        <div style={{ display:'flex', gap:8, padding:'0 16px 10px', flexWrap:'wrap' }}>
          <span className="badge badge-busy">● Agendado</span>
          <span className="badge badge-fixed">● Fixo</span>
          <span className="badge badge-free">● Livre</span>
        </div>

        {WORKING_HOURS.map(time => {
          const appt  = getAppointmentForTime(time)
          const fixed = getFixedForTime(time)

          if (appt) return (
            <div key={time} className="appt-card is-busy">
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                <div className="appt-name">👤 {appt.clientName}</div>
                <div className="appt-service">💈 {appt.service} · R$ {appt.price}</div>
              </div>
              <div className="appt-actions">
                <span className="badge badge-confirmed">Agendado</span>
                <button className="btn-danger" style={{
                  background:'none', border:'none', color:'#E74C3C',
                  fontSize:11, cursor:'pointer', marginTop:4
                }} onClick={()=>handleCancelAppointment(appt)}>
                  ✕ cancelar
                </button>
              </div>
            </div>
          )

          if (fixed) return (
            <div key={time} className="appt-card is-fixed">
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                <div className="appt-name" style={{ color:'#9B59B6' }}>📌 {fixed.clientName} (Fixo)</div>
                <div className="appt-service">{fixed.clientPhone}</div>
              </div>
              <div className="appt-actions">
                <span className="badge badge-fixed">Fixo</span>
                <button style={{
                  background:'none', border:'none', color:'var(--muted)',
                  fontSize:11, cursor:'pointer', marginTop:4
                }} onClick={()=>handleToggleFixed(time)}>
                  liberar semana
                </button>
              </div>
            </div>
          )

          return (
            <div key={time} className="appt-card">
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                <div className="appt-service" style={{ color:'var(--muted)' }}>Horário livre</div>
              </div>
              <span className="badge badge-free">Livre</span>
            </div>
          )
        })}
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
      <BarberNav />
    </div>
  )
}
