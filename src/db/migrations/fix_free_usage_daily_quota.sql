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
      and usage_date = current_usage_date
      and (
        status = 'completed'
        or (status = 'pending' and expires_at > now())
      );

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
