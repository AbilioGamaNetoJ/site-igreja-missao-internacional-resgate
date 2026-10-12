-- Blog da Missão Internacional Resgate no Supabase.
-- Rode este arquivo uma vez no SQL Editor do projeto Supabase da igreja.
--
-- Como liberar o primeiro admin:
--   1. Em Authentication → Users, crie o usuário com o e-mail da pessoa (e-mail e senha).
--   2. Copie o UID dele e rode:
--        insert into public.admins (user_id, email) values ('<uid>', 'email@exemplo.com');
--
-- Depois disso, quem entra no /admin com esse e-mail pode escrever, publicar e editar o blog.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

-- Quem pode entrar no painel /admin. Cadastro aberto continua desligado:
-- um usuário do Auth só vira admin quando alguém o insere nesta tabela.
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- Um post por assunto. O slug é único e igual nos três idiomas
-- (o endereço do post não muda quando a tradução muda).
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Idioma em que o texto foi escrito (pt, es ou en).
  source_lang text not null check (source_lang in ('pt', 'es', 'en')),
  -- URL pública da capa no bucket blog (vazia quando não há capa).
  cover_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Uma linha por idioma. A linha do idioma original tem is_original = true;
-- as outras duas nascem da DeepL e podem ser corrigidas à mão (manually_edited = true,
-- o que impede que uma retradução as sobrescreva).
create table if not exists public.post_translations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  lang text not null check (lang in ('pt', 'es', 'en')),
  title text not null,
  excerpt text,
  body text,
  seo_title text,
  seo_description text,
  is_original boolean not null default false,
  manually_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, lang)
);

create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists post_translations_post_id_idx on public.post_translations (post_id);

-- updated_at se atualiza sozinho em qualquer UPDATE.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists post_translations_touch_updated_at on public.post_translations;
create trigger post_translations_touch_updated_at before update on public.post_translations
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.posts enable row level security;
alter table public.post_translations enable row level security;

-- Diz se quem chama é admin. security definer evita depender da política da
-- própria tabela admins (que só deixa cada um ver a si mesmo).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- admins: cada um vê apenas a própria linha (o endpoint de tradução usa isso
-- para confirmar que o JWT pertence a um admin).
drop policy if exists "admins leem a propria linha" on public.admins;
create policy "admins leem a propria linha"
  on public.admins for select
  to authenticated
  using (auth.uid() = user_id);

-- posts: anônimo (o site) lê só o publicado; admin lê e escreve tudo.
drop policy if exists "posts leitura publica" on public.posts;
create policy "posts leitura publica"
  on public.posts for select
  using (status = 'published' or public.is_admin());

drop policy if exists "admins escrevem posts" on public.posts;
create policy "admins escrevem posts"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins atualizam posts" on public.posts;
create policy "admins atualizam posts"
  on public.posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins apagam posts" on public.posts;
create policy "admins apagam posts"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

-- post_translations: anônimo lê traduções de post publicado; admin lê e escreve tudo.
drop policy if exists "traducoes leitura publica" on public.post_translations;
create policy "traducoes leitura publica"
  on public.post_translations for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_translations.post_id
        and (p.status = 'published' or public.is_admin())
    )
  );

drop policy if exists "admins escrevem traducoes" on public.post_translations;
create policy "admins escrevem traducoes"
  on public.post_translations for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins atualizam traducoes" on public.post_translations;
create policy "admins atualizam traducoes"
  on public.post_translations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins apagam traducoes" on public.post_translations;
create policy "admins apagam traducoes"
  on public.post_translations for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: bucket público blog
-- ---------------------------------------------------------------------------

-- Público para leitura (a capa e as imagens do texto aparecem no site);
-- escrita só para admins, pelas políticas abaixo.
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

drop policy if exists "admins enviam imagens do blog" on storage.objects;
create policy "admins enviam imagens do blog"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and public.is_admin());

drop policy if exists "admins atualizam imagens do blog" on storage.objects;
create policy "admins atualizam imagens do blog"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and public.is_admin())
  with check (bucket_id = 'blog' and public.is_admin());

drop policy if exists "admins apagam imagens do blog" on storage.objects;
create policy "admins apagam imagens do blog"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and public.is_admin());
