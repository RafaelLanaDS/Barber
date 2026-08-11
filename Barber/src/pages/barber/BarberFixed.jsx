import { useState, useEffect } from 'react'
import BarberNav from '../../components/Barber/BarberNav'
import { listenFixedSlots, createFixedSlot, deleteFixedSlot, WORKING_HOURS } from '../../firebase/config'
import { DAYS_PT } from '../../utils/date'

const DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

export default function BarberFixed() {
  const [slots, setSlots]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ clientName:'', clientPhone:'', dayOfWeek:1, time:'09:00' })
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState('')

  useEffect(() => {
    const unsub = listenFixedSlots(setSlots)
    return unsub
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 2600) }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.clientName.trim()) return
    setLoading(true)
    await createFixedSlot({
      clientName:  form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      dayOfWeek:   Number(form.dayOfWeek),
      time:        form.time,
    })
    setForm({ clientName:'', clientPhone:'', dayOfWeek:1, time:'09:00' })
    setShowForm(false)
    setLoading(false)
    showToast('Horário fixo adicionado!')
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remover horário fixo de ${name}?`)) return
    await deleteFixedSlot(id)
    showToast('Horário fixo removido')
  }

  const grouped = DAYS.map((d, i) => ({
    day: d,
    idx: i,
    slots: slots.filter(s => s.dayOfWeek === i).sort((a,b)=>a.time.localeCompare(b.time)),
  })).filter(g => g.slots.length > 0)

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight:600 }}>✂ Valtinho Barber</span>
        <span style={{ color:'var(--red)', fontSize:12 }}>Horários Fixos</span>
      </div>

      <div className="page-header">
        <div className="eyebrow">Clientes fiéis</div>
        <h1>Horários <span>Fixos</span></h1>
      </div>
      <div className="red-divider"/>

      <div className="page-content">
        <div className="card" style={{ marginTop:8, background:'var(--red-dim)', borderColor:'var(--red)' }}>
          <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.7 }}>
            📌 Horários fixos são bloqueados automaticamente toda semana para o cliente fiel.
            Você pode liberar pontualmente na tela de <strong style={{ color:'var(--white)' }}>Agenda</strong> quando necessário.
          </div>
        </div>

        <button className="btn btn-red" onClick={()=>setShowForm(true)} style={{ marginTop:4 }}>
          + Adicionar Horário Fixo
        </button>

        {grouped.length === 0 && (
          <div className="empty-state">
            <div className="icon">📌</div>
            <div>Nenhum horário fixo cadastrado</div>
            <div style={{ fontSize:11 }}>Adicione clientes que vêm toda semana</div>
          </div>
        )}

        {grouped.map(g => (
          <div key={g.idx}>
            <div className="section-label">{g.day}</div>
            {g.slots.map(slot => (
              <div key={slot.id} className="appt-card is-fixed">
                <div className="appt-info">
                  <div className="appt-time">{slot.time}</div>
                  <div className="appt-name" style={{ color:'#9B59B6' }}>📌 {slot.clientName}</div>
                  {slot.clientPhone && <div className="appt-service">{slot.clientPhone}</div>}
                </div>
                <button style={{
                  background:'none', border:'1px solid #3A1010',
                  color:'#E74C3C', borderRadius:8, padding:'4px 10px',
                  fontSize:11, cursor:'pointer'
                }} onClick={()=>handleDelete(slot.id, slot.clientName)}>
                  remover
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Novo Horário Fixo</div>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label">Nome do cliente *</label>
                <input className="input-field" placeholder="Ex: João da Silva"
                  value={form.clientName}
                  onChange={e=>setForm(p=>({...p, clientName:e.target.value}))} />
              </div>
              <div className="input-group">
                <label className="input-label">WhatsApp</label>
                <input className="input-field" placeholder="(14) 99999-9999" type="tel"
                  value={form.clientPhone}
                  onChange={e=>setForm(p=>({...p, clientPhone:e.target.value}))} />
              </div>
              <div className="input-group">
                <label className="input-label">Dia da semana</label>
                <select className="input-field"
                  value={form.dayOfWeek}
                  onChange={e=>setForm(p=>({...p, dayOfWeek:e.target.value}))}>
                  {DAYS.map((d,i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Horário</label>
                <select className="input-field"
                  value={form.time}
                  onChange={e=>setForm(p=>({...p, time:e.target.value}))}>
                  {WORKING_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-red" style={{ margin:'8px 0 0', width:'100%' }} disabled={loading}>
                {loading ? 'Salvando...' : '📌 Salvar Horário Fixo'}
              </button>
              <button type="button" className="btn btn-outline" style={{ margin:'6px 0 0', width:'100%' }}
                onClick={()=>setShowForm(false)}>
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
