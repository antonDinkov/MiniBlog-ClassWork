import { NavLink, Outlet } from 'react-router-dom'

const navClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

export function AppLayout() {
  return (
    <div className="min-h-screen px-6 py-8 text-slate-900 md:px-12">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-300/30 backdrop-blur md:p-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Mini Blog</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Mini Blog Frontend</h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLink className={navClassName} to="/" end>
              Home
            </NavLink>
            <NavLink className={navClassName} to="/post/new">
              New Post
            </NavLink>
            <NavLink className={navClassName} to="/about">
              About
            </NavLink>
            <NavLink className={navClassName} to="/login">
              Login
            </NavLink>
            <NavLink className={navClassName} to="/register">
              Register
            </NavLink>
          </nav>
        </header>

        <main className="flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 md:p-10">
          <Outlet />
        </main>

        <footer className="mt-8 border-t border-slate-200/80 pt-4 text-sm text-slate-500">
          Mini Blog • Built with React + Supabase
        </footer>
      </div>
    </div>
  )
}
