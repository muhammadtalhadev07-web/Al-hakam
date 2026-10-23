-- ============================================================
-- Al Hakam Tours & Rent A Car — Supabase database schema
--
-- How to run:  Supabase Dashboard → SQL Editor → New query → paste → Run
-- Idempotent:  safe to run again at any time. It also upgrades an older
--              database (adds missing columns, constraints and policies)
--              without deleting data.
-- Order:       1) schema.sql   2) seed.sql (optional)   3) make-admin.sql
-- ============================================================

-- ── 0. Extensions ───────────────────────────────────────────
-- btree_gist lets us stop double-bookings with an exclusion constraint.
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;


-- ── 1. Tables ───────────────────────────────────────────────

-- 1a. profiles: one row per auth user (created automatically by trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade
);
alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists role       text        not null default 'customer';
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists phone      text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- 1b. cars: the fleet
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid()
);
alter table public.cars add column if not exists name                 text;
alter table public.cars add column if not exists category             text        not null default 'Sedan';
alter table public.cars add column if not exists price_per_day        integer     not null default 0;
alter table public.cars add column if not exists image_url            text        not null default '';
alter table public.cars add column if not exists seats                integer     not null default 5;
alter table public.cars add column if not exists transmission         text        not null default 'Automatic';
alter table public.cars add column if not exists features             text[]      not null default '{}';
alter table public.cars add column if not exists is_available         boolean     not null default true;
alter table public.cars add column if not exists description          text;
alter table public.cars add column if not exists brand                text;
alter table public.cars add column if not exists year                 integer;
alter table public.cars add column if not exists fuel                 text;
alter table public.cars add column if not exists luggage              integer;
alter table public.cars add column if not exists rating               numeric(2, 1);
alter table public.cars add column if not exists reviews              integer;
alter table public.cars add column if not exists driver_price_per_day integer;
alter table public.cars add column if not exists created_at           timestamptz not null default now();
alter table public.cars add column if not exists updated_at           timestamptz not null default now();

-- 1c. bookings: rental requests (always tied to a signed-in user)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid()
);
alter table public.bookings add column if not exists car_id        uuid;
alter table public.bookings add column if not exists user_id       uuid;
alter table public.bookings add column if not exists start_date    date;
alter table public.bookings add column if not exists end_date      date;
alter table public.bookings add column if not exists total_amount  integer     not null default 0;
alter table public.bookings add column if not exists status        text        not null default 'pending';
alter table public.bookings add column if not exists customer_name text;
alter table public.bookings add column if not exists phone         text;
alter table public.bookings add column if not exists email         text;
alter table public.bookings add column if not exists notes         text;
alter table public.bookings add column if not exists created_at    timestamptz not null default now();
alter table public.bookings add column if not exists updated_at    timestamptz not null default now();

-- 1d. contact_messages: website contact-form enquiries
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid()
);
alter table public.contact_messages add column if not exists name       text;
alter table public.contact_messages add column if not exists phone      text;
alter table public.contact_messages add column if not exists email      text;
alter table public.contact_messages add column if not exists subject    text;
alter table public.contact_messages add column if not exists message    text;
alter table public.contact_messages add column if not exists created_at timestamptz not null default now();


-- ── 2. Constraints (added only if missing) ──────────────────
-- NOT VALID = enforced for new/updated rows without failing on old data.
do $$
declare
  c record;
begin
  for c in
    select * from (values
      ('profiles', 'profiles_role_check',          $c$check (role in ('admin', 'customer'))$c$),
      ('cars',     'cars_category_check',          $c$check (category in ('SUV', 'Sedan', 'Luxury', 'Van'))$c$),
      ('cars',     'cars_transmission_check',      $c$check (transmission in ('Automatic', 'Manual'))$c$),
      ('cars',     'cars_price_positive',          $c$check (price_per_day > 0)$c$),
      ('cars',     'cars_seats_range',             $c$check (seats between 1 and 60)$c$),
      ('cars',     'cars_name_required',           $c$check (name is not null and length(trim(name)) > 0)$c$),
      ('bookings', 'bookings_status_check',        $c$check (status in ('pending', 'confirmed', 'completed', 'cancelled'))$c$),
      ('bookings', 'bookings_dates_check',         $c$check (end_date > start_date)$c$),
      ('bookings', 'bookings_required_fields',     $c$check (car_id is not null and start_date is not null and end_date is not null and customer_name is not null and phone is not null)$c$),
      ('bookings', 'bookings_total_non_negative',  $c$check (total_amount >= 0)$c$),
      ('bookings', 'bookings_car_fk',              $c$foreign key (car_id) references public.cars (id) on delete restrict$c$),
      ('bookings', 'bookings_user_fk',             $c$foreign key (user_id) references auth.users (id) on delete set null$c$),
      ('contact_messages', 'contact_messages_required', $c$check (name is not null and phone is not null and message is not null)$c$),
      ('contact_messages', 'contact_messages_length',   $c$check (char_length(message) <= 2000)$c$)
    ) as t(tbl, name, def)
  loop
    -- skip if the same constraint exists, or (for FKs) any FK already covers the column
    if not exists (select 1 from pg_constraint where conname = c.name and conrelid = ('public.' || c.tbl)::regclass)
       and not (c.def like 'foreign key%' and exists (
         select 1 from pg_constraint pc
         join pg_attribute a on a.attrelid = pc.conrelid and a.attnum = any (pc.conkey)
         where pc.conrelid = ('public.' || c.tbl)::regclass and pc.contype = 'f'
           and a.attname = substring(c.def from 'foreign key \((\w+)\)')
       )) then
      execute format('alter table public.%I add constraint %I %s not valid', c.tbl, c.name, c.def);
    end if;
  end loop;
end $$;

-- No double-booking: two CONFIRMED bookings of the same car can't overlap.
-- (Pending requests may overlap — the admin decides which one to confirm.)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'bookings_no_overlap') then
    begin
      alter table public.bookings
        add constraint bookings_no_overlap
        exclude using gist (car_id with =, daterange(start_date, end_date, '[)') with &&)
        where (status = 'confirmed');
    exception when others then
      raise notice 'bookings_no_overlap not added (existing confirmed bookings overlap): %', sqlerrm;
    end;
  end if;
end $$;


-- ── 3. Indexes ──────────────────────────────────────────────
create index if not exists bookings_user_idx       on public.bookings (user_id);
create index if not exists bookings_car_idx        on public.bookings (car_id);
create index if not exists bookings_status_idx     on public.bookings (status);
create index if not exists bookings_created_idx    on public.bookings (created_at desc);
create index if not exists cars_available_idx      on public.cars (is_available);
create index if not exists profiles_email_idx      on public.profiles (lower(email));
create index if not exists contact_created_idx     on public.contact_messages (created_at desc);


-- ── 4. Functions & triggers ─────────────────────────────────

-- 4a. Is the current request made by an admin?
-- SECURITY DEFINER so RLS policies can call it without recursion.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- 4b. Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists cars_updated_at on public.cars;
create trigger cars_updated_at before update on public.cars
  for each row execute function public.set_updated_at();
drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- 4c. Create a profile automatically for every new sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    lower(new.email),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: users who signed up before this trigger existed get a profile too
insert into public.profiles (id, email, full_name, phone)
select u.id, lower(u.email), u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'phone'
from auth.users u
on conflict (id) do nothing;

-- 4d. Nobody can make themselves admin from the website/API.
-- Only an existing admin, or you in the SQL Editor (no JWT), can change roles.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only an admin can change user roles' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role before update on public.profiles
  for each row execute function public.guard_profile_role();

-- 4e. Bookings from customers: the database sets price & status itself,
-- so a tampered request can't book for Rs 1 or self-confirm.
create or replace function public.prepare_customer_booking()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_price integer;
  v_available boolean;
begin
  if public.is_admin() or (select auth.uid()) is null then
    return new; -- admins / SQL editor may insert anything
  end if;

  select price_per_day, is_available into v_price, v_available
  from public.cars where id = new.car_id;

  if v_price is null then
    raise exception 'Car not found' using errcode = '23503';
  end if;
  if not v_available then
    raise exception 'This car is not available for booking' using errcode = '23514';
  end if;
  if new.start_date < current_date then
    raise exception 'Pick-up date cannot be in the past' using errcode = '23514';
  end if;

  new.user_id      := (select auth.uid());
  new.status       := 'pending';
  new.total_amount := v_price * (new.end_date - new.start_date);
  return new;
end;
$$;

drop trigger if exists bookings_prepare on public.bookings;
create trigger bookings_prepare before insert on public.bookings
  for each row execute function public.prepare_customer_booking();


-- ── 5. Row Level Security ───────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.cars             enable row level security;
alter table public.bookings         enable row level security;
alter table public.contact_messages enable row level security;

-- profiles
drop policy if exists "profiles: read own or admin"     on public.profiles;
drop policy if exists "profiles: insert own"            on public.profiles;
drop policy if exists "profiles: update own (not role)" on public.profiles;
drop policy if exists "profiles: update own"            on public.profiles;
drop policy if exists "profiles: admin all"             on public.profiles;

create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());
create policy "profiles: insert own" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()) and role = 'customer');
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));          -- role changes blocked by trigger 4d
create policy "profiles: admin all" on public.profiles
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- cars: everyone can browse, only admins manage
drop policy if exists "cars: public read" on public.cars;
drop policy if exists "cars: admin write" on public.cars;
create policy "cars: public read" on public.cars
  for select to anon, authenticated using (true);
create policy "cars: admin write" on public.cars
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- bookings: signed-in users create & read their own; admins manage all
drop policy if exists "bookings: create pending" on public.bookings;
drop policy if exists "bookings: create own"     on public.bookings;
drop policy if exists "bookings: read own"       on public.bookings;
drop policy if exists "bookings: admin insert"   on public.bookings;
drop policy if exists "bookings: admin manage"   on public.bookings;
drop policy if exists "bookings: admin delete"   on public.bookings;
create policy "bookings: create own" on public.bookings
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');
create policy "bookings: read own" on public.bookings
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
create policy "bookings: admin insert" on public.bookings      -- phone/walk-in bookings
  for insert to authenticated
  with check (public.is_admin());
create policy "bookings: admin manage" on public.bookings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "bookings: admin delete" on public.bookings
  for delete to authenticated
  using (public.is_admin());

-- contact messages: anyone can send, only admins read / delete
drop policy if exists "messages: anyone insert" on public.contact_messages;
drop policy if exists "messages: admin read"    on public.contact_messages;
drop policy if exists "messages: admin delete"  on public.contact_messages;
create policy "messages: anyone insert" on public.contact_messages
  for insert to anon, authenticated with check (true);
create policy "messages: admin read" on public.contact_messages
  for select to authenticated using (public.is_admin());
create policy "messages: admin delete" on public.contact_messages
  for delete to authenticated using (public.is_admin());


-- ── 6. Function permissions ─────────────────────────────────
-- Trigger functions must not be callable through the API.
revoke execute on function public.handle_new_user()          from public, anon, authenticated;
revoke execute on function public.guard_profile_role()       from public, anon, authenticated;
revoke execute on function public.prepare_customer_booking() from public, anon, authenticated;
grant  execute on function public.is_admin()                 to anon, authenticated;

-- Done. Next: seed.sql (optional sample fleet), then make-admin.sql.
