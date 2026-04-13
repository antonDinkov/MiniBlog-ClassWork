import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabase.ts'

export function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setIsAuthed(Boolean(data.session))
      setIsLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session))
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <section className="text-slate-700">Checking authentication...</section>
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
