import { PencilLine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PostForm } from '../components/posts/PostForm.tsx'
import { supabase } from '../lib/supabase.ts'
import type { Post } from '../types/post.ts'

export function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function loadPost() {
      if (!id) {
        setError('Invalid post id.')
        setIsLoading(false)
        return
      }

      const [{ data: postData, error: postError }, { data: authData }] = await Promise.all([
        supabase.from('posts').select('id, title, content, author_id, created_at').eq('id', id).single(),
        supabase.auth.getUser(),
      ])

      if (postError) {
        setError(postError.message)
        setIsLoading(false)
        return
      }

      const owner = authData.user?.id === (postData as Post).author_id
      setIsOwner(owner)
      setTitle((postData as Post).title)
      setContent((postData as Post).content)
      setIsLoading(false)
    }

    void loadPost()
  }, [id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id) return

    setError(null)
    setIsSubmitting(true)

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim(),
      })
      .eq('id', id)

    setIsSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate(`/post/${id}`)
  }

  if (isLoading) return <section className="text-slate-700">Loading post editor...</section>
  if (error) return <section className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>

  if (!isOwner) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        You can only edit your own posts.{' '}
        <Link className="font-semibold underline" to="/">
          Back home
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
        <PencilLine size={20} />
        Edit Post
      </h2>
      <p className="mt-2 text-sm text-slate-600">Update your post and save changes.</p>

      <div className="mt-6">
        <PostForm
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save changes"
        />
      </div>
    </section>
  )
}
