import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'

// ── Firebase config ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyBmiqxUoiuCDbSuZ-68VOb96ti7VCRET_c',
  authDomain: 'valtinho-barber.firebaseapp.com',
  projectId: 'valtinho-barber',
  storageBucket: 'valtinho-barber.firebasestorage.app',
  messagingSenderId: '874479038069',
  appId: '1:874479038069:web:34a19001bb10d20553923c',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// ── BARBER email fixo ─────────────────────────────────────────
export const BARBER_EMAIL = 'valtinho@navalha.com'
export const BARBER_NAME = 'Valtinho'
export const BARBER_PHONE = '5514998217622'
export const BARBERSHOP_NAME = 'Stúdio Valtinho Barber'

// ── SERVIÇOS ──────────────────────────────────────────────────
export const SERVICES = [
  { id: 1, name: 'Cabelo',            description: 'Fade preciso com acabamento impecável', price: 35, duration: 30, icon: '✂' },
  { id: 2, name: 'Barba',             description: 'Tradicional',                           price: 35, duration: 15, icon: '◈' },
  { id: 3, name: 'Cabelo e Barba',    description: 'Corte e cabelo e barba tradicional',    price: 70, duration: 45, icon: '▲' },
  { id: 4, name: 'Alisamento',        description: 'Alisamento capilar completo',           price: 30, duration: 90, icon: '★' },
  { id: 5, name: 'Luzes',             description: 'Luzes',                                 price: 130, duration: 60, icon: '✦' },
  { id: 6, name: 'Platinado',         description: 'Platinado',                             price: 130, duration: 60, icon: '✦' },
]

// ── HORÁRIOS ──────────────────────────────────────────────────
export const WORKING_HOURS = [
  '08:00','09:00','10:00','11:00',
  '13:00','14:00','15:00','16:00','17:00',
]

// ── AUTH ──────────────────────────────────────────────────────
export const loginBarber = (password) =>
  signInWithEmailAndPassword(auth, BARBER_EMAIL, password)

export const loginClient = async (name, phone) => {
  // clientes usam phone como "email" fictício para o Firebase Auth
  const fakeEmail = `${phone.replace(/\D/g, '')}@cliente.valtinho.com`
  const password  = phone.replace(/\D/g, '')
  try {
    const cred = await signInWithEmailAndPassword(auth, fakeEmail, password)
    // atualiza nome se necessário
    await setDoc(doc(db, 'clients', cred.user.uid), { name, phone, updatedAt: serverTimestamp() }, { merge: true })
    return cred
  } catch {
    // cria conta nova
    const cred = await createUserWithEmailAndPassword(auth, fakeEmail, password)
    await setDoc(doc(db, 'clients', cred.user.uid), {
      name, phone, createdAt: serverTimestamp(),
    })
    return cred
  }
}

export const logout = () => signOut(auth)

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb)

export const isBarber = (user) => user?.email === BARBER_EMAIL

// ── AGENDAMENTOS ──────────────────────────────────────────────
export const createAppointment = (data) =>
  addDoc(collection(db, 'appointments'), { ...data, createdAt: serverTimestamp() })

export const cancelAppointment = (id) =>
  deleteDoc(doc(db, 'appointments', id))

export const getAppointmentsByDate = async (dateStr) => {
  const q = query(collection(db, 'appointments'), where('date', '==', dateStr))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const listenAppointmentsByDate = (dateStr, cb) => {
  const q = query(
    collection(db, 'appointments'),
    where('date', '==', dateStr),
    orderBy('time')
  )
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
}

export const getClientAppointments = async (uid) => {
  const q = query(
    collection(db, 'appointments'),
    where('clientUid', '==', uid),
    orderBy('date', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── HORÁRIOS FIXOS ────────────────────────────────────────────
// fixedSlots: { dayOfWeek: 0-6, time: '10:00', clientName, clientPhone, clientUid }
export const createFixedSlot = (data) =>
  addDoc(collection(db, 'fixedSlots'), { ...data, createdAt: serverTimestamp() })

export const deleteFixedSlot = (id) =>
  deleteDoc(doc(db, 'fixedSlots', id))

export const getFixedSlots = async () => {
  const snap = await getDocs(collection(db, 'fixedSlots'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const listenFixedSlots = (cb) =>
  onSnapshot(collection(db, 'fixedSlots'), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

// Exceções: semanas que o fixo foi desmarcado
export const createFixedException = (data) =>
  addDoc(collection(db, 'fixedExceptions'), { ...data, createdAt: serverTimestamp() })

export const deleteFixedException = async (fixedSlotId, dateStr) => {
  const q = query(
    collection(db, 'fixedExceptions'),
    where('fixedSlotId', '==', fixedSlotId),
    where('date', '==', dateStr)
  )
  const snap = await getDocs(q)
  snap.docs.forEach(d => deleteDoc(doc(db, 'fixedExceptions', d.id)))
}

export const getFixedExceptions = async (dateStr) => {
  const q = query(collection(db, 'fixedExceptions'), where('date', '==', dateStr))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── LUCROS ────────────────────────────────────────────────────
export const addProfit = (data) =>
  addDoc(collection(db, 'profits'), { ...data, createdAt: serverTimestamp() })

export const listenProfits = (cb) =>
  onSnapshot(collection(db, 'profits'), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )

// ── CLIENTES (lista para promoções) ───────────────────────────
export const getAllClients = async () => {
  const snap = await getDocs(collection(db, 'clients'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── DIAS BLOQUEADOS ───────────────────────────────────────────
export const blockDay = (dateStr) =>
  setDoc(doc(db, 'blockedDays', dateStr), { date: dateStr, createdAt: serverTimestamp() })

export const unblockDay = (dateStr) =>
  deleteDoc(doc(db, 'blockedDays', dateStr))

export const listenBlockedDays = (cb) =>
  onSnapshot(collection(db, 'blockedDays'), snap =>
    cb(snap.docs.map(d => d.id))
  )

export const isDayBlocked = async (dateStr) => {
  const snap = await getDoc(doc(db, 'blockedDays', dateStr))
  return snap.exists()
}
