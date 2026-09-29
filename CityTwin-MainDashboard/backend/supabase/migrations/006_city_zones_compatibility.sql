-- Upgrade a pre-existing city_zones table so it can store the generated GeoJSON layer.
alter table public.city_zones add column if not exists slug text;
alter table public.city_zones add column if not exists boundary_geojson jsonb;
alter table public.city_zones add column if not exists center_latitude double precision;
alter table public.city_zones add column if not exists center_longitude double precision;
alter table public.city_zones add column if not exists boundary_quality text not null default 'approximate';
alter table public.city_zones add column if not exists is_active boolean not null default true;
alter table public.city_zones add column if not exists created_at timestamptz not null default now();
alter table public.city_zones add column if not exists updated_at timestamptz not null default now();

create unique index if not exists city_zones_slug_uidx on public.city_zones (slug);
notify pgrst, 'reload schema';
