// ============================================================
// BANCO DE DADOS FICTÍCIO (mock)
// Todos os dados ficam no localStorage do navegador.
// Para produção: substituir por Firebase / Supabase.
// ============================================================

// --- CREDENCIAIS DO BARBEIRO ---
export const BARBER_CREDENTIALS = {
  username: 'Valtinho',
  password: 'valtinho123',
  name: 'João Silva',
  phone: '5514997389356', // número do WhatsApp do barbeiro (com DDI)
  barbershop: 'Navalha Barbearia',
}

// --- SERVIÇOS OFERECIDOS ---
export const SERVICES = [
  {
    id: 1,
    name: 'Degradê Clássico',
    description: 'Fade preciso com acabamento impecável',
    price: 40,
    duration: 45, // minutos
    icon: '✂',
  },
  {
    id: 2,
    name: 'Corte Tesoura',
    description: 'Tradicional, textura natural e leve',
    price: 50,
    duration: 60,
    icon: '◈',
  },
  {
    id: 3,
    name: 'Barba Estilizada',
    description: 'Modelagem com navalha + toalha quente',
    price: 35,
    duration: 30,
    icon: '▲',
  },
  {
    id: 4,
    name: 'Completo (Corte + Barba)',
    description: 'Corte + Barba + Hidratação capilar',
    price: 70,
    duration: 90,
    icon: '★',
  },
  {
    id: 5,
    name: 'Corte Infantil',
    description: 'Para crianças até 12 anos',
    price: 30,
    duration: 30,
    icon: '✦',
  },
]

// --- HORÁRIOS DE FUNCIONAMENTO ---
export const WORKING_HOURS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

// --- HELPERS LOCALSTORAGE ---

const KEYS = {
  auth: 'barber_auth',
  appointments: 'appointments',
  profits: 'profits',
}

// Auth
export const saveAuth = () => localStorage.setItem(KEYS.auth, 'true')
export const clearAuth = () => localStorage.removeItem(KEYS.auth)
export const isAuthenticated = () => localStorage.getItem(KEYS.auth) === 'true'

// Agendamentos
export const getAppointments = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.appointments)) || []
  } catch {
    return []
  }
}

export const saveAppointment = (appointment) => {
  const list = getAppointments()
  list.push({ ...appointment, id: Date.now() })
  localStorage.setItem(KEYS.appointments, JSON.stringify(list))
}

export const deleteAppointment = (id) => {
  const list = getAppointments().filter(a => a.id !== id)
  localStorage.setItem(KEYS.appointments, JSON.stringify(list))
}

export const getAppointmentsByDate = (dateStr) => {
  return getAppointments().filter(a => a.date === dateStr)
}

export const isSlotTaken = (dateStr, time) => {
  return getAppointments().some(a => a.date === dateStr && a.time === time)
}

// Lucros
export const getProfits = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.profits)) || []
  } catch {
    return []
  }
}

export const addProfit = (value, service, date) => {
  const list = getProfits()
  list.push({ value, service, date, id: Date.now() })
  localStorage.setItem(KEYS.profits, JSON.stringify(list))
}

export const getProfitByPeriod = (period) => {
  const all = getProfits()
  const now = new Date()

  return all.filter(p => {
    const d = new Date(p.date)
    if (period === 'day') {
      return d.toDateString() === now.toDateString()
    }
    if (period === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return d >= weekAgo
    }
    if (period === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }
    return false
  }).reduce((sum, p) => sum + p.value, 0)
}
