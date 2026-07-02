import { BARBER_CREDENTIALS } from '../data/db'
import { formatDate } from './date'

/**
 * Abre o WhatsApp do barbeiro com mensagem de novo agendamento pré-preenchida.
 * O cliente só precisa clicar em "Enviar".
 */
export const notifyBarber = ({ clientName, clientPhone, service, date, time, price }) => {
  const msg = [
    `✂ *Novo Agendamento — ${BARBER_CREDENTIALS.barbershop}*`,
    ``,
    `👤 *Cliente:* ${clientName}`,
    `📱 *WhatsApp:* ${clientPhone || 'Não informado'}`,
    `💈 *Serviço:* ${service}`,
    `📅 *Data:* ${formatDate(date)}`,
    `⏰ *Horário:* ${time}`,
    `💰 *Valor:* R$ ${price}`,
    ``,
    `_Agendamento feito pelo app Navalha Barbearia_`,
  ].join('\n')

  const url = `https://wa.me/${BARBER_CREDENTIALS.phone}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}
