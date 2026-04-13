import { CalendarClock, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Post } from '../../types/post.ts'

type PostCardProps = {
  post: Post
}

const MAX_EXCERPT = 140

function getExcerpt(content: string) {
  if (content.length <= MAX_EXCERPT) return content
  return `${content.slice(0, MAX_EXCERPT).trimEnd()}...`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <UserRound size={14} />
          {post.author_id.slice(0, 8)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock size={14} />
          {formatDate(post.created_at)}
        </span>
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-slate-900">{post.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{getExcerpt(post.content)}</p>

      <Link
        to={`/post/${post.id}`}
        className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Read post
      </Link>
    </article>
  )
}
