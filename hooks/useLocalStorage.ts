"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook for using localStorage with React
 * @param key Key to store in localStorage
 * @param defaultValue Default value if not exists in localStorage
 * @returns [value, setValue] - Current value and function to update it
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store the current value
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue
    }

    try {
      // Get from localStorage
      const item = window.localStorage.getItem(key)
      // Parse stored value or return default value
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}
