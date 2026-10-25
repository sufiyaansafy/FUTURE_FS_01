-- Stores every message sent through the portfolio contact form.
-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) between 5 and 200),
  message     text not null check (char_length(message) between 10 and 5000),
  emailed     boolean not null default false
);

create index if not exists contact_messages_email_created_idx
  on public.contact_messages (email, created_at desc);

-- Row Level Security is on, and there are deliberately NO policies.
-- That means the public (anon) key can't read, insert, update or delete anything.
-- Only the Edge Function, which uses the service role key on the server, can write here.
-- You read your messages in the Supabase dashboard: Table Editor > contact_messages.
alter table public.contact_messages enable row level security;
