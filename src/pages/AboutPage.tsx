import { Feather, ShieldCheck, Zap } from 'lucide-react'

export function AboutPage() {
  return (
    <section className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">About Mini Blog</h2>
        <p className="mt-2 text-slate-600">A lightweight blog app with public reading, secure ownership, and fast publishing.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Feather className="text-teal-600" size={18} />
          <h3 className="mt-3 font-semibold text-slate-900">Write Quickly</h3>
          <p className="mt-2 text-sm text-slate-600">Publish posts in seconds with a focused writing flow.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="text-teal-600" size={18} />
          <h3 className="mt-3 font-semibold text-slate-900">Secure Ownership</h3>
          <p className="mt-2 text-sm text-slate-600">RLS policies guarantee only owners can modify their posts.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Zap className="text-teal-600" size={18} />
          <h3 className="mt-3 font-semibold text-slate-900">Responsive by Default</h3>
          <p className="mt-2 text-sm text-slate-600">Modern Tailwind UI with smooth transitions across devices.</p>
        </article>
      </div>
    </section>
  )
}
