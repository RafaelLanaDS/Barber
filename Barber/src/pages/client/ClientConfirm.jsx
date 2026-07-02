import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveAppointment, addProfit } from '../../data/db'
import { notifyBarber } from '../../utils/whatsapp'
import { formatDate } from '../../utils/date'

export default function ClientConfirm() {
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const b = sessionStorage.getItem('booking')
    if (!b) { navigate('/client/services'); return }
    setBooking(JSON.parse(b))
  }, [])

  const handleFinalize = () => {
    if (!booking) return
    setLoading(true)

    // Salva no localStorage
    saveAppointment(booking)
    addProfit(booking.price, booking.service, booking.date)

    // Abre WhatsApp do barbeiro com mensagem pronta
    notifyBarber(booking)

    setTimeout(() => {
      sessionStorage.removeItem('booking')
      sessionStorage.removeItem('selected_service')
      navigate('/client/success')
    }, 600)
  }

  if (!booking) return null

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Navalha</span>
        <span style={{ color: 'var(--muted)', fontSize: 11 }}>Confirmação</span>
      </div>

      <div style={{ flexShrink: 0, padding: '28px 20px 10px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64,
          background: '#0F2A1A',
          border: '2px solid var(--success)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
          fontSize: 28, color: 'var(--success)',
        }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)' }}>Quase pronto!</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
          Revise os detalhes e confirme
        </div>
      </div>

      <div className="page-content" style={{ paddingBottom: 20 }}>
        <div className="section-label">Resumo</div>
        <div className="confirm-box">
          <div className="confirm-row">
            <span className="confirm-key">Serviço</span>
            <span className="confirm-val">{booking.service}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Data</span>
            <span className="confirm-val">{formatDate(booking.date)}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Horário</span>
            <span className="confirm-val">{booking.time}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Cliente</span>
            <span className="confirm-val">{booking.clientName}</span>
          </div>
          {booking.clientPhone && (
            <div className="confirm-row">
              <span className="confirm-key">WhatsApp</span>
              <span className="confirm-val">{booking.clientPhone}</span>
            </div>
          )}
          <div className="confirm-row confirm-total">
            <span className="confirm-key">Total</span>
            <span className="confirm-val">R$ {booking.price}</span>
          </div>
        </div>

        {/* Info WhatsApp */}
        <div className="section-label">Como funciona a notificação</div>
        <div className="info-box">
          <span className="info-box-icon">💬</span>
          <div className="info-box-text">
            <strong>WhatsApp automático</strong>
            Ao confirmar, o WhatsApp abrirá com uma mensagem já preenchida para o barbeiro.
            Você só precisa clicar em <strong style={{ color: 'var(--wp-green)' }}>Enviar</strong>.
          </div>
        </div>

        <button
          className="btn btn-wp"
          onClick={handleFinalize}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {loading ? 'Abrindo WhatsApp...' : 'Confirmar & Notificar Barbeiro'}
        </button>

        <button
          className="btn btn-outline"
          onClick={() => navigate('/client/schedule')}
          style={{ margin: '0 16px 8px' }}
        >
          ← Voltar e editar
        </button>
      </div>
    </div>
  )
}
