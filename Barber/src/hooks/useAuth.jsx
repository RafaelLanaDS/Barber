import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthChange, isBarber } from '../firebase/config'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(undefined) // undefined = carregando
  const [barber, setBarber]   = useState(false)

  useEffect(() => {
    const unsub = onAuthChange(u => {
      setUser(u)
      setBarber(isBarber(u))
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, barber, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
