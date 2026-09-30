import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'

/**
 * Minimal GET-with-loading-state hook. Intentionally not a full data
 * library (React Query etc.) — Phase 2's screens don't need caching or
 * background refetch, and adding one now would be exactly the
 * unnecessary complexity the brief warns against. `refetch` is exposed so
 * pages can reload after a mutation.
 */
export function useApi(path, { skip = false } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (skip) return
    setLoading(true)
    setError(null)
    try {
      setData(await api.get(path))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [path, skip])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, skip])

  return { data, loading, error, refetch: load }
}
