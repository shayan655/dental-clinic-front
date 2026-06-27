# Dental Clinic Management System — Project Spec (v1)

> Reference document. Keep this in the repo root and update it as decisions evolve.

## 1. Overview

A single-location dental clinic system with a public marketing site and a role-based
authenticated portal. Frontend is decoupled from the backend.

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js 14+ (App Router) | This repo |
| Language | TypeScript | Type-safe API contracts with Laravel |
| Styling | Tailwind CSS | Design system added later via a design file |
| Server data fetching | React Server Components | Initial page loads, SSR/SEO for public site |
| Client data fetching | TanStack Query (React Query) | Interactive/dashboard data, caching, mutations |
| Backend | Laravel (separate repo) | REST API |
| Auth | Laravel Sanctum — **SPA (cookie) mode** | See §4 |
| Hosting domains | `clinic.com` (Next.js), `api.clinic.com` (Laravel) | Same root domain — required for Sanctum SPA mode |

## 3. Roles

1. **Super Admin** — system-level, manages the platform itself (above clinic operations)
2. **Clinic Manager** — runs daily clinic operations
3. **Doctor** — clinical work, own schedule, patient medical records
4. **Receptionist** — front desk, booking, check-in, billing handling
5. **Patient** — booking, viewing own records/history

Single clinic, single location — no multi-tenancy needed in the data model.

## 4. Auth Strategy

**Sanctum SPA mode (cookie-based)**, because `clinic.com` and `api.clinic.com` share a root domain.

How it works:
- Laravel issues an `httpOnly` session cookie — never readable by JS (XSS-resistant)
- Browser auto-attaches the cookie to requests to `api.clinic.com`
- CSRF handled via Laravel's `/sanctum/csrf-cookie` endpoint, fetched once before login
- No manual token storage/refresh logic needed in Next.js

**Important constraint:** local dev must mirror this domain relationship — e.g.
`clinic.test` + `api.clinic.test` via Laravel Herd/Valet or `/etc/hosts`, NOT
`localhost:3000` + `localhost:8000` (different-port cookies behave inconsistently
cross-origin). We'll set this up explicitly in the environment step.

**Login flow:** single login form, no role selector. Role is read from the
authenticated user record returned by Laravel, and the frontend redirects to
`/portal` with role-aware content from there.

## 5. Permissions Matrix

| Capability | Super Admin | Manager | Doctor | Receptionist | Patient |
|---|---|---|---|---|---|
| Manage staff accounts | ✅ | ✅ | ❌ | ❌ | ❌ |
| Clinic settings (hours, services, pricing) | ✅ | ✅ | ❌ | ❌ | ❌ |
| View/manage ALL appointments | ✅ | ✅ | own only | book/view for patients | own only |
| Register patient profiles | — | ✅ | ❌ | ✅ | self (signup) |
| Patient medical/treatment records | — | ❌ (scheduling data only) | ✅ read/write | ❌ | own, read-only |
| Prescriptions/diagnoses | — | ❌ | ✅ write | ❌ | own, read-only |
| Billing/invoicing | — | ✅ oversight | ❌ | ✅ handle | own, view-only |
| Doctor availability | — | view | ✅ own | view-only | view (to book) |

**Critical boundary:** Medical/clinical data (records, diagnoses, prescriptions) is
strictly doctor↔patient. Manager and Receptionist only ever see scheduling-relevant
data (name, contact, appointment slot) — never clinical details. This must be
enforced in Laravel policies AND mirrored in the Next.js UI (don't even render or
fetch routes a role shouldn't see).

## 6. Business Rules

- No multi-clinic/branch support — single location permanently
- Doctors are interchangeable — no per-doctor specialty/service matching for booking
  (booking finds "any available doctor" for a service/time slot)
- No online payments in v1 — invoices are record-keeping/display only, payment happens in person
- Patients can EITHER self-register OR be created by staff (receptionist/manager) —
  matching logic for "claiming" a staff-created profile is a backend concern
- New (unregistered) visitors cannot book — must register/login first
- No messaging/notifications system in v1 (deferred to a later phase)

## 7. Site Map

### Public (unauthenticated)
```
/                    Homepage
/services            Services list
/about               About the clinic
/contact             Contact form
/login               Single login form (role auto-detected)
/register            Patient self-registration
```

### Authenticated Portal — `/portal` (shared shell, role-aware content)
```
/portal                          Dashboard (content varies by role)
/portal/appointments              List/calendar (scope varies by role)
/portal/appointments/new          Book appointment
/portal/appointments/[id]         Appointment detail
/portal/patients                  Patient directory (manager/receptionist/doctor)
/portal/patients/[id]             Patient profile (scheduling info only)
/portal/patients/[id]/records     Medical records (doctor r/w, patient read-own)
/portal/staff                     Staff management (manager/super-admin only)
/portal/settings                  Clinic settings (manager/super-admin only)
/portal/invoices                  Billing records (view only, no online pay)
/portal/profile                   Own account settings (all roles)
```

## 8. Patient Dashboard Priority

Full dashboard with stats: upcoming appointment(s), recent treatment summary —
not just a bare list.

## 9. Open / Deferred Items

- Design system / branding — pending a design file from the user
- Messaging & notifications — phase 2
- Online payments — phase 2 (if ever)
- Profile-claiming flow when a self-registering patient matches an existing
  staff-created record — backend (Laravel) responsibility, needs a decision later

## 10. Build Workflow

Step-by-step, user-driven: Claude explains what to do and why; the user runs the
commands and writes the code; results are reviewed together before moving to the
next step. Goal is understanding, not just a working app.
