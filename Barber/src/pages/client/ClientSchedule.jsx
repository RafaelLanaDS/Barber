import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientNav from '../../components/Client/ClientNav'
import { WORKING_HOURS, isSlotTaken } from '../../data/db'
import { getWeekDays, todayStr, formatDate } from '../../utils/date'

export default function ClientSchedule() {
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [selectedTime, setSelectedTime] = useState(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const weekDays = getWeekDays()

  useEffect(() => {
    const svc = sessionStorage.getItem('selected_service')
    if (!svc) { navigate('/client/services'); return }
    setService(JSON.parse(svc))
  }, [])

  const handleConfirm = () => {
    if (!selectedTime || !clientName.trim()) return
    const booking = {
      service: service.name,
      price: service.price,
      date: selectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
    }
    sessionStorage.setItem('booking', JSON.stringify(booking))
    navigate('/client/confirm')
  }

  if (!service) return null

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Navalha</span>
        <span style={{ color: 'var(--gold)', fontSize: 12 }}>{formatDate(selectedDate)}</span>
      </div>

      <div className="page-header">
        <div className="eyebrow">Agendamento</div>
        <h1>Escolha o <span>horário</span></h1>
      </div>
      <div className="gold-divider" />

      <div className="page-content">
        {/* Serviço selecionado */}
        <div className="card" style={{ marginTop: 8, borderColor: 'var(--gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{service.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{service.description}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>R$ {service.price}</div>
          </div>
          <button
            onClick={() => navigate('/client/services')}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, cursor: 'pointer', marginTop: 6, padding: 0 }}
          >
            ← Trocar serviço
          </button>
        </div>

        {/* Calendário semana */}
        <div className="section-label">Escolha o dia</div>
        <div className="week-scroll">
          {weekDays.map(d => (
            <div
              key={d.dateStr}
              className={`day-chip ${selectedDate === d.dateStr ? 'active' : ''}`}
              onClick={() => { setSelectedDate(d.dateStr); setSelectedTime(null) }}
            >
              <span className="dn">{d.dayName}</span>
              <span className="dd">{d.dayNum}</span>
              <span className="dot" />
            </div>
          ))}
        </div>

        {/* Horários disponíveis */}
        <div className="section-label">Horários disponíveis</div>
        <div className="slots-grid">
          {WORKING_HOURS.map(time => {
            const taken = isSlotTaken(selectedDate, time)
            return (
              <div
                key={time}
                className={`time-pill ${taken ? 'taken' : ''} ${selectedTime === time && !taken ? 'selected' : ''}`}
                onClick={() => !taken && setSelectedTime(time)}
              >
                {time} {taken ? '✗' : ''}
              </div>
            )
          })}
        </div>

        {/* Dados do cliente */}
        <div className="section-label" style={{ marginTop: 4 }}>Seus dados</div>
        <div style={{ padding: '0 16px' }}>
          <div className="input-group">
            <label className="input-label">Seu nome *</label>
            <input
              className="input-field"
              placeholder="Ex: Carlos Silva"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">WhatsApp (opcional)</label>
            <input
              className="input-field"
              placeholder="(11) 99999-9999"
              type="tel"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-gold"
          onClick={handleConfirm}
          disabled={!selectedTime || !clientName.trim()}
          style={{ opacity: selectedTime && clientName.trim() ? 1 : 0.4 }}
        >
          ✓ Confirmar Agendamento
        </button>
      </div>

      <ClientNav />
    </div>
  )
}
