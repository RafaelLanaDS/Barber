import { useState, useEffect } from 'react'
import { isAuthenticated, saveAuth, clearAuth, BARBER_CREDENTIALS } from '../data/db'

export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated())

  const login = (username, password) => {
    if (
      username === BARBER_CREDENTIALS.username &&
      password === BARBER_CREDENTIALS.password
    ) {
      saveAuth()
      setLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    clearAuth()
    setLoggedIn(false)
  }

  return { loggedIn, login, logout }
}
