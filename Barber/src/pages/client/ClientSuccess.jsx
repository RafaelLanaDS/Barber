import { useNavigate } from 'react-router-dom'

export default function ClientSuccess() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <div className="status-bar"><span style={{ fontWeight:600 }}>✂ Valtinho Barber</span></div>
      <div className="success-screen">
        <div style={{ fontSize:64, marginBottom:16 }}>✂</div>
        <div className="success-title">Agendado!</div>
        <div className="success-sub">
          O WhatsApp abriu com a mensagem pronta.<br/>
          Clique em <span style={{ color:'var(--wp-green)', fontWeight:600 }}>Enviar</span> para confirmar com o Valtinho.
        </div>
        <div className="success-card">
          <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1.5, color:'var(--muted)', marginBottom:10 }}>
            O que acontece agora?
          </div>
          {[
            { icon:'💬', text:'Valtinho recebe sua mensagem no WhatsApp' },
            { icon:'✅', text:'Ele confirma o horário por lá mesmo' },
            { icon:'⏰', text:'No dia, apareça no horário marcado' },
          ].map(item=>(
            <div key={item.text} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, textAlign:'left' }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <span style={{ fontSize:13, color:'var(--muted)' }}>{item.text}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-red" style={{ margin:0, width:'100%' }} onClick={()=>navigate('/client/services')}>
          ✂ Fazer outro agendamento
        </button>
        <button className="btn btn-outline" style={{ margin:'8px 0 0', width:'100%' }} onClick={()=>navigate('/client/history')}>
          📋 Ver meus agendamentos
        </button>
      </div>
    </div>
  )
}
