export const DAYS_PT  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
export const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export const toDateStr = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export const formatDate = (dateStr) => {
  const [y,m,day] = dateStr.split('-').map(Number)
  const d = new Date(y, m-1, day)
  return `${DAYS_PT[d.getDay()]}, ${day} ${MONTHS_PT[m-1]}`
}

export const getWeekDays = () => {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      dateStr:   toDateStr(d),
      dayName:   DAYS_PT[d.getDay()],
      dayOfWeek: d.getDay(),
      dayNum:    d.getDate(),
      isToday:   i === 0,
    }
  })
}

export const todayStr = () => toDateStr(new Date())
