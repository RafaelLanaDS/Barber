import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientNav from '../../components/Client/ClientNav'
import {
  listenAppointmentsByDate, listenFixedSlots,
  getFixedExceptions, WORKING_HOURS,
} from '../../firebase/config'
import { getWeekDays, todayStr, formatDate } from '../../utils/date'

export default function ClientSchedule() {
  const navigate = useNavigate()
  const [service, setService]         = useState(null)
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [selectedTime, setSelectedTime] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [fixedSlots, setFixedSlots]   = useState([])
  const [exceptions, setExceptions]   = useState([])
  const weekDays = getWeekDays()

  useEffect(()=>{
    const svc = sessionStorage.getItem('selected_service')
    if (!svc) { navigate('/client/services'); return }
    setService(JSON.parse(svc))
  },[])

  useEffect(()=>{
    const unsub = listenAppointmentsByDate(selectedDate, setAppointments)
    return unsub
  },[selectedDate])

  useEffect(()=>{
    const unsub = listenFixedSlots(setFixedSlots)
    return unsub
  },[])

  useEffect(()=>{
    getFixedExceptions(selectedDate).then(setExceptions)
    setSelectedTime(null)
  },[selectedDate])

  const dayOfWeek = new Date(selectedDate+'T12:00:00').getDay()

  const isSlotBusy = (time) => {
    if (appointments.some(a=>a.time===time)) return true
    const fixed = fixedSlots.find(f=>f.dayOfWeek===dayOfWeek && f.time===time)
    if (!fixed) return false
    return !exceptions.some(e=>e.fixedSlotId===fixed.id)
  }

  const isFixed = (time) => {
    const fixed = fixedSlots.find(f=>f.dayOfWeek===dayOfWeek && f.time===time)
    if (!fixed) return false
    return !exceptions.some(e=>e.fixedSlotId===fixed.id)
  }

  const handleConfirm = () => {
    if (!selectedTime || !service) return
    const booking = {
      service:    service.name,
      price:      service.price,
      date:       selectedDate,
      time:       selectedTime,
    }
    sessionStorage.setItem('booking', JSON.stringify(booking))
    navigate('/client/confirm')
  }

  if (!service) return null

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight:600 }}>✂ Valtinho Barber</span>
        <span style={{ color:'var(--red)', fontSize:12 }}>{formatDate(selectedDate)}</span>
      </div>
      <div className="page-header">
        <div className="eyebrow">Agendamento</div>
        <h1>Escolha o <span>horário</span></h1>
      </div>
      <div className="red-divider"/>

      <div className="page-content">
        {/* Serviço selecionado */}
        <div className="card red-border" style={{ marginTop:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--white)' }}>{service.name}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{service.description}</div>
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--red)' }}>R$ {service.price}</div>
          </div>
          <button onClick={()=>navigate('/client/services')} style={{
            background:'none', border:'none', color:'var(--muted)',
            fontSize:11, cursor:'pointer', marginTop:6, padding:0
          }}>← Trocar serviço</button>
        </div>

        <div className="section-label">Escolha o dia</div>
        <div className="week-scroll">
          {weekDays.map(d=>(
            <div key={d.dateStr} className={`day-chip ${selectedDate===d.dateStr?'active':''}`}
              onClick={()=>setSelectedDate(d.dateStr)}>
              <span className="dn">{d.dayName}</span>
              <span className="dd">{d.dayNum}</span>
              <span className="dot"/>
            </div>
          ))}
        </div>

        <div className="section-label">Horários disponíveis</div>
        <div className="slots-grid">
          {WORKING_HOURS.map(time=>{
            const busy  = isSlotBusy(time)
            const fixed = isFixed(time)
            return (
              <div key={time}
                className={`time-pill ${busy?(fixed?'fixed-taken':'taken'):''} ${selectedTime===time&&!busy?'selected':''}`}
                onClick={()=>!busy&&setSelectedTime(time)}
                title={fixed?'Horário reservado (cliente fixo)':busy?'Ocupado':'Disponível'}
              >
                {time} {busy?(fixed?'📌':'✗'):''}
              </div>
            )
          })}
        </div>

        <button className="btn btn-red" onClick={handleConfirm} disabled={!selectedTime}>
          ✓ Confirmar Agendamento
        </button>
      </div>

      <ClientNav/>
    </div>
  )
}
