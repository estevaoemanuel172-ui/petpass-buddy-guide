-- ============================================================
-- PetPass — Schema Migration 003
-- Automate profile creation on user signup
-- ============================================================

-- Create the trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Tutor')
  );
  return new;
end;
$$;

-- Create the trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
