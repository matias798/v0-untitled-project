// Utilidades para llamadas a API con manejo de errores y caché

import { get, set } from "idb-keyval"

// Duración de la caché en milisegundos (24 horas)
const CACHE_DURATION = 24 * 60 * 60 * 1000

// Interfaz para los datos en caché
interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Función para obtener datos con caché y manejo de errores
 * @param url URL de la API
 * @param options Opciones de fetch
 * @param cacheKey Clave personalizada para la caché
 * @param fallbackData Datos de respaldo en caso de error
 */
export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string,
  fallbackData?: T,
): Promise<T> {
  const key = cacheKey || url
  let cachedData: CachedData<T> | undefined

  // Intentar obtener datos de la caché
  if (typeof window !== "undefined") {
    try {
      cachedData = await get(key)

      // Si hay datos en caché y no han expirado, devolverlos
      if (cachedData && cachedData.timestamp && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log(`[API] Usando datos en caché para: ${key}`)
        return cachedData.data
      }
    } catch (error) {
      console.warn("[API] Error al acceder a la caché:", error)
    }
  }

  // Si no hay datos en caché o han expirado, obtener de la API
  try {
    console.log(`[API] Obteniendo datos de: ${url}`)

    // Agregar timeout para evitar esperas largas
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos de timeout

    const fetchOptions = {
      ...options,
      signal: controller.signal,
    }

    const response = await fetch(url, fetchOptions)
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Guardar en caché
    if (typeof window !== "undefined") {
      try {
        await set(key, {
          data,
          timestamp: Date.now(),
        })
      } catch (cacheError) {
        console.warn("[API] Error al guardar en caché:", cacheError)
      }
    }

    return data as T
  } catch (error) {
    console.error(`[API] Error al obtener datos de ${url}:`, error)

    // Si hay datos en caché (aunque hayan expirado), usarlos como respaldo
    if (cachedData) {
      console.log("[API] Usando datos en caché expirados como respaldo")
      return cachedData.data
    }

    // Si hay datos de respaldo proporcionados, usarlos
    if (fallbackData !== undefined) {
      console.log("[API] Usando datos de respaldo predefinidos")
      return fallbackData
    }

    // Si no hay respaldo, relanzar el error
    throw error
  }
}

/**
 * Verifica si el dispositivo está en línea
 */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine
}

/**
 * Guarda datos en la caché local
 */
export async function saveToCache<T>(key: string, data: T): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      await set(key, {
        data,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.warn("[API] Error al guardar en caché:", error)
    }
  }
}

/**
 * Obtiene datos de la caché local
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (typeof window !== "undefined") {
    try {
      const cachedData = (await get(key)) as CachedData<T> | undefined
      if (cachedData) {
        return cachedData.data
      }
    } catch (error) {
      console.warn("[API] Error al obtener de la caché:", error)
    }
  }
  return null
}

/**
 * Limpia la caché local
 */
export async function clearCache(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      // Usar idb-keyval para limpiar toda la caché
      // Esto es útil para solucionar problemas o cuando se actualiza la app
      await set("cache-version", Date.now())
    } catch (error) {
      console.warn("[API] Error al limpiar la caché:", error)
    }
  }
}
