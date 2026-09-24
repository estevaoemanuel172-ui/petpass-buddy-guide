-- ============================================================
-- PetPass — Schema Migration 002
-- Security: Remove public profile access and create secure RPC
-- ============================================================

-- 1. Remove the unsafe public read policy from profiles
drop policy if exists "profiles_public_read" on public.profiles;

-- 2. Create secure RPC to get owner info
-- This function runs with "security definer" meaning it bypasses RLS
-- to read the profile, but only for the specific pet_id passed,
-- and it only returns name and whatsapp.
create or replace function public.get_owner_profile(pet_id_param uuid)
returns table (
  id uuid,
  name text,
  whatsapp text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select pr.id, pr.name, pr.whatsapp
  from public.pets p
  join public.profiles pr on pr.user_id = p.user_id
  where p.id = pet_id_param;
end;
$$;
