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

-- Categorias dos posts, cadastradas pelo painel. O slug é a chave estável (o nome
-- pode mudar sem soltar os posts) e cada idioma tem o seu nome.
create table if not exists public.categories (
  slug text primary key,
  name_pt text not null,
  name_es text not null,
  name_en text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sugestões iniciais, só quando a tabela está vazia: quem apagar uma categoria
-- não a vê voltar ao rodar este arquivo de novo.
insert into public.categories (slug, name_pt, name_es, name_en)
select * from (values
  ('devocional', 'Devocional', 'Devocional', 'Devotional'),
  ('ensino', 'Ensino', 'Enseñanza', 'Teaching'),
  ('avisos', 'Avisos', 'Avisos', 'Announcements'),
  ('eventos', 'Eventos', 'Eventos', 'Events'),
  ('testemunhos', 'Testemunhos', 'Testimonios', 'Testimonies'),
  ('acoes', 'Ações sociais', 'Acciones solidarias', 'Outreach')
) as seed (slug, name_pt, name_es, name_en)
where not exists (select 1 from public.categories);

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
  -- Categoria do post: o slug de public.categories (vazia quando não há). A chave
  -- estrangeira é criada mais abaixo, junto das colunas acrescentadas depois.
  category text,
  -- Quem assina o texto: nome livre, igual nos três idiomas.
  author text,
  -- Marca as publicações escolhidas para a vitrine da página inicial.
  is_featured boolean not null default false,
  -- Define a única publicação que abre a listagem editorial do blog.
  is_primary boolean not null default false,
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
  -- Passagem bíblica base (ex.: João 3:16), escrita e traduzida em cada idioma.
  bible_reference text,
  body text,
  seo_title text,
  seo_description text,
  is_original boolean not null default false,
  manually_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, lang)
);

-- Colunas acrescentadas depois da primeira versão. Para quem já tinha as tabelas,
-- basta rodar este arquivo de novo: o `if not exists` deixa o que já existe como está.
alter table public.posts add column if not exists category text;
alter table public.posts add column if not exists author text;
alter table public.posts add column if not exists is_featured boolean not null default false;
alter table public.posts add column if not exists is_primary boolean not null default false;
alter table public.post_translations add column if not exists bible_reference text;

-- Apagar uma categoria solta os posts dela (ficam sem categoria); renomear o slug acompanha.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_category_fkey') then
    alter table public.posts
      add constraint posts_category_fkey foreign key (category)
      references public.categories (slug) on update cascade on delete set null;
  end if;
end
$$;

create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists posts_featured_published_at_idx
  on public.posts (published_at desc)
  where status = 'published' and is_featured = true;
-- Há apenas uma publicação principal publicada no blog. Um rascunho pode ser
-- preparado como principal sem tirar do ar a escolha vigente. Caso o banco já
-- tenha recebido mais de uma marca publicada, conserva a atualizada por último.
with main_post as (
  select id from public.posts where status = 'published' and is_primary = true order by updated_at desc limit 1
)
update public.posts
set is_primary = false
where status = 'published' and is_primary = true and id not in (select id from main_post);

create unique index if not exists posts_only_one_primary_idx
  on public.posts ((is_primary))
  where status = 'published' and is_primary = true;
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

drop trigger if exists categories_touch_updated_at on public.categories;
create trigger categories_touch_updated_at before update on public.categories
  for each row execute function public.touch_updated_at();

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
alter table public.categories enable row level security;
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

-- categories: qualquer pessoa lê (o site mostra o nome); só admin cria, edita e apaga.
drop policy if exists "categorias leitura publica" on public.categories;
create policy "categorias leitura publica"
  on public.categories for select
  using (true);

drop policy if exists "admins escrevem categorias" on public.categories;
create policy "admins escrevem categorias"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins atualizam categorias" on public.categories;
create policy "admins atualizam categorias"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins apagam categorias" on public.categories;
create policy "admins apagam categorias"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

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
