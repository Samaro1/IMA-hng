import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  // read existing value from localStorage on first load
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      // If something exists, parse it from JSON string back to JS object
      // If nothing exists yet, use the initialValue passed in
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  // Whenever storedValue changes, sync it to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [key, storedValue])

  // Return exactly like useState- [value, setter]
  return [storedValue, setStoredValue]
}

export default useLocalStorage