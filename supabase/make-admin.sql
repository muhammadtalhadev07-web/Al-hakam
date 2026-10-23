-- ============================================================
-- Make a user an ADMIN
--
-- 1. Create the account on the website first: /auth/signup
--    (confirm the email if Supabase asks you to).
-- 2. Put that email address below (line marked ✏️) and Run this in
--    Supabase Dashboard → SQL Editor.
-- 3. Sign out and sign in again on the website → the "Admin Panel"
--    link appears in your account menu, or open /admin directly.
--
-- Works even if the account has no profile row yet. Safe to re-run.
-- ============================================================

with target as (
  select id, lower(email) as email, raw_user_meta_data ->> 'full_name' as full_name
  from auth.users
  where lower(email) = lower('admin@alhakam.com')   -- ✏️ your admin email
)
insert into public.profiles (id, email, full_name, role)
select id, email, full_name, 'admin' from target
on conflict (id) do update set role = 'admin';

-- Check: your email should be listed with role = admin
select p.email, p.role, u.email_confirmed_at is not null as email_confirmed
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'admin';

-- ── Remove admin rights later ───────────────────────────────
-- update public.profiles set role = 'customer' where lower(email) = lower('someone@example.com');
