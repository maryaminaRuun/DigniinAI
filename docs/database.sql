-- DigniinAI production-ready PostgreSQL/Supabase data model
create type alert_severity as enum ('monitor','watch','high','extreme');
create type response_status as enum ('received','acting','need_help');
create type report_state as enum ('pending','verified','rejected');

create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  district text not null,
  region text not null,
  country_code char(2) not null default 'SO',
  latitude double precision not null,
  longitude double precision not null
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references locations(id),
  hazard_type text not null,
  severity alert_severity not null,
  title_en text not null,
  title_so text not null,
  message_en text not null,
  message_so text not null,
  source_name text not null,
  source_url text,
  source_timestamp timestamptz,
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  approved_by uuid,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table alert_responses (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references alerts(id),
  anonymous_device_id text not null,
  status response_status not null,
  location_id uuid references locations(id),
  created_at timestamptz not null default now(),
  unique(alert_id, anonymous_device_id)
);

create table community_reports (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid references alerts(id),
  location_id uuid references locations(id),
  category text not null,
  description text not null,
  latitude double precision,
  longitude double precision,
  state report_state not null default 'pending',
  verified_by uuid,
  created_at timestamptz not null default now()
);

create table delivery_events (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references alerts(id),
  channel text not null check(channel in ('pwa','sms','voice')),
  recipient_hash text not null,
  delivered_at timestamptz,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

create index alerts_location_active_idx on alerts(location_id, expires_at);
create index reports_state_created_idx on community_reports(state, created_at desc);
create index responses_alert_status_idx on alert_responses(alert_id, status);
