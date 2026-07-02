import { useState, useEffect } from 'react'
import BarberNav from '../../components/Barber/BarberNav'
import { getProfitByPeriod, getProfits, SERVICES } from '../../data/db'
import { todayStr } from '../../utils/date'

export default function BarberProfits() {
  const [profits, setProfits] = useState({ day: 0, week: 0, month: 0 })
  const [topServices, setTopServices] = useState([])
  const [allProfits, setAllProfits] = useState([])

  useEffect(() => {
    const day = getProfitByPeriod('day')
    const week = getProfitByPeriod('week')
    const month = getProfitByPeriod('month')
    setProfits({ day, week, month })

    const all = getProfits()
    setAllProfits(all)

    // contagem por serviço
    const counts = {}
    all.forEach(p => {
      counts[p.service] = (counts[p.service] || 0) + 1
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }))
    setTopServices(sorted)
  }, [])

  const fmt = (v) => `R$ ${v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Navalha</span>
        <span style={{ color: 'var(--gold)', fontSize: 12 }}>Faturamento</span>
      </div>

      <div className="page-header">
        <div className="eyebrow">Relatório financeiro</div>
        <h1>Seus <span>Lucros</span></h1>
      </div>
      <div className="gold-divider" />

      <div className="page-content">
        {/* Card principal - mês */}
        <div className="card gold-border" style={{ marginTop: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
            Lucro do mês
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold)' }}>
            {fmt(profits.month)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            {allProfits.length} atendimentos registrados
          </div>
        </div>

        {/* Grid dia / semana */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Hoje</div>
            <div className="metric-value">{fmt(profits.day)}</div>
            <div className="metric-sub">
              {allProfits.filter(p => p.date === todayStr()).length} atend.
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Semana</div>
            <div className="metric-value">{fmt(profits.week)}</div>
            <div className="metric-sub">últimos 7 dias</div>
          </div>
        </div>

        {/* Top serviços */}
        <div className="section-label">Serviços mais agendados</div>

        {topServices.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📊</div>
            <div>Nenhum dado ainda</div>
            <div style={{ fontSize: 11 }}>Os lucros aparecem conforme agendamentos são feitos</div>
          </div>
        ) : (
          topServices.map(s => (
            <div className="progress-row" key={s.name}>
              <div className="progress-header">
                <span className="progress-name">{s.name}</span>
                <span className="progress-pct">{s.pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))
        )}

        {/* Últimos lançamentos */}
        {allProfits.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: 8 }}>Últimos registros</div>
            {[...allProfits].reverse().slice(0, 8).map(p => (
              <div className="slot-row" key={p.id}>
                <div>
                  <div className="slot-time" style={{ fontSize: 13 }}>{p.service}</div>
                  <div className="slot-client">{p.date}</div>
                </div>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>R$ {p.value}</span>
              </div>
            ))}
          </>
        )}
      </div>

      <BarberNav />
    </div>
  )
}
