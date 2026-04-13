import { Save } from 'lucide-react'
import { useMemo } from 'react'

type PostFormProps = {
  title: string
  content: string
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isSubmitting: boolean
  submitLabel: string
}

export function PostForm({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
  isSubmitting,
  submitLabel,
}: PostFormProps) {
  const helperText = useMemo(() => `${content.length} / 5000`, [content.length])

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
          placeholder="Write a clear headline"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700" htmlFor="content">
            Content
          </label>
          <span className="text-xs text-slate-500">{helperText}</span>
        </div>
        <textarea
          id="content"
          required
          rows={10}
          maxLength={5000}
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
          placeholder="Share your ideas"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-teal-300"
      >
        <Save size={16} />
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
