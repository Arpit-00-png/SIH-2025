import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('userProfile')
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Failed to load user profile:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateUser = (data) => {
    const updated = { ...(user || {}), ...data }
    setUser(updated)
    try {
      localStorage.setItem('userProfile', JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save user profile:', err)
    }
  }

  const login = (data) => {
    setUser(data)
    try {
      localStorage.setItem('userProfile', JSON.stringify(data))
    } catch (err) {
      console.error('Failed to save user profile on login:', err)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('userProfile')
    } catch (err) {
      console.error('Failed to clear user profile on logout:', err)
    }
  }

  const value = { user, updateUser, login, logout, isLoading }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
} 