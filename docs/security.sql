-- Run after database.sql. Row-level security for public users and coordinators.
alter table locations enable row level security;
alter table alerts enable row level security;
alter table alert_responses enable row level security;
alter table community_reports enable row level security;
alter table delivery_events enable row level security;
create table if not exists coordinator_profiles(user_id uuid primary key references auth.users(id) on delete cascade,display_name text not null,role text not null check(role in('coordinator','reviewer','administrator')),created_at timestamptz not null default now());
alter table coordinator_profiles enable row level security;
create or replace function public.is_coordinator() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from coordinator_profiles where user_id=auth.uid())$$;
create policy "public reads locations" on locations for select using(true);
create policy "public reads active alerts" on alerts for select using(published_at is not null and published_at<=now() and expires_at>now());
create policy "coordinators read all alerts" on alerts for select to authenticated using(is_coordinator());
create policy "coordinators create drafts" on alerts for insert to authenticated with check(is_coordinator() and published_at is null);
create policy "coordinators update alerts" on alerts for update to authenticated using(is_coordinator()) with check(is_coordinator());
create policy "public submits response" on alert_responses for insert to anon,authenticated with check(length(anonymous_device_id) between 10 and 120);
create policy "coordinators read responses" on alert_responses for select to authenticated using(is_coordinator());
create policy "public submits pending report" on community_reports for insert to anon,authenticated with check(state='pending' and length(description) between 10 and 1000);
create policy "coordinators read reports" on community_reports for select to authenticated using(is_coordinator());
create policy "coordinators moderate reports" on community_reports for update to authenticated using(is_coordinator()) with check(is_coordinator());
create policy "coordinators read delivery" on delivery_events for select to authenticated using(is_coordinator());
create policy "user reads own profile" on coordinator_profiles for select to authenticated using(user_id=auth.uid());
-- After creating a user in Supabase Authentication:
-- insert into coordinator_profiles(user_id,display_name,role) values('USER_UUID','Maryama Ruun','administrator');
