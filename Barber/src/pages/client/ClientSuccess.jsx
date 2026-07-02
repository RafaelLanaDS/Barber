import { useNavigate } from 'react-router-dom'

export default function ClientSuccess() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="status-bar">
        <span style={{ fontWeight: 600 }}>✂ Navalha</span>
      </div>
      <div className="success-screen">
        <div className="success-icon">✂</div>
        <div className="success-title">Agendado!</div>
        <div className="success-sub">
          O WhatsApp abriu com a mensagem pronta.<br />
          Só clique em <span style={{ color: 'var(--wp-green)', fontWeight: 600 }}>Enviar</span> para confirmar com o barbeiro.
        </div>

        <div className="success-card">
          <div className="eyebrow">O que acontece agora?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, textAlign: 'left' }}>
            {[
              { icon: '💬', text: 'Barbeiro recebe sua mensagem no WhatsApp' },
              { icon: '✅', text: 'Ele confirma o horário por lá mesmo' },
              { icon: '⏰', text: 'No dia, apareça no horário marcado' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-gold"
          style={{ margin: 0, width: '100%' }}
          onClick={() => navigate('/')}
        >
          🏠 Voltar ao início
        </button>

        <button
          className="btn btn-outline"
          style={{ margin: '8px 0 0', width: '100%' }}
          onClick={() => navigate('/client/services')}
        >
          ✂ Fazer outro agendamento
        </button>
      </div>
    </div>
  )
}
