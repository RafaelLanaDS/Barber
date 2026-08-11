import { useState, useEffect } from 'react'
import BarberNav from '../../components/Barber/BarberNav'
import { listenProfits } from '../../firebase/config'
import { todayStr } from '../../utils/date'

export default function BarberProfits() {
  const [profits, setProfits] = useState([])

  useEffect(() => {
    const unsub = listenProfits(setProfits)
    return unsub
  }, [])

  const now = new Date()
  const todayS = todayStr()

  const filter = (period) => profits.filter(p => {
    if (!p.date) return false
    const d = new Date(p.date + 'T12:00:00')
    if (period === 'day')   return p.date === todayS
    if (period === 'week')  { const w = new Date(now); w.setDate(now.getDate()-7); return d >= w }
    if (period === 'month') return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear()
    return false
  })

  const sum = (arr) => arr.reduce((s,p)=>s+(p.price||0), 0)
  const fmt = (v) => `R$ ${v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}`

  const dayTotal   = sum(filter('day'))
  const weekTotal  = sum(filter('week'))
  const monthTotal = sum(filter('month'))

  // top serviços do mês
  const counts = {}
  filter('month').forEach(p => { counts[p.service] = (counts[p.service]||0)+1 })
  const total = Object.values(counts).reduce((a,b)=>a+b,0)||1
  const topServices = Object.entries(counts)
    .sort((a,b)=>b[1]-a[1]).slice(0,4)
    .map(([name,count])=>({ name, pct: Math.round(count/total*100) }))

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight:600 }}>✂ Valtinho Barber</span>
        <span style={{ color:'var(--red)', fontSize:12 }}>Faturamento</span>
      </div>
      <div className="page-header">
        <div className="eyebrow">Relatório financeiro</div>
        <h1>Seus <span>Lucros</span></h1>
      </div>
      <div className="red-divider"/>

      <div className="page-content">
        <div className="card red-border" style={{ marginTop:8 }}>
          <div style={{ fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 }}>
            Lucro do mês
          </div>
          <div style={{ fontSize:32, fontWeight:800, color:'var(--red)' }}>{fmt(monthTotal)}</div>
          <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>
            {filter('month').length} atendimentos no mês
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Hoje</div>
            <div className="metric-value">{fmt(dayTotal)}</div>
            <div className="metric-sub">{filter('day').length} atend.</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Semana</div>
            <div className="metric-value">{fmt(weekTotal)}</div>
            <div className="metric-sub">últimos 7 dias</div>
          </div>
        </div>

        {topServices.length > 0 && (
          <>
            <div className="section-label">Serviços mais agendados</div>
            {topServices.map(s => (
              <div className="progress-row" key={s.name}>
                <div className="progress-header">
                  <span className="progress-name">{s.name}</span>
                  <span className="progress-pct">{s.pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width:`${s.pct}%` }}/>
                </div>
              </div>
            ))}
          </>
        )}

        {[...profits].reverse().length > 0 && (
          <>
            <div className="section-label" style={{ marginTop:8 }}>Últimos registros</div>
            {[...profits].reverse().slice(0,10).map(p => (
              <div className="appt-card" key={p.id}>
                <div className="appt-info">
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--white)' }}>{p.service}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>{p.clientName} · {p.date}</div>
                </div>
                <span style={{ color:'var(--red)', fontWeight:700 }}>R$ {p.price}</span>
              </div>
            ))}
          </>
        )}

        {profits.length === 0 && (
          <div className="empty-state">
            <div className="icon">📊</div>
            <div>Nenhum dado ainda</div>
            <div style={{ fontSize:11 }}>Os lucros aparecem conforme clientes agendam</div>
          </div>
        )}
      </div>

      <BarberNav/>
    </div>
  )
}
