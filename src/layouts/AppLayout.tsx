import { LogOut, PenSquare, ScrollText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'

const navClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

export function AppLayout() {
  const navigate = useNavigate()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session))
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session))
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen px-6 py-8 text-slate-900 md:px-12">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-300/30 backdrop-blur md:p-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-teal-700">
              <ScrollText size={14} />
              Mini Blog
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Stories with modern flow</h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLink className={navClassName} to="/" end>
              Home
            </NavLink>
            <NavLink className={navClassName} to="/about">
              About
            </NavLink>

            {isAuthed && (
              <NavLink className={navClassName} to="/post/new">
                <span className="inline-flex items-center gap-1.5">
                  <PenSquare size={14} />
                  New Post
                </span>
              </NavLink>
            )}

            {!isAuthed && (
              <>
                <NavLink className={navClassName} to="/login">
                  Login
                </NavLink>
                <NavLink className={navClassName} to="/register">
                  Register
                </NavLink>
              </>
            )}

            {isAuthed && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <span className="inline-flex items-center gap-1.5">
                  <LogOut size={14} />
                  Logout
                </span>
              </button>
            )}
          </nav>
        </header>

        <main className="flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 md:p-10">
          <Outlet />
        </main>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-4 text-sm text-slate-500">
          <p>Mini Blog • Built with React + Supabase</p>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Public read • Owner write</p>
        </footer>
      </div>
    </div>
  )
}
