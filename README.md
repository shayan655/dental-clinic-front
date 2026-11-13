# Dental Clinic: Frontend

Public website and role-based portal for a single-location dental clinic, built with **Next.js** (App Router). It talks to the [Laravel API](https://github.com/shayan655/dental-clinic-backend) and uses cookie-based authentication, so no token is ever stored in the browser.

## Features

**Public site**: homepage, services, about, contact form, login and patient registration. The footer and contact page show the clinic details and opening hours that the manager maintains in Settings.

**Portal** (`/portal`), with content depending on the role:

| Page | Who uses it |
|---|---|
| Dashboard | Everyone, with a different view for manager and super admin, doctor, receptionist and patient |
| Appointments (list, detail, booking) | Everyone, scoped to their role. Booking shows only real free time slots |
| Patients (list, profile, new patient, "Create login") | Staff and doctors (doctors see only their own patients) |
| Medical records | Doctors (read and write their entries) and patients (read only) |
| Invoices | Staff (mark as paid, create) and patients (view their own) |
| Staff | Manager and super admin |
| Settings (clinic info, working hours, services) | Manager and super admin |
| Messages (contact form inbox, with unread badge) | Front desk and admins |
| Profile (details and password) | Everyone |

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · TanStack Query · Laravel Sanctum (cookie mode)

## How it is built

- **Server Components** handle role guards and data fetching. **Client Components** own forms and interactivity.
- **One API client** (`src/lib/api.ts`): sends cookies with every request, attaches the CSRF token, forwards the visitor's session when a Server Component calls the API, and turns Laravel errors into a typed `ApiError`.
- **Roles are checked twice**: pages redirect users who should not be there, and the API enforces the same rules. The API is the real protection.
- **Booking flow**: the form asks `/api/availability` (through TanStack Query) for the free slots of the chosen service, day and doctor, instead of letting people type a time that might be taken.

## Getting started

### Requirements

Node.js 22, npm, [Laravel Herd](https://herd.laravel.com), and the [backend](https://github.com/YOUR-NAME/dental-clinic-backend) running locally.

### Local domains

The cookie login only works when the frontend and the API share a root domain. Use `app.clinic.test` for the frontend (the API is `api.clinic.test`):

```bash
herd proxy app.clinic http://localhost:3000
```

Always open **http://app.clinic.test**, not `localhost:3000`. The cookie set by the API is not shared with `localhost`, so login cannot work there.

### Setup

```bash
git clone https://github.com/shayan655/dental-clinic-front.git
cd dental-clinic-front
npm install
```

Create `.env.development`:

```dotenv
NEXT_PUBLIC_API_URL=http://api.clinic.test
FRONTEND_URL=http://app.clinic.test
```

Then start the dev server:

```bash
npm run dev
```

Open http://app.clinic.test and log in with one of the demo accounts from the backend README (for example `manager@clinic.test` / `password`).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Address of the Laravel API. Baked in at build time, so rebuild after changing it |
| `FRONTEND_URL` | Public address of this app. The server-side API client sends it as the `Origin` header so Sanctum recognises the request as coming from the frontend |

Use `.env.development` for local values and `.env.production` for production values. Avoid `.env.local`: it overrides both.

## Folder structure

```
src/
  app/                  routes: public pages and /portal
  components/
    Home/               navbar, footer and homepage sections
    portal/             portal UI (dashboard, appointments, patients, invoices, ...)
    legal/              privacy policy and terms layout
  lib/
    api.ts              API client (cookies, CSRF, errors)
    auth.ts             current user and role helpers
    clinic.ts           public clinic info and opening hours
  types/                shared TypeScript types
```

## Continuous integration

GitHub Actions (`.github/workflows/checks.yml`) runs the type check, lint and a production build on every push.

## Author

Built by Shayan.