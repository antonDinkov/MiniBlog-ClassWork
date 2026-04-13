import { AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'
import type { Post } from '../types/post.ts'

export function DeletePostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
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

      setPost(postData)
      setIsOwner(authData.user?.id === (postData as Post).author_id)
      setIsLoading(false)
    }

    void loadPost()
  }, [id])

  async function handleDelete() {
    if (!id) return
    setError(null)
    setIsDeleting(true)

    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id)

    setIsDeleting(false)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    navigate('/', { replace: true })
  }

  if (isLoading) return <section className="text-slate-700">Loading deletion flow...</section>
  if (error) return <section className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>

  if (!isOwner) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        You can only delete your own posts.{' '}
        <Link className="font-semibold underline" to="/">
          Back home
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-xl animate-fade-in rounded-2xl border border-rose-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-rose-700">
        <AlertTriangle size={20} />
        Delete Post
      </h2>
      <p className="mt-3 text-slate-700">
        This action cannot be undone. Delete <span className="font-semibold">{post?.title}</span>?
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
        >
          {isDeleting ? 'Deleting...' : 'Yes, delete post'}
        </button>
        <Link
          to={`/post/${id}`}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </section>
  )
}
