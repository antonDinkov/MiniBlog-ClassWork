create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_idx on public.posts (created_at desc);

alter table public.posts enable row level security;

grant select on table public.posts to anon, authenticated;
grant insert, update, delete on table public.posts to authenticated;

create policy "Public read posts"
  on public.posts
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated insert own posts"
  on public.posts
  for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Authors update own posts"
  on public.posts
  for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Authors delete own posts"
  on public.posts
  for delete
  to authenticated
  using (auth.uid() = author_id);
