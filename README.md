# Atticor Merch Hub

Internal tool for running branded-merch programs across the Atticor Group
portfolio of law firms: one approved catalog, one approval trail, one view of
spend per brand.

**This repo currently holds a working prototype**, not production code. All data
is hardcoded and all state is in-memory — refreshing the page resets everything.
See [HANDOFF.md](./HANDOFF.md) for the full build spec.

## Run it

Requires Node 18.17 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

You'll land on the login screen. There's no real auth yet — use the
"DEMO · continue as" buttons to enter as any role, or "Sign in" to enter as
Hazel (admin). The role pills in the top bar switch views without signing out.

## Deploy to Vercel

```bash
npm i -g vercel
vercel            # link and deploy a preview
vercel --prod
```

Or push to GitHub and import the repo at vercel.com/new. Framework preset is
detected as Next.js; no build settings need changing. The prototype needs no
environment variables. Production will — copy `.env.example` and fill it in as
each phase in HANDOFF.md lands.

## What's here

```
app/
  layout.jsx          root layout, metadata, font fallback notes
  page.jsx            renders the app
  globals.css         Tailwind entry + commented @font-face for licensed faces
components/
  AtticorMerchHub.jsx the whole prototype — seed data at the top, one component
                      per role view below
public/merch/         real Lerner & Rowe merch photos used by the Brand Hub
prisma/schema.prisma  proposed production data model (not migrated)
HANDOFF.md            build spec: roles, lifecycle, screens, phases, open questions
.env.example          every variable the production build will need
```

## Known gaps

- No database, no authentication, no file uploads. All three are demo-only.
- STK Bureau Serif and STK Miso are licensed foundry fonts and aren't included;
  headings fall back to a system serif on purpose.
- Lerner & Rowe and Keches palettes are intentionally empty rather than guessed.
- One September event is flagged "needs detail" because its specifics are
  unconfirmed. Leave the flag until someone confirms them.
- Budgets are one pool per brand, which is wrong for Lerner & Rowe — firm-paid
  (L&R) and foundation-funded (LRGB) spend need separate ledgers.
- Every order assumes SwagMyBrand as vendor. L&R already uses On Target Media
  and BoomPromo.

The last two are modeled correctly in `prisma/schema.prisma` and are the first
real decisions to make.
