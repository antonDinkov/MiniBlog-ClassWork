import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm.tsx'
import { supabase } from '../lib/supabase.ts'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <section className="mx-auto max-w-lg animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
        <LogIn size={20} />
        Login
      </h2>
      <p className="mt-2 text-sm text-slate-600">Welcome back. Continue where you left off.</p>

      <div className="mt-6">
        <AuthForm
          mode="login"
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <p className="mt-5 text-sm text-slate-600">
        New here?{' '}
        <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-600">
          Create an account
        </Link>
      </p>
    </section>
  )
}
