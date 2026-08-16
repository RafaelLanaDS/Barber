import { useState, useEffect } from 'react'
import BarberNav from '../../components/Barber/BarberNav'
import {
  listenAppointmentsByDate, cancelAppointment, createAppointment, addProfit,
  listenFixedSlots, getFixedExceptions,
  createFixedException, deleteFixedException,
  listenBlockedDays, blockDay, unblockDay,
  WORKING_HOURS, SERVICES,
} from '../../firebase/config'
import { getWeekDays, todayStr, formatDate } from '../../utils/date'

const EMPTY_FORM = { clientName: '', clientPhone: '', service: SERVICES[0].name, price: SERVICES[0].price, time: WORKING_HOURS[0] }

export default function BarberAgenda() {
  const [selectedDate, setSelectedDate]   = useState(todayStr())
  const [appointments, setAppointments]   = useState([])
  const [fixedSlots, setFixedSlots]       = useState([])
  const [exceptions, setExceptions]       = useState([])
  const [blockedDays, setBlockedDays]     = useState([])
  const [toast, setToast]                 = useState('')
  const [showForm, setShowForm]           = useState(false)
  const [formTime, setFormTime]           = useState(null)
  const [form, setForm]                   = useState(EMPTY_FORM)
  const [saving, setSaving]               = useState(false)
  const weekDays = getWeekDays()

  useEffect(() => {
    const unsub = listenAppointmentsByDate(selectedDate, setAppointments)
    return unsub
  }, [selectedDate])

  useEffect(() => {
    const unsub = listenFixedSlots(setFixedSlots)
    return unsub
  }, [])

  useEffect(() => {
    getFixedExceptions(selectedDate).then(setExceptions)
  }, [selectedDate])

  useEffect(() => {
    const unsub = listenBlockedDays(setBlockedDays)
    return unsub
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600) }

  const selectedDayOfWeek = new Date(selectedDate + 'T12:00:00').getDay()
  const isDayBlocked = blockedDays.includes(selectedDate)

  const getFixedForTime = (time) => {
    const slot = fixedSlots.find(f => f.dayOfWeek === selectedDayOfWeek && f.time === time)
    if (!slot) return null
    const hasException = exceptions.some(e => e.fixedSlotId === slot.id)
    return hasException ? null : slot
  }

  const getAppointmentForTime = (time) => appointments.find(a => a.time === time)

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
      await deleteFixedException(fixed.id, selectedDate)
      setExceptions(prev => prev.filter(e => e.fixedSlotId !== fixed.id))
      showToast(`Horário fixo reativado para ${fixed.clientName}`)
    } else {
      await createFixedException({ fixedSlotId: fixed.id, date: selectedDate })
      const updated = await getFixedExceptions(selectedDate)
      setExceptions(updated)
      showToast('Horário liberado para outros clientes')
    }
  }

  const handleToggleBlockDay = async () => {
    if (isDayBlocked) {
      await unblockDay(selectedDate)
      showToast(`${formatDate(selectedDate)} desbloqueado!`)
    } else {
      if (!window.confirm(`Bloquear ${formatDate(selectedDate)}? Os clientes não poderão agendar neste dia.`)) return
      await blockDay(selectedDate)
      showToast(`${formatDate(selectedDate)} bloqueado!`)
    }
  }

  const openManualForm = (time) => {
    setFormTime(time)
    setForm({ ...EMPTY_FORM, time })
    setShowForm(true)
  }

  const handleSaveManual = async (e) => {
    e.preventDefault()
    if (!form.clientName.trim()) return
    setSaving(true)
    try {
      await createAppointment({
        clientName:  form.clientName.trim(),
        clientPhone: form.clientPhone.trim(),
        service:     form.service,
        price:       Number(form.price),
        date:        selectedDate,
        time:        form.time,
        manual:      true,
        clientUid:   'manual',
      })
      await addProfit({
        clientName:  form.clientName.trim(),
        clientPhone: form.clientPhone.trim(),
        service:     form.service,
        price:       Number(form.price),
        date:        selectedDate,
        time:        form.time,
        clientUid:   'manual',
      })
      setShowForm(false)
      setForm(EMPTY_FORM)
      showToast(`Agendamento de ${form.clientName.trim()} adicionado!`)
    } catch (err) {
      alert('Erro ao salvar. Tente novamente.')
    } finally { setSaving(false) }
  }

  // quando troca serviço no form, atualiza preço automaticamente
  const handleServiceChange = (serviceName) => {
    const svc = SERVICES.find(s => s.name === serviceName)
    setForm(p => ({ ...p, service: serviceName, price: svc ? svc.price : p.price }))
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
          {weekDays.map(d => {
            const blocked = blockedDays.includes(d.dateStr)
            return (
              <div key={d.dateStr}
                className={`day-chip ${selectedDate === d.dateStr ? 'active' : ''} ${blocked ? 'blocked' : ''}`}
                style={blocked && selectedDate !== d.dateStr ? { opacity: 0.4, borderColor: '#555' } : {}}
                onClick={() => setSelectedDate(d.dateStr)}>
                <span className="dn">{d.dayName}</span>
                <span className="dd">{d.dayNum}</span>
                <span className="dot" style={blocked ? { background: '#555' } : {}} />
              </div>
            )
          })}
        </div>

        {/* Barra de ações do dia */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 8px' }}>
          <div style={{ fontSize: 12, color: isDayBlocked ? '#E74C3C' : 'var(--muted)' }}>
            {isDayBlocked ? '🔴 Dia bloqueado — sem atendimento' : `Horários — ${formatDate(selectedDate)}`}
          </div>
          <button onClick={handleToggleBlockDay} style={{
            background: isDayBlocked ? '#0F2A1A' : '#2A1010',
            border: `1px solid ${isDayBlocked ? 'var(--success)' : '#E74C3C'}`,
            color: isDayBlocked ? 'var(--success)' : '#E74C3C',
            borderRadius: 8, padding: '4px 10px', fontSize: 11, cursor: 'pointer',
          }}>
            {isDayBlocked ? '🔓 Desbloquear' : '🔒 Bloquear dia'}
          </button>
        </div>

        {/* Legenda */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', flexWrap: 'wrap' }}>
          <span className="badge badge-busy">● Agendado</span>
          <span className="badge badge-fixed">● Fixo</span>
          <span className="badge badge-free">● Livre</span>
        </div>

        {/* Dia bloqueado — aviso */}
        {isDayBlocked && (
          <div style={{
            background: '#2A1010', border: '1px solid #E74C3C', borderRadius: 12,
            padding: '14px 16px', margin: '0 16px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🔒</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#E74C3C' }}>Dia bloqueado</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              Clientes não conseguem agendar neste dia.<br />
              Clique em "Desbloquear" para liberar.
            </div>
          </div>
        )}

        {/* Horários */}
        {WORKING_HOURS.map(time => {
          const appt  = getAppointmentForTime(time)
          const fixed = getFixedForTime(time)

          if (appt) return (
            <div key={time} className="appt-card is-busy">
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                <div className="appt-name">👤 {appt.clientName}</div>
                <div className="appt-service">💈 {appt.service} · R$ {appt.price}</div>
                {appt.manual && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>📝 Adicionado manualmente</div>}
              </div>
              <div className="appt-actions">
                <span className="badge badge-confirmed">Agendado</span>
                <button style={{
                  background: 'none', border: 'none', color: '#E74C3C',
                  fontSize: 11, cursor: 'pointer', marginTop: 4,
                }} onClick={() => handleCancelAppointment(appt)}>
                  ✕ cancelar
                </button>
              </div>
            </div>
          )

          if (fixed) return (
            <div key={time} className="appt-card is-fixed">
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                <div className="appt-name" style={{ color: '#9B59B6' }}>📌 {fixed.clientName} (Fixo)</div>
                <div className="appt-service">{fixed.clientPhone}</div>
              </div>
              <div className="appt-actions">
                <span className="badge badge-fixed">Fixo</span>
                <button style={{
                  background: 'none', border: 'none', color: 'var(--muted)',
                  fontSize: 11, cursor: 'pointer', marginTop: 4,
                }} onClick={() => handleToggleFixed(time)}>
                  liberar semana
                </button>
              </div>
            </div>
          )

          return (
            <div key={time} className="appt-card" style={{ cursor: isDayBlocked ? 'default' : 'pointer' }}
              onClick={() => !isDayBlocked && openManualForm(time)}>
              <div className="appt-info">
                <div className="appt-time">{time}</div>
                <div className="appt-service" style={{ color: 'var(--muted)' }}>
                  {isDayBlocked ? 'Dia bloqueado' : 'Toque para adicionar'}
                </div>
              </div>
              {!isDayBlocked
                ? <span style={{ color: 'var(--red)', fontSize: 18 }}>+</span>
                : <span className="badge" style={{ background: '#2A2A2A', color: '#555' }}>Bloqueado</span>
              }
            </div>
          )
        })}
      </div>

      {/* Modal — agendamento manual */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">➕ Adicionar Agendamento</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
              {formatDate(selectedDate)} às {formTime}
            </div>
            <form onSubmit={handleSaveManual}>
              <div className="input-group">
                <label className="input-label">Nome do cliente *</label>
                <input className="input-field" placeholder="Ex: João da Silva"
                  value={form.clientName}
                  onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">WhatsApp</label>
                <input className="input-field" placeholder="(14) 99999-9999" type="tel"
                  value={form.clientPhone}
                  onChange={e => setForm(p => ({ ...p, clientPhone: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Horário</label>
                <select className="input-field" value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                  {WORKING_HOURS.map(h => (
                    <option key={h} value={h} disabled={!!getAppointmentForTime(h)}>
                      {h} {getAppointmentForTime(h) ? '(ocupado)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Serviço</label>
                <select className="input-field" value={form.service}
                  onChange={e => handleServiceChange(e.target.value)}>
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Valor (R$)</label>
                <input className="input-field" type="number" placeholder="Ex: 40"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-red" style={{ margin: '8px 0 0', width: '100%' }} disabled={saving}>
                {saving ? 'Salvando...' : '✓ Salvar Agendamento'}
              </button>
              <button type="button" className="btn btn-outline" style={{ margin: '6px 0 0', width: '100%' }}
                onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
      <BarberNav />
    </div>
  )
}
