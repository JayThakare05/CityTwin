-- GeoJSON is stored directly so the map can render zone boundaries without a GIS extension.
create table if not exists public.city_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  boundary_geojson jsonb not null,
  center_latitude double precision not null,
  center_longitude double precision not null,
  boundary_quality text not null default 'approximate' check (boundary_quality in ('approximate', 'verified')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.zone_environment_readings (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.city_zones(id) on delete cascade,
  aqi integer check (aqi between 0 and 500),
  pm25 numeric,
  rainfall_mm numeric not null default 0 check (rainfall_mm >= 0),
  source text not null default 'openweather',
  recorded_at timestamptz not null default now()
);

create index if not exists zone_environment_readings_zone_recorded_at_idx
  on public.zone_environment_readings (zone_id, recorded_at desc);

-- Existing citizen reports can now be associated with public.city_zones via reports.zone_id.
