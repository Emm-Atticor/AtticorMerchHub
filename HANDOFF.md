# Atticor Merch Hub — Build Handoff

Paste everything below the line into Claude Code, v0, or Cursor as the opening
prompt. It assumes the agent has this repository checked out.

---

## What you're building

An internal web app for **Atticor Group**, a marketing company that runs
branded-merch programs for a portfolio of personal-injury law firms. Today the
work happens over email and spreadsheets. This app replaces that with one
approved catalog, one approval trail, and one place to see what's been ordered
against which budget.

Five kinds of people use it:

| Role | Person | What they do |
| --- | --- | --- |
| Admin | Hazel | Sees every brand. First approval signature. Marks orders invoiced. |
| Brand Manager | Jordan Moreno (Lerner & Rowe), Victoria Tuttle (Keches Law Group) | Requests merch for **their brand only**. Second approval signature. Watches their budget. |
| Creative | Jon | Works the design/proof queue across brands. Uploads artwork, moves items out of `In Design`. |
| Event Manager | — | Owns the event calendar. Turns an event's suggested kit into draft orders. |
| Vendor | Jenny (SwagMyBrand) | Sees incoming approved orders, updates sourcing status and on-hand stock, moves orders through production and shipping. |

## Current state of this repo

A working **prototype**, not production code:

- `components/AtticorMerchHub.jsx` — the entire app in one client component
  (~1,050 lines). All state is React `useState`; all data is hardcoded seed
  arrays near the top of the file (`BRANDS`, `CATALOG`, `seedOrders`,
  `seedEvents`, `seedStock`, `BRAND_ASSETS`).
- `app/page.jsx`, `app/layout.jsx`, `app/globals.css` — Next.js App Router shell.
- `public/merch/*.jpg` — five real Lerner & Rowe merch photos used by the Brand Hub.
- `prisma/schema.prisma` — the **proposed** production data model. Not migrated yet.
- `.env.example` — every environment variable the production build needs.

`npm install && npm run dev` runs it as-is. `npm run build` passes.

The prototype is the spec for layout, copy, and flow. Read it before writing
anything. Treat its visual language as settled and its data layer as disposable.

## Stack

Keep what's here; add only what's listed.

- Next.js 14 App Router, JavaScript (not TypeScript — the prototype is JS; don't
  convert it as a side quest), React 18
- Tailwind CSS 3 for layout utilities. The prototype also uses inline `style`
  objects driven by a `C` color constant; that's fine, leave it.
- `lucide-react` for icons
- **Auth:** Auth.js (NextAuth v5) with Google Workspace SSO as the primary
  provider, plus email/password for vendors who aren't on Workspace
- **Database:** Vercel Postgres (Neon) via Prisma
- **File storage:** Vercel Blob for brand guidelines and merch photos
- Deploy target: Vercel. No Docker, no separate backend service.

## Rules of engagement

These are not stylistic preferences. Violating them produces a tool that lies to
its users.

1. **Never invent brand data.** Lerner & Rowe and Keches Law Group have no
   verified palette or type system in hand yet. The prototype deliberately shows
   empty states with an upload slot for those. Keep it that way. Do not generate
   plausible hex values.
2. **Preserve `detailsTbd` flags.** One seeded event (`L&R Community
   Activation`, 2026-09-09) has no confirmed name, market, or quantities. It
   renders with a visible "needs detail" flag. Unconfirmed records must stay
   visibly unconfirmed rather than being quietly filled in.
3. **STK Bureau Serif and STK Miso are licensed foundry fonts**, not free web
   fonts. The app intentionally falls back to a system serif/sans. Do not
   substitute a Google Font that "looks close." `app/globals.css` has the
   commented `@font-face` block for when the licensed files arrive.
4. **A brand can have more than one vendor.** Lerner & Rowe already sources
   through On Target Media (hats, shirts, giveaway swag — a two-tier setup of
   nicer staff items versus roughly $3 "walking billboard" giveaways) and
   BoomPromo (closing gifts, influencer gifts, apparel decks). The prototype
   assumes everything routes to SwagMyBrand. The schema fixes this with
   `Vendor` + `BrandVendor`. Build to the schema.
5. **Brand Managers must never see another brand's data.** Enforce this
   server-side in every query, not by hiding UI. The prototype fakes it with a
   name switcher in the header; that switcher is a demo affordance and should be
   deleted once real sessions exist.
6. **Money is integer cents** in the database. The prototype uses floats.

## Order lifecycle

```
Requested → In Design → Awaiting Approval → Approved → Ordered → In Production → Shipped → Received
└──────────── pipeline (soft) ────────────┘ └──────────── committed spend ────────────┘
```

- `Requested…Approved` count as **pipeline**; `Ordered…Received` count as
  **committed**. Remaining budget = pool − committed − pipeline.
- `Awaiting Approval` → `Approved` requires **two signatures**: Admin and the
  owning Brand Manager. Either can go first. The transition is automatic once
  both exist.
- Creative moves `Requested` → `In Design` → `Awaiting Approval`.
- Vendor moves `Approved` → `Ordered` → `In Production` → `Shipped` → `Received`.
- Admin can toggle `invoiced` independently of status.
- Every transition writes a `StatusEvent` row. No silent status changes.

## Budgets and funding sources

This is the one structural addition the prototype doesn't have, and it matters.

The Lerner & Rowe events data draws a hard line between **L&R** (firm-paid) and
**LRGB** (foundation-funded), and further splits LRGB from **LRIA** (organization
versus individual donations). Firm dollars and 501(c)(3) dollars are not
interchangeable, so a single budget per brand is wrong.

Model it as `Fund` records under a `Brand` (see `prisma/schema.prisma`). Every
order and every event points at exactly one fund. Budget meters roll up per fund
**and** per brand. A Brand Manager requesting merch has to pick a fund; if the
brand has only one, pick it silently.

## Screens to build

Each of these exists in the prototype. Port the layout; replace the data source.

**Admin (Hazel)** — tabs: Overview, All Orders, Budgets, Catalog, Brand Hub, Approvals
- Overview: portfolio totals, per-brand budget meters, upcoming events, items needing attention
- All Orders: sortable table, inline status advance, invoiced toggle
- Budgets: per-brand (and now per-fund) pool / pipeline / committed / invoiced / remaining
- Approvals: queue of `Awaiting Approval` items missing the admin signature, with a badge count

**Brand Manager** — their brand only: budget meter, request builder (catalog picker
with quantities, optional event attachment), their order list, their approval queue

**Creative (Jon)** — the design queue: items in `Requested` / `In Design`,
artwork upload, advance to `Awaiting Approval`, plus Brand Hub access

**Event Manager** — calendar of upcoming events with brand, funding type, market,
date, headcount, and a suggested kit; one action converts the kit into draft
orders tagged to that event

**Vendor (Jenny)** — incoming approved orders, an aggregated demand view by
catalog item, editable on-hand and sourcing status per item, fulfillment status
advance, plus Brand Hub access

**Brand Hub** (shared by Admin, Creative, Vendor; scope to one brand for Brand
Managers) — per brand: guidelines and links, palette and type, past merch and
current stock with photos, vendor idea decks. Uploads go to Vercel Blob.

**Login** — email/password plus SSO. Delete the "DEMO · continue as" role
shortcuts once real auth works.

## Design tokens

Already encoded in `tailwind.config.js` and the `C` object in the component.

| Token | Hex | Role |
| --- | --- | --- |
| Dark Green | `#081D01` | Text |
| Mid Green | `#013828` | Primary, top bar, buttons |
| Light Green | `#D0D9BA` | Secondary text on dark, borders |
| Off White | `#F8FAF2` | Page background |
| Green tint | `#E4EAD3` | Warm surface bands |
| Apricot | `#FFA967` | Accent, active states |

Signature: a `linear-gradient(90deg, #4DFFFF, #CFFCCC, #FFA967)` strip — used on
the logo tile and as a 3px rule under the top bar. Use it sparingly; it's the one
loud element.

Type: STK Bureau Serif for headings, STK Miso for body (both currently falling
back). Headings are set at a light letter-spacing of `0.02em`.

## Build order

Ship each phase to Vercel before starting the next.

1. **Auth + schema.** Auth.js with Google SSO, Prisma migration, seed script that
   loads the prototype's existing data (brands, funds, catalog, the eight events,
   stock, brand assets) into Postgres. Real session gating replaces the `authed`
   boolean. Delete the role switcher and the BM name switcher.
2. **Reads.** Split the monolith into route segments (`app/(app)/orders`,
   `/budgets`, `/events`, `/brand-hub`, etc.) as server components that query
   Prisma. Keep interactive bits as client components. Every query filters by the
   session user's role and brand memberships.
3. **Writes.** Server actions for: create request, advance status, sign approval,
   toggle invoiced, edit stock, convert event kit to orders. Each write checks
   permission server-side and appends a `StatusEvent`.
4. **Uploads.** Vercel Blob for guidelines and merch photos, with `merchState`
   tagging (In stock / Archived / In production). Move `public/merch/*.jpg` into
   Blob as part of the seed.
5. **Notifications.** Email on: request submitted, approval needed, order
   shipped. Resend, digest-style rather than per-event, so Hazel isn't buried.

## Open decisions — ask before assuming

Do not resolve these by picking something reasonable. They need a human answer:

1. Does Lerner & Rowe get two ledgers (L&R firm + LRGB foundation), and does LRIA
   need a third? The schema supports it; the policy call hasn't been made.
2. Does the hub consolidate L&R sourcing under SwagMyBrand, or track On Target
   Media and BoomPromo as parallel vendors with their own order queues?
3. What is the 2026-09-09 L&R event? Nothing in the master plan lands on that
   date. Until answered it stays flagged.
4. Which fiscal calendar do budget pools reset on?
5. Do Brand Managers see the Brand Hub for their own brand only, or the whole
   portfolio's guidelines for reference?
6. Keches Law Group's 2027 plan calls for event booths, branded street teams,
   quality swag, referral and PR packages, and a possible BRUNT boot-company
   collab, aimed at a blue-collar / union / nurses audience. Does any of that need
   modeling now (e.g. street-team kits as a distinct order type), or later?

## Acceptance checks

- A Brand Manager signed in as Jordan cannot retrieve a Keches order by guessing
  its URL or ID.
- An order reaches `Approved` only with both signatures recorded, and its
  `StatusEvent` history shows who did what.
- Budget remaining changes the moment an order is requested, not only when it's
  ordered.
- Converting an event kit creates one order per line, all tagged to the event and
  the correct fund.
- An unconfirmed event still renders its "needs detail" flag after the round trip
  through Postgres.
- Uploading a merch photo in the Brand Hub makes it visible to Vendor and
  Creative, and to that brand's manager only.
