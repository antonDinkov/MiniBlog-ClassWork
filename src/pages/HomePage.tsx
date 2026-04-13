import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PostCard } from '../components/posts/PostCard.tsx'
import { supabase } from '../lib/supabase.ts'
import type { Post } from '../types/post.ts'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPosts() {
      const { data, error: queryError } = await supabase
        .from('posts')
        .select('id, title, content, author_id, created_at')
        .order('created_at', { ascending: false })

      if (queryError) {
        setError(queryError.message)
        setIsLoading(false)
        return
      }

      setPosts(data ?? [])
      setIsLoading(false)
    }

    void loadPosts()
  }, [])

  return (
    <section className="space-y-6 animate-fade-in">
      <header className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-orange-50 p-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-teal-700 shadow-sm">
          <Sparkles size={14} />
          Fresh Posts
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Latest stories from the community</h2>
        <p className="mt-2 text-slate-600">Read public posts, then create your own after signing in.</p>
      </header>

      {isLoading && <p className="text-sm text-slate-600">Loading posts...</p>}
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
          No posts yet. Be the first to publish one.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
