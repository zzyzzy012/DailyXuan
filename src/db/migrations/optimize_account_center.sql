alter table public.profiles
add column if not exists profile_updated_at timestamptz,
add column if not exists email_rebind_requested_at timestamptz;

alter table public.profiles
drop constraint if exists profiles_membership_level_check;

update public.profiles
set membership_level = case membership_level
  when 'daily_5' then 'basic'
  when 'daily_15' then 'plus'
  else membership_level
end
where membership_level in ('daily_5', 'daily_15');

alter table public.profiles
add constraint profiles_membership_level_check
check (membership_level in ('free', 'basic', 'plus'));

create or replace function public.update_own_profile_settings(input_nickname text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  last_updated_at timestamptz;
begin
  if current_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select profile_updated_at
  into last_updated_at
  from public.profiles
  where id = current_user_id;

  if last_updated_at is not null and last_updated_at > now() - interval '7 days' then
    raise exception 'PROFILE_UPDATE_COOLDOWN';
  end if;

  update public.profiles
  set
    nickname = nullif(trim(input_nickname), ''),
    profile_updated_at = now()
  where id = current_user_id;
end;
$$;

revoke all on function public.update_own_profile_settings(text) from public;
grant execute on function public.update_own_profile_settings(text) to authenticated;

grant update (email_rebind_requested_at) on public.profiles to authenticated;
