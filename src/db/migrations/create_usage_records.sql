create table if not exists public.usage_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_type text not null,
  quota_bucket text not null,
  membership_level text not null,
  usage_date date not null,
  status text not null,
  reserved_at timestamptz not null default now(),
  completed_at timestamptz,
  refunded_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint usage_records_feature_type_check
    check (feature_type in ('daily-lot', 'tarot', 'dream', 'bazi')),
  constraint usage_records_quota_bucket_check
    check (quota_bucket in ('daily-lot', 'shared-reading')),
  constraint usage_records_status_check
    check (status in ('pending', 'completed', 'refunded'))
);

create index if not exists usage_records_user_status_idx
on public.usage_records (user_id, status);

create index if not exists usage_records_user_date_status_idx
on public.usage_records (user_id, usage_date, status);

create index if not exists usage_records_user_bucket_status_idx
on public.usage_records (user_id, quota_bucket, status);

alter table public.usage_records enable row level security;

drop policy if exists "Users can read own usage records" on public.usage_records;
create policy "Users can read own usage records"
on public.usage_records
for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.usage_records from anon;
revoke all on public.usage_records from authenticated;
grant select on public.usage_records to authenticated;

drop trigger if exists set_usage_records_updated_at on public.usage_records;
create trigger set_usage_records_updated_at
before update on public.usage_records
for each row
execute function public.set_updated_at();

create or replace function public.get_ai_usage_date()
returns date
language sql
stable
as $$
  select (timezone('Asia/Shanghai', now()))::date;
$$;

create or replace function public.get_ai_quota_bucket(input_feature_type text)
returns text
language sql
immutable
as $$
  select case
    when input_feature_type = 'daily-lot' then 'daily-lot'
    when input_feature_type in ('tarot', 'dream', 'bazi') then 'shared-reading'
    else null
  end;
$$;

create or replace function public.reserve_ai_reading_usage(input_feature_type text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_usage_date date := public.get_ai_usage_date();
  target_quota_bucket text := public.get_ai_quota_bucket(input_feature_type);
  profile_membership_level text;
  profile_remaining_credits integer := 0;
  effective_membership_level text := 'free';
  used_count integer;
  active_pending_count integer;
  reservation_id uuid;
begin
  if current_user_id is null then
    return jsonb_build_object(
      'success', false,
      'code', 'AUTH_REQUIRED',
      'message', '登录后才可以使用 AI 解读'
    );
  end if;

  if target_quota_bucket is null then
    return jsonb_build_object(
      'success', false,
      'code', 'INVALID_AI_READING_FEATURE',
      'message', 'AI 解读类型不正确'
    );
  end if;

  perform pg_advisory_xact_lock(hashtext(current_user_id::text));

  select membership_level, remaining_credits
  into profile_membership_level, profile_remaining_credits
  from public.profiles
  where id = current_user_id;

  if profile_membership_level in ('basic', 'plus') then
    effective_membership_level := profile_membership_level;
  end if;

  if effective_membership_level in ('basic', 'plus') then
    select count(*)
    into active_pending_count
    from public.usage_records
    where user_id = current_user_id
      and membership_level in ('basic', 'plus')
      and status = 'pending'
      and expires_at > now();

    if greatest(profile_remaining_credits - active_pending_count, 0) <= 0 then
      return jsonb_build_object(
        'success', false,
        'code', 'AI_USAGE_LIMIT_REACHED',
        'message', 'AI 解读次数已用完，请补充次数后继续使用',
        'limit', profile_remaining_credits,
        'used', active_pending_count,
        'remaining', 0
      );
    end if;
  else
    select count(*)
    into used_count
    from public.usage_records
    where user_id = current_user_id
      and quota_bucket = target_quota_bucket
      and status = 'completed';

    if used_count >= 1 then
      return jsonb_build_object(
        'success', false,
        'code', 'AI_USAGE_LIMIT_REACHED',
        'message', case
          when target_quota_bucket = 'daily-lot'
            then '每日灵签的免费 AI 解读机会已用完'
          else '塔罗、梦境解析、八字简析共享的免费 AI 解读机会已用完'
        end,
        'limit', 1,
        'used', used_count,
        'remaining', 0
      );
    end if;
  end if;

  insert into public.usage_records (
    user_id,
    feature_type,
    quota_bucket,
    membership_level,
    usage_date,
    status,
    expires_at
  )
  values (
    current_user_id,
    input_feature_type,
    target_quota_bucket,
    effective_membership_level,
    current_usage_date,
    'pending',
    now() + interval '20 minutes'
  )
  returning id into reservation_id;

  return jsonb_build_object(
    'success', true,
    'usageRecordId', reservation_id,
    'membershipLevel', effective_membership_level,
    'quotaBucket', target_quota_bucket
  );
end;
$$;

create or replace function public.complete_ai_reading_usage(input_usage_record_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_membership_level text;
begin
  if current_user_id is null then
    return jsonb_build_object('success', false, 'code', 'AUTH_REQUIRED');
  end if;

  perform pg_advisory_xact_lock(hashtext(current_user_id::text));

  select membership_level
  into target_membership_level
  from public.usage_records
  where id = input_usage_record_id
    and user_id = current_user_id
    and status = 'pending';

  if not found then
    return jsonb_build_object('success', false, 'code', 'AI_USAGE_RECORD_NOT_FOUND');
  end if;

  if target_membership_level in ('basic', 'plus') then
    update public.profiles
    set remaining_credits = remaining_credits - 1
    where id = current_user_id
      and remaining_credits > 0;

    if not found then
      return jsonb_build_object(
        'success', false,
        'code', 'AI_USAGE_CREDIT_NOT_ENOUGH'
      );
    end if;
  end if;

  update public.usage_records
  set status = 'completed',
      completed_at = now()
  where id = input_usage_record_id
    and user_id = current_user_id
    and status = 'pending';

  if not found then
    return jsonb_build_object('success', false, 'code', 'AI_USAGE_RECORD_NOT_FOUND');
  end if;

  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.refund_ai_reading_usage(input_usage_record_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return jsonb_build_object('success', false, 'code', 'AUTH_REQUIRED');
  end if;

  update public.usage_records
  set status = 'refunded',
      refunded_at = now()
  where id = input_usage_record_id
    and user_id = current_user_id
    and status = 'pending';

  if not found then
    return jsonb_build_object('success', false, 'code', 'AI_USAGE_RECORD_NOT_FOUND');
  end if;

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.reserve_ai_reading_usage(text) to authenticated;
grant execute on function public.complete_ai_reading_usage(uuid) to authenticated;
grant execute on function public.refund_ai_reading_usage(uuid) to authenticated;
