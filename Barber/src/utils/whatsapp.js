import { BARBER_PHONE, BARBERSHOP_NAME } from '../firebase/config'
import { formatDate } from './date'

export const notifyBarber = ({ clientName, clientPhone, service, date, time, price }) => {
  const msg = [
    `✂ *Novo Agendamento — ${BARBERSHOP_NAME}*`,
    ``,
    `👤 *Cliente:* ${clientName}`,
    `📱 *WhatsApp:* ${clientPhone || 'Não informado'}`,
    `💈 *Serviço:* ${service}`,
    `📅 *Data:* ${formatDate(date)}`,
    `⏰ *Horário:* ${time}`,
    `💰 *Valor:* R$ ${price}`,
    ``,
    `_Agendamento feito pelo app ${BARBERSHOP_NAME}_`,
  ].join('\n')

  window.open(`https://wa.me/${BARBER_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
}

export const sendPromo = (clientPhone, message) => {
  const phone = clientPhone.replace(/\D/g, '')
  window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
}
