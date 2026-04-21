import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Read saved preference on first load, default to 'light'
    return localStorage.getItem('invoice-theme') || 'light'
  })

  useEffect(() => {
    // Apply theme to the <html> element, whichis what CSS [data-theme="dark"] targets
    document.documentElement.setAttribute('data-theme', theme)
    // Save preference so it survives page refresh
    localStorage.setItem('invoice-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook so any component can access theme
export function useTheme() {
  return useContext(ThemeContext)
}