-- ============================================================
-- PetPass — Schema Migration
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. TABELA: profiles
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  name        text not null default '',
  whatsapp    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger para updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 2. TABELA: pets
-- ============================================================
create table if not exists public.pets (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  name                  text not null,
  species               text not null,
  breed                 text,
  sex                   text check (sex in ('macho', 'femea', 'nao_informado')),
  birth_date            date,
  color                 text,
  characteristics       text,
  important_information text,
  photo_url             text,
  is_lost               boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger pets_updated_at
  before update on public.pets
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================

-- Habilitar RLS
alter table public.profiles enable row level security;
alter table public.pets enable row level security;

-- PROFILES: usuário gerencia apenas o próprio perfil
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

-- Leitura pública de profiles (somente para contato via página do pet)
create policy "profiles_public_read" on public.profiles
  for select using (true);

-- PETS: usuário gerencia apenas os próprios pets
create policy "pets_select_own" on public.pets
  for select using (auth.uid() = user_id);

create policy "pets_insert_own" on public.pets
  for insert with check (auth.uid() = user_id);

create policy "pets_update_own" on public.pets
  for update using (auth.uid() = user_id);

create policy "pets_delete_own" on public.pets
  for delete using (auth.uid() = user_id);

-- Leitura pública de pets (para a página pública /pet/:id)
create policy "pets_public_read" on public.pets
  for select using (true);

-- ============================================================
-- 4. STORAGE — Bucket pet-photos
-- ============================================================

-- Criar bucket público para fotos dos pets
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;

-- Policy: qualquer pessoa pode visualizar as fotos (página pública)
create policy "pet_photos_public_read" on storage.objects
  for select using (bucket_id = 'pet-photos');

-- Policy: usuário autenticado pode fazer upload SOMENTE na sua própria pasta
create policy "pet_photos_auth_upload" on storage.objects
  for insert with check (
    bucket_id = 'pet-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: usuário pode deletar somente suas próprias fotos
create policy "pet_photos_auth_delete" on storage.objects
  for delete using (
    bucket_id = 'pet-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: usuário pode atualizar somente suas próprias fotos
create policy "pet_photos_auth_update" on storage.objects
  for update using (
    bucket_id = 'pet-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
