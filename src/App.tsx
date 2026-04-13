import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AboutPage } from './pages/AboutPage.tsx'
import { DeletePostPage } from './pages/DeletePostPage.tsx'
import { EditPostPage } from './pages/EditPostPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { NewPostPage } from './pages/NewPostPage.tsx'
import { PostPage } from './pages/PostPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { supabase } from './lib/supabase'

function ProtectedRoute() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about" element={<AboutPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="post/new" element={<NewPostPage />} />
            <Route path="post/:id/edit" element={<EditPostPage />} />
            <Route path="post/:id/delete" element={<DeletePostPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
