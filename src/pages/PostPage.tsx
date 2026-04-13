import { CalendarClock, PencilLine, Trash2, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'
import type { Post } from '../types/post.ts'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setCurrentUserId(authData.user?.id ?? null)
      setIsLoading(false)
    }

    void loadPost()
  }, [id])

  if (isLoading) return <section className="text-slate-700">Loading post...</section>
  if (error) return <section className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>
  if (!post) return <section className="text-slate-700">Post not found.</section>

  const isOwner = currentUserId === post.author_id

  return (
    <article className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{post.title}</h2>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <UserRound size={14} />
          {post.author_id.slice(0, 8)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock size={14} />
          {formatDate(post.created_at)}
        </span>
      </div>

      <p className="mt-6 whitespace-pre-wrap leading-8 text-slate-700">{post.content}</p>

      {isOwner && (
        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
          <Link
            to={`/post/${post.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <PencilLine size={16} />
            Edit Post
          </Link>
          <Link
            to={`/post/${post.id}/delete`}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
          >
            <Trash2 size={16} />
            Delete Post
          </Link>
        </div>
      )}
    </article>
  )
}
