# Al Hakam Tours & Rent A Car

Luxury car-rental and tour website built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion** and **Supabase**.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: parallax hero, counters, featured fleet, services, pinned horizontal tours, scroll timeline, testimonials, FAQ, contact |
| `/cars` | Fleet browser: search, category tabs (`?category=SUV`), filters, sorting |
| `/cars/[id]` | Car details + booking panel + similar cars |
| `/tours`, `/tours/[slug]` | Tour packages and day-by-day itineraries |
| `/services` | Self-drive, chauffeur, weddings, airport, corporate, tours |
| `/about` | Story, values, milestones |
| `/contact` | Contact form + map |
| `/faq` | Grouped FAQ (with FAQPage structured data) |
| `/privacy`, `/terms` | Legal pages |
| `/auth/login`, `/auth/signup` | Accounts (Supabase) |
| `/dashboard` | Customer bookings |
| `/admin` | Admin panel: overview, cars CRUD, bookings, customers, messages |

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Supabase keys (optional)
npm run dev
```

### Demo mode vs. Supabase mode

* **No Supabase keys** → the site shows the dummy data in `src/data/*`; accounts and online booking are unavailable (visitors can still call / WhatsApp).
* **With Supabase keys** in `.env.local` → accounts, bookings, admin panel and contact messages are stored in your database.
  If the `cars` table is empty, the demo fleet is shown until you add cars.

## Database setup (Supabase → SQL Editor)

Run these files in order. All are safe to run again.

| File | What it does |
| --- | --- |
| `supabase/schema.sql` | Tables, constraints, indexes, triggers and Row Level Security. Also upgrades an older database without losing data. |
| `supabase/seed.sql` | *(optional)* Adds the 18 sample cars — only if the `cars` table is empty. |
| `supabase/make-admin.sql` | Gives one account admin rights. |

What the database enforces (not just the website):

* Every new sign-up automatically gets a `profiles` row (role `customer`).
* Customers can't make themselves admin — only an admin or the SQL Editor can change roles.
* Only signed-in users can book. The database sets the booking price, status (`pending`) and owner itself, so a tampered request can't change them.
* Unavailable cars can't be booked, and pick-up dates can't be in the past.
* The same car can't have two **confirmed** bookings on overlapping dates.
* Visitors can only see their own bookings; contact messages are visible to admins only.

## Admin login

1. Go to `/auth/signup` on the website and create an account with the admin's email (confirm the email if Supabase sends a link).
2. Open `supabase/make-admin.sql`, replace `you@example.com` with that email, and run it in the Supabase SQL Editor.
   The last query should list the email with `role = admin`.
3. On the website, **sign out and sign in again**. Open the account menu (top right) → **Admin Panel**, or go to `/admin`.

The admin panel has: Overview (revenue, fleet status), Car Management (add / edit / hide / delete cars),
Bookings (confirm, cancel, complete), Customers and Messages.

> If `/admin` sends you back to the home page, the account is not an admin yet — re-check step 2.
> Never put the `SUPABASE_SERVICE_ROLE_KEY` in any `NEXT_PUBLIC_` variable; the website doesn't need it.

## Where to edit content

* Phone numbers, email, address, social links → `src/lib/site.ts`
* Demo cars → `src/data/cars.ts` · Tours → `src/data/tours.ts`
* Services, testimonials, FAQs, stats → `src/data/content.ts`

> The testimonials, review counts and ratings in `src/data` are **sample content**. Replace them with real customer reviews before going live.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run lint    # ESLint
```
