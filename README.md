# DentalHub

A learning platform for dental students: courses, clinical case library, X-ray trainer,
study tools, progress tracking, and a daily challenge. Built with Next.js and Supabase.

The app lives in [`DentalHub 4/dentalhub-next`](<DentalHub 4/dentalhub-next>). All commands
below run from that folder.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) with React 19 and TypeScript
- [Supabase](https://supabase.com) for authentication and the database
- Plain CSS in `app/globals.css`

## Prerequisites

- Node.js 20.9 or newer and npm
- A free [Supabase](https://supabase.com) project

## 1. Install

```bash
cd "DentalHub 4/dentalhub-next"
npm install
```

## 2. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard, **Connect** button. Looks like `https://<project-id>.supabase.co` (no trailing path) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings, **API Keys**, the **publishable** key (`sb_publishable_...`) |

> **Never** put a secret key (`sb_secret_...`) in a `NEXT_PUBLIC_` variable. Those values are
> bundled into the browser. The app refuses to start Supabase with a secret key.
> `.env.local` is gitignored; do not commit it.

Restart the dev server after changing `.env.local`.

## 3. Set up Supabase

1. **Create the profiles table.** In the dashboard open **SQL Editor, New query**, paste the
   contents of [`supabase/schema.sql`](<DentalHub 4/dentalhub-next/supabase/schema.sql>) and
   run it. It creates a `profiles` table with row level security and a trigger that adds a
   profile row on sign-up.
2. **Allow redirect URLs.** Under **Authentication, URL Configuration**, add:
   - `http://localhost:3000/reset-password`
   - your production URL plus `/reset-password` when you deploy
3. **Match the password rules.** Under **Authentication, Providers, Email**, set the minimum
   length to 8 and require lowercase, uppercase, digits and symbols. The sign-up form checks
   the same rules (see `lib/auth.ts`), so keep the two in sync.
4. **Email delivery.** Supabase's built-in sender allows only a few emails per hour. For real
   use, add your own SMTP provider under **Authentication, Emails, SMTP Settings**. While
   developing you can turn off **Confirm email** to avoid sending confirmation emails.
5. **Reset link lifetime.** The **Email OTP expiration** setting controls how long a
   password-reset link works. 3600 seconds is a comfortable value.

## 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>. Signed-out visitors are redirected to `/login`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Auth flow

| Route | Purpose |
|---|---|
| `/login` | Sign in with email and password |
| `/signup` | Create an account (full name, email, password) |
| `/forgot-password` | Request a password-reset email |
| `/reset-password` | Choose a new password (reached from the email link) |

Every page under the dashboard is protected: signed-out users are sent to `/login`.
Validation errors appear inline under each field, and new-password fields show a live
checklist of the password rules.

## Project structure

```
app/
  (app)/            signed-in pages: dashboard, my-learning, case-library,
                    x-ray-trainer, ai-study-tools, my-progress, bookmarks,
                    study-notes, daily-challenge, settings
  login/ signup/ forgot-password/ reset-password/
components/         shared UI (AuthShell, AuthFields, DashboardShell, ...)
lib/
  auth.ts           Supabase auth actions and validation
  supabase.ts       Supabase client
  useAuth.ts        session hook
  storage.ts        localStorage-backed state for progress, notes, bookmarks
  data/             case, course and quiz content
supabase/schema.sql database schema
```

## Branches

- `saad`: frontend work
- `hamdan`: backend and auth work, built on top of `saad`
- `main`: integrated, stable code

## Notes

- Progress, bookmarks, notes and settings are currently stored in the browser
  (`localStorage`), not in Supabase.
- The project is easier to work on when it is **not** inside a OneDrive-synced folder;
  syncing `node_modules` slows installs and the dev server.
