alter table public.profiles
add column if not exists avatar_url text,
add column if not exists membership_expires_at timestamptz,
add column if not exists contact_wechat text;

revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (nickname) on public.profiles to authenticated;
