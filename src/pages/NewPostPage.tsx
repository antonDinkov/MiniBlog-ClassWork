import { FilePlus2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostForm } from '../components/posts/PostForm.tsx'
import { supabase } from '../lib/supabase.ts'

export function NewPostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      setError('You need to login first.')
      setIsSubmitting(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        title: title.trim(),
        content: content.trim(),
        author_id: authData.user.id,
      })
      .select('id')
      .single()

    setIsSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    navigate(`/post/${data.id}`)
  }

  return (
    <section className="mx-auto max-w-3xl animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
        <FilePlus2 size={20} />
        New Post
      </h2>
      <p className="mt-2 text-sm text-slate-600">Create and publish a post visible to everyone.</p>

      <div className="mt-6">
        <PostForm
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Publish post"
        />
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    </section>
  )
}
