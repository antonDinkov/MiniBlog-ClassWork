import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm.tsx'
import { supabase } from '../lib/supabase.ts'

export function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsSubmitting(true)

    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setIsSubmitting(false)
      setError(authError.message)
      return
    }

    if (signUpData.session) {
      setIsSubmitting(false)
      navigate('/', { replace: true })
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (signInError) {
      setMessage('Account created, but auto-login is blocked until email confirmation is enabled/disabled in Supabase settings.')
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <section className="mx-auto max-w-lg animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
        <UserPlus size={20} />
        Register
      </h2>
      <p className="mt-2 text-sm text-slate-600">Create your account to publish and manage your posts.</p>

      <div className="mt-6">
        <AuthForm
          mode="register"
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {message && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

      <p className="mt-5 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-600">
          Login
        </Link>
      </p>
    </section>
  )
}
