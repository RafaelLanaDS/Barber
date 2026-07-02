import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientNav from '../../components/Client/ClientNav'
import { SERVICES } from '../../data/db'

const FILTERS = ['Todos', 'Corte', 'Barba', 'Completo']

const FILTER_MAP = {
  'Todos': () => true,
  'Corte': s => s.name.toLowerCase().includes('corte') || s.name.includes('Degradê') || s.name.includes('Infantil'),
  'Barba': s => s.name.toLowerCase().includes('barba'),
  'Completo': s => s.name.toLowerCase().includes('completo'),
}

export default function ClientServices() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('Todos')

  const filtered = SERVICES.filter(FILTER_MAP[filter] || (() => true))

  const handleContinue = () => {
    if (!selected) return
    sessionStorage.setItem('selected_service', JSON.stringify(selected))
    navigate('/client/schedule')
  }

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Navalha</span>
        <span style={{ color: 'var(--muted)', fontSize: 11 }}>Sem cadastro necessário</span>
      </div>

      <div className="page-header">
        <div className="eyebrow">Navalha Barbearia</div>
        <h1>Nossos <span>Serviços</span></h1>
      </div>
      <div className="gold-divider" />

      <div className="page-content">
        {/* Filtros */}
        <div className="tag-row">
          {FILTERS.map(f => (
            <span
              key={f}
              className={`tag ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Lista de serviços */}
        {filtered.map(svc => (
          <div
            key={svc.id}
            className={`service-card ${selected?.id === svc.id ? 'selected' : ''}`}
            onClick={() => setSelected(svc)}
          >
            <div className="service-icon">{svc.icon}</div>
            <div className="service-info">
              <div className="service-name">{svc.name}</div>
              <div className="service-desc">{svc.description}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                ⏱ {svc.duration} min
              </div>
            </div>
            <div className="service-price">R$ {svc.price}</div>
          </div>
        ))}

        {/* CTA */}
        <button
          className="btn btn-gold"
          onClick={handleContinue}
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.4 }}
        >
          ✂ Escolher Horário
        </button>

        {selected && (
          <div style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--gold)',
            marginTop: -4,
            paddingBottom: 8,
          }}>
            Selecionado: {selected.name} — R$ {selected.price}
          </div>
        )}
      </div>

      <ClientNav />
    </div>
  )
}
