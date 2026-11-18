-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- para habilitar el Ranking Online y XP por versículo de Desafío 119:9

create table if not exists public.desafio_players (
  id text primary key,
  name text not null check (char_length(trim(name)) >= 1 and char_length(name) <= 60),
  xp integer not null default 0 check (xp >= 0),
  verse_xp jsonb not null default '{}'::jsonb,
  mastered_count integer not null default 0 check (mastered_count >= 0 and mastered_count <= 4),
  finale_best_score integer not null default 0 check (finale_best_score >= 0 and finale_best_score <= 100),
  updated_at timestamptz not null default now()
);

create index if not exists idx_desafio_players_xp_desc
  on public.desafio_players (xp desc, updated_at asc);

alter table public.desafio_players enable row level security;

-- Lectura pública para el tablero de posiciones del grupo
drop policy if exists "desafio_players_select_all" on public.desafio_players;
create policy "desafio_players_select_all"
  on public.desafio_players for select
  using (true);

-- Permite registrar y actualizar puntajes desde la app juvenil
drop policy if exists "desafio_players_insert_all" on public.desafio_players;
create policy "desafio_players_insert_all"
  on public.desafio_players for insert
  with check (true);

drop policy if exists "desafio_players_update_all" on public.desafio_players;
create policy "desafio_players_update_all"
  on public.desafio_players for update
  using (true)
  with check (true);
