"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Calendar, PenTool, CheckCircle2,
  Clock, Truck, Send, Plus, Minus, X, Building2, Wallet, ChevronRight,
  Stamp, Factory, Receipt, MapPin, Users, Store, Boxes, AlertTriangle, BookOpen, ExternalLink, LogOut, Palette
} from "lucide-react";

/* ---------- Brand palette (Atticor) ---------- */
const C = {
  teal: "#013828",     // Mid Green (primary)
  mint: "#F8FAF2",     // Off White
  medteal: "#D0D9BA",  // Light Green
  cream: "#E4EAD3",    // light green tint (warm-surface role)
  gold: "#FFA967",     // gradient accent — orange
  ink: "#081D01",      // Dark Green
  sub: "#5B6B58",
  white: "#FFFFFF",
  line: "#DDE3D0",
  danger: "#B4553F",
};
const serif = "'STK Bureau Serif', ui-serif, Georgia, 'Times New Roman', serif";
const grad = "linear-gradient(90deg, #4DFFFF, #CFFCCC, #FFA967)";
/* MERCH_THUMBS */
/* Merch photos live in /public/merch — swap for real storage (Vercel Blob) in production. */
const merchThumbs = {
  camo: "/merch/camo.jpg",
  cactus_tee: "/merch/cactus_tee.jpg",
  lr_hat: "/merch/lr_hat.jpg",
  givesback: "/merch/givesback.jpg",
  sfe_tee: "/merch/sfe_tee.jpg",
};
/* END_MERCH_THUMBS */

/* ---------- Brand asset library (guidelines, palette, past merch, idea decks) ---------- */
const BRAND_ASSETS = {
  "Atticor": {
    guidelines: [{ label: "Brand Guidelines 2026", type: "PDF" }, { label: "Canva Brand Kit", type: "Canva", url: "https://www.canva.com/brand/kAG-ZtMOIGI" }],
    palette: [["Dark Green", "#081D01"], ["Mid Green", "#013828"], ["Light Green", "#D0D9BA"], ["Off White", "#F8FAF2"]],
    fonts: ["STK Bureau Serif — headlines", "STK Miso — body & captions"],
    merch: [],
    decks: [],
  },
  "Lerner & Rowe": {
    guidelines: [{ label: "L&R Brand Guidelines", type: "PDF" }],
    palette: [],
    fonts: [],
    merch: [
      { name: "LR Camo Snapback + Realtree Trucker", thumb: merchThumbs.camo, status: "Archived", note: "Embroidered LR / wordmark on camo + Realtree." },
      { name: "Scales of Justice Cactus Tee (Natural)", thumb: merchThumbs.cactus_tee, status: "In stock", note: "Natural tee, desert 'Scales of Justice' back print." },
      { name: "LR Cream/Black Snapback (OTTO)", thumb: merchThumbs.lr_hat, status: "In stock", note: "OTTO classic mid-profile, 3D black LR." },
      { name: "Gives Back Heart Tee (White/Blue)", thumb: merchThumbs.givesback, status: "In stock", note: "LRGB event tee, blue heart print." },
      { name: "SFE x L&R Arizona Tee (Black/Gold)", thumb: merchThumbs.sfe_tee, status: "Archived", note: "State Forty Eight collab, gold desert scene." },
    ],
    decks: [
      { label: "L&R Closing Gifts", url: "https://boompromo.commonsku.com/present.php?id=bf3869fb-77c6-4c91-979a-fbe86451dcfc" },
      { label: "L&R Influencer Gifts", url: "https://boompromo.commonsku.com/present.php?id=b03981e1-5295-4ba2-8bc0-3bf1d10d8ffa" },
      { label: "L&R Apparel Ideas", url: "https://boompromo.commonsku.com/present.php?id=e6b9630c-890b-4714-af66-631f5fffabdc" },
    ],
  },
};
const assetsFor = (b) => BRAND_ASSETS[b] || { guidelines: [], palette: [], fonts: [], merch: [], decks: [] };


/* ---------- Reference data ---------- */
const BRANDS = [
  { name: "Lerner & Rowe", manager: "Jordan Moreno", pool: 30000 },
  { name: "Keches Law Group", manager: "Victoria Tuttle", pool: 18000 },
  { name: "Parrish DeVaughn", manager: "Unassigned", pool: 15000 },
  { name: "Wettermark Keith", manager: "Unassigned", pool: 20000 },
  { name: "Sweet James", manager: "Unassigned", pool: 22000 },
  { name: "Edgar Snyder", manager: "Unassigned", pool: 16000 },
];

const CATALOG = [
  { name: "Quarter-Zip Pullover", cat: "Apparel", price: 42 },
  { name: "Cotton Tee", cat: "Apparel", price: 11 },
  { name: "Hoodie", cat: "Apparel", price: 38 },
  { name: "Baseball Cap", cat: "Headwear", price: 16 },
  { name: "Knit Beanie", cat: "Headwear", price: 14 },
  { name: "Canvas Tote", cat: "Bags", price: 9 },
  { name: "Commuter Backpack", cat: "Bags", price: 34 },
  { name: "Tumbler 20oz", cat: "Drinkware", price: 18 },
  { name: "Insulated Bottle", cat: "Drinkware", price: 22 },
  { name: "Bamboo Notebook", cat: "Eco-Friendly", price: 8 },
  { name: "Seed Paper Card", cat: "Eco-Friendly", price: 2 },
  { name: "Ballpoint Pen", cat: "Office", price: 1.2 },
  { name: "Spiral Notebook", cat: "Office", price: 6 },
  { name: "Wireless Charger", cat: "Technology", price: 24 },
  { name: "Leather Portfolio", cat: "Luxury Items", price: 48 },
];
const CATS = ["Apparel", "Headwear", "Bags", "Drinkware", "Eco-Friendly", "Office", "Technology", "Luxury Items"];

/* status pipeline */
const FLOW = ["Requested", "In Design", "Awaiting Approval", "Approved", "Ordered", "In Production", "Shipped", "Received"];
const PIPELINE = ["Requested", "In Design", "Awaiting Approval", "Approved"];
const COMMITTED = ["Ordered", "In Production", "Shipped", "Received"];

let _id = 100;
const nid = () => `SM-${++_id}`;

const seedOrders = [
  mk("Lerner & Rowe", "Quarter-Zip Pullover", 60, "Received", { invoiced: true, event: "Love Pup Concert" }),
  mk("Lerner & Rowe", "Canvas Tote", 250, "In Production", { event: "Thanksgiving Meal Giveaway" }),
  mk("Lerner & Rowe", "Ballpoint Pen", 300, "Awaiting Approval", { approvals: { hazel: true, bm: false } }),
  mk("Keches Law Group", "Tumbler 20oz", 120, "Shipped", { invoiced: true, event: "Community 5K" }),
  mk("Keches Law Group", "Cotton Tee", 500, "Awaiting Approval", { approvals: { hazel: false, bm: false }, event: "Community 5K" }),
  mk("Keches Law Group", "Knit Beanie", 200, "In Design", {}),
  mk("Parrish DeVaughn", "Hoodie", 80, "Ordered", {}),
  mk("Wettermark Keith", "Baseball Cap", 150, "Requested", {}),
  mk("Sweet James", "Leather Portfolio", 40, "Received", { invoiced: true }),
  mk("Edgar Snyder", "Insulated Bottle", 100, "Approved", { approvals: { hazel: true, bm: true } }),
];

function mk(brand, item, qty, status, opts = {}) {
  const c = CATALOG.find((x) => x.name === item);
  return {
    id: nid(),
    brand, item, qty,
    cat: c.cat, unitPrice: c.price,
    status,
    invoiced: !!opts.invoiced,
    event: opts.event || null,
    requestedBy: BRANDS.find((b) => b.name === brand)?.manager || "—",
    approvals: opts.approvals || { hazel: false, bm: false },
    date: "2026-08",
  };
}

// Upcoming events. L&R entries drawn from the Community & Events Master Plan (DMA-tagged, L&R = firm-paid).
// "Details TBD" flags things I don't have confirmed specifics on yet.
const seedEvents = [
  { id: "E1", name: "L&R Community Activation (details TBD)", brand: "Lerner & Rowe", type: "L&R", location: "DMA TBD", date: "2026-09-09", headcount: 200, tbd: true, est: [["Baseball Cap", 200], ["Canvas Tote", 200]] },
  { id: "E2", name: "9/11 Freedom Breakfast (Title Sponsor)", brand: "Lerner & Rowe", type: "LRGB", location: "Phoenix, AZ", date: "2026-09-11", headcount: 300, est: [["Ballpoint Pen", 300], ["Bamboo Notebook", 300]] },
  { id: "E3", name: "Community 5K", brand: "Keches Law Group", type: "Firm", location: "Boston, MA", date: "2026-09-27", headcount: 500, est: [["Cotton Tee", 500], ["Tumbler 20oz", 200]] },
  { id: "E4", name: "OKC Thunder Game", brand: "Parrish DeVaughn", type: "Firm", location: "Oklahoma City, OK", date: "2026-10-06", headcount: 500, est: [["Cotton Tee", 500], ["Knit Beanie", 300]] },
  { id: "E5", name: "Legal Recruiting Fair", brand: "Wettermark Keith", type: "Firm", location: "Birmingham, AL", date: "2026-10-11", headcount: 300, est: [["Canvas Tote", 300], ["Bamboo Notebook", 300]] },
  { id: "E6", name: "Love Pup Concert", brand: "Lerner & Rowe", type: "LRGB", location: "Phoenix, AZ", date: "2026-10-24", headcount: 600, est: [["Cotton Tee", 400], ["Insulated Bottle", 300]] },
  { id: "E7", name: "Thanksgiving Meal Giveaway", brand: "Lerner & Rowe", type: "L&R", location: "Phoenix, AZ", date: "2026-11-21", headcount: 800, est: [["Canvas Tote", 800], ["Baseball Cap", 400]] },
  { id: "E8", name: "Chai Gives Back Toy Drive", brand: "Lerner & Rowe", type: "L&R", location: "Chicago, IL", date: "2026-12-06", headcount: 1000, est: [["Canvas Tote", 1000], ["Cotton Tee", 500]] },
];

const seedStock = {
  "Canvas Tote": { onHand: 400, status: "In stock" },
  "Quarter-Zip Pullover": { onHand: 20, status: "Sourcing" },
  "Ballpoint Pen": { onHand: 120, status: "Backordered" },
  "Tumbler 20oz": { onHand: 260, status: "In stock" },
  "Cotton Tee": { onHand: 150, status: "Sourcing" },
  "Hoodie": { onHand: 0, status: "Not started" },
  "Insulated Bottle": { onHand: 80, status: "Sourcing" },
  "Leather Portfolio": { onHand: 60, status: "In stock" },
};

/* ---------- helpers ---------- */
const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const lineTotal = (o) => o.qty * o.unitPrice;

function brandBudget(orders, brandName) {
  const b = BRANDS.find((x) => x.name === brandName);
  const mine = orders.filter((o) => o.brand === brandName);
  const pipeline = mine.filter((o) => PIPELINE.includes(o.status)).reduce((s, o) => s + lineTotal(o), 0);
  const committed = mine.filter((o) => COMMITTED.includes(o.status)).reduce((s, o) => s + lineTotal(o), 0);
  const invoiced = mine.filter((o) => o.invoiced).reduce((s, o) => s + lineTotal(o), 0);
  const remaining = b.pool - committed - pipeline;
  return { pool: b.pool, pipeline, committed, invoiced, remaining };
}

/* ---------- small UI atoms ---------- */
function Pill({ status }) {
  const map = {
    "Requested": [C.cream, C.ink], "In Design": [C.gold, C.ink],
    "Awaiting Approval": ["#FCE0C9", C.ink], "Approved": [C.medteal, C.ink],
    "Ordered": [C.teal, "#fff"], "In Production": [C.teal, "#fff"],
    "Shipped": [C.teal, "#fff"], "Received": ["#2E4A48", "#fff"],
  };
  const [bg, fg] = map[status] || [C.mint, C.ink];
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: bg, color: fg }}>{status}</span>;
}

function Meter({ b }) {
  const seg = (v, color) => ({ width: `${Math.max(0, Math.min(100, (v / b.pool) * 100))}%`, background: color });
  return (
    <div>
      <div className="h-2.5 w-full rounded-full overflow-hidden flex" style={{ background: C.medteal }}>
        <div style={seg(b.committed, C.teal)} title="Committed" />
        <div style={seg(b.pipeline, C.gold)} title="Pipeline" />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: C.sub }}>
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: C.teal }} />Committed {money(b.committed)}</span>
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: C.gold }} />Pipeline {money(b.pipeline)}</span>
        <span className="inline-flex items-center gap-1"><Receipt size={12} />Invoiced {money(b.invoiced)}</span>
        <span className="font-semibold" style={{ color: b.remaining < 0 ? C.danger : C.teal }}>Remaining {money(b.remaining)}</span>
      </div>
    </div>
  );
}

function Card({ children, className = "", style = {} }) {
  return <div className={"rounded-2xl " + className} style={{ background: "#fff", border: `1px solid ${C.line}`, ...style }}>{children}</div>;
}

function Btn({ children, onClick, kind = "solid", size = "md", disabled }) {
  const base = "inline-flex items-center gap-1.5 rounded-full font-medium transition";
  const pad = size === "sm" ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2";
  const styles = kind === "solid"
    ? { background: disabled ? C.line : C.teal, color: "#fff" }
    : kind === "gold"
    ? { background: C.gold, color: C.ink }
    : { background: "#fff", color: C.teal, border: `1px solid ${C.teal}` };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${pad}`} style={{ ...styles, opacity: disabled ? 0.6 : 1, cursor: disabled ? "default" : "pointer" }}>{children}</button>;
}

/* ================= APP ================= */
export default function App() {
  // STK Bureau Serif / STK Miso are licensed foundry fonts (not free web fonts),
  // so this prototype renders with a serif/sans fallback; drop the real files into the production build.
  const [role, setRole] = useState("admin"); // admin | bm | creative | event | vendor
  const [authed, setAuthed] = useState(false);
  const [bmName, setBmName] = useState("Jordan Moreno");
  const [orders, setOrders] = useState(seedOrders);
  const [events] = useState(seedEvents);
  const [stock, setStock] = useState(seedStock);
  const [tab, setTab] = useState("overview");

  const bmBrand = BRANDS.find((b) => b.manager === bmName)?.name;

  /* mutations */
  const setStatus = (id, status) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  const approve = (id, who) =>
    setOrders((o) =>
      o.map((x) => {
        if (x.id !== id) return x;
        const approvals = { ...x.approvals, [who]: true };
        const status = approvals.hazel && approvals.bm ? "Approved" : x.status;
        return { ...x, approvals, status };
      })
    );
  const toggleInvoiced = (id) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, invoiced: !x.invoiced } : x)));
  const setStockField = (item, field, val) =>
    setStock((s) => ({ ...s, [item]: { onHand: 0, status: "Not started", ...s[item], [field]: val } }));
  const addOrders = (brand, by, lines, event) =>
    setOrders((o) => [
      ...lines.map((ln) => {
        const c = CATALOG.find((x) => x.name === ln.name);
        return { id: nid(), brand, item: ln.name, qty: ln.qty, cat: c.cat, unitPrice: c.price, status: "Requested", invoiced: false, event: event || null, requestedBy: by, approvals: { hazel: false, bm: false }, date: "2026-08" };
      }),
      ...o,
    ]);

  const ROLES = [
    { id: "admin", label: "Hazel · Admin", icon: LayoutDashboard },
    { id: "bm", label: "Brand Manager", icon: Building2 },
    { id: "creative", label: "Jon · Creative", icon: PenTool },
    { id: "event", label: "Event Manager", icon: Calendar },
    { id: "vendor", label: "Jenny · Vendor", icon: Store },
  ];

  useEffect(() => {
    const def = { admin: "overview", bm: "brand", creative: "queue", event: "calendar", vendor: "incoming" };
    setTab(def[role] || "overview");
  }, [role]);

  if (!authed) return <Login onEnter={(r) => { setRole(r); setAuthed(true); }} />;

  return (
    <div style={{ background: C.mint, minHeight: "100vh", color: C.ink, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {/* top bar */}
      <div style={{ background: C.teal }} className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: grad }}>
            <Package size={20} color={C.ink} />
          </div>
          <div>
            <div style={{ fontFamily: serif, color: "#fff", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em" }}>Atticor Merch Hub</div>
            <div style={{ color: C.medteal, fontSize: 11 }}>One approved catalog · sourced by SwagMyBrand</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ color: C.medteal, fontSize: 12 }}>View as</span>
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{ background: role === r.id ? C.gold : "rgba(255,255,255,0.12)", color: role === r.id ? C.ink : "#fff" }}>
              <r.icon size={13} /> {r.label}
            </button>
          ))}
          <button onClick={() => setAuthed(false)} title="Sign out"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
            <LogOut size={13} />
          </button>
        </div>
      </div>
      <div style={{ height: 3, background: grad }} />

      {/* bm brand selector */}
      {role === "bm" && (
        <div className="px-5 py-2 flex items-center gap-2 text-xs" style={{ background: C.cream }}>
          <span style={{ color: C.sub }}>Signed in as</span>
          {["Jordan Moreno", "Victoria Tuttle"].map((n) => (
            <button key={n} onClick={() => setBmName(n)} className="rounded-full px-3 py-1 font-medium"
              style={{ background: bmName === n ? C.teal : "#fff", color: bmName === n ? "#fff" : C.ink, border: `1px solid ${C.teal}` }}>
              {n} · {BRANDS.find((b) => b.manager === n)?.name}
            </button>
          ))}
          <span style={{ color: C.sub }} className="ml-auto">Brand Managers only ever see their own brand.</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-5">
        {role === "admin" && <AdminNav tab={tab} setTab={setTab} orders={orders} />}
        {role === "admin" && tab === "overview" && <AdminOverview orders={orders} events={events} />}
        {role === "admin" && tab === "orders" && <OrdersTable orders={orders} admin setStatus={setStatus} approve={approve} toggleInvoiced={toggleInvoiced} />}
        {role === "admin" && tab === "budgets" && <Budgets orders={orders} />}
        {role === "admin" && tab === "catalog" && <CatalogView />}
        {role === "admin" && tab === "brandhub" && <BrandHub />}
        {role === "admin" && tab === "approvals" && <Approvals orders={orders} who="hazel" approve={approve} />}

        {role === "bm" && <BrandManager brand={bmBrand} by={bmName} orders={orders} events={events} addOrders={addOrders} approve={approve} />}

        {role === "creative" && <Creative orders={orders} setStatus={setStatus} />}

        {role === "event" && <EventManager events={events} orders={orders} addOrders={addOrders} />}

        {role === "vendor" && <Vendor orders={orders} stock={stock} setStockField={setStockField} setStatus={setStatus} />}
      </div>
    </div>
  );
}

/* ---------- Admin nav ---------- */
function AdminNav({ tab, setTab, orders }) {
  const pending = orders.filter((o) => o.status === "Awaiting Approval" && !o.approvals.hazel).length;
  const tabs = [
    ["overview", "Overview", LayoutDashboard, 0],
    ["orders", "All Orders", ShoppingCart, 0],
    ["budgets", "Budgets", Wallet, 0],
    ["catalog", "Catalog", Package, 0],
    ["brandhub", "Brand Hub", BookOpen, 0],
    ["approvals", "Approvals", Stamp, pending],
  ];
  return (
    <div className="flex gap-1.5 flex-wrap mb-5">
      {tabs.map(([id, label, Icon, badge]) => (
        <button key={id} onClick={() => setTab(id)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{ background: tab === id ? C.teal : "#fff", color: tab === id ? "#fff" : C.ink, border: `1px solid ${C.line}` }}>
          <Icon size={15} /> {label}
          {badge > 0 && <span className="text-xs rounded-full px-1.5" style={{ background: C.gold, color: C.ink }}>{badge}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- Admin overview ---------- */
function AdminOverview({ orders, events }) {
  const totals = useMemo(() => {
    const committed = orders.filter((o) => COMMITTED.includes(o.status)).reduce((s, o) => s + lineTotal(o), 0);
    const invoiced = orders.filter((o) => o.invoiced).reduce((s, o) => s + lineTotal(o), 0);
    const pipeline = orders.filter((o) => PIPELINE.includes(o.status)).reduce((s, o) => s + lineTotal(o), 0);
    const open = orders.filter((o) => o.status !== "Received").length;
    const pendingAppr = orders.filter((o) => o.status === "Awaiting Approval").length;
    return { committed, invoiced, pipeline, open, pendingAppr };
  }, [orders]);

  const kpis = [
    ["Committed", money(totals.committed), C.teal, Factory],
    ["Invoiced", money(totals.invoiced), "#2E4A48", Receipt],
    ["In pipeline", money(totals.pipeline), C.gold, Clock],
    ["Open orders", totals.open, C.teal, ShoppingCart],
    ["Awaiting sign-off", totals.pendingAppr, C.danger, Stamp],
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map(([label, val, col, Icon]) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between">
              <span style={{ color: C.sub, fontSize: 12 }}>{label}</span>
              <Icon size={16} color={col} />
            </div>
            <div style={{ fontFamily: serif, fontSize: 26, color: col, marginTop: 6 }}>{val}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="p-5 md:col-span-2">
          <h3 style={{ fontFamily: serif, fontSize: 18 }}>Budget by brand · Q3 2026</h3>
          <p style={{ color: C.sub, fontSize: 12, marginBottom: 14 }}>Committed and invoiced are tracked separately. Pipeline is requested-but-not-yet-ordered.</p>
          <div className="space-y-4">
            {BRANDS.map((b) => {
              const bb = brandBudget(orders, b.name);
              return (
                <div key={b.name}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-sm">{b.name} <span style={{ color: C.sub, fontWeight: 400 }}>· {b.manager}</span></span>
                    <span style={{ color: C.sub, fontSize: 12 }}>Pool {money(bb.pool)}</span>
                  </div>
                  <Meter b={bb} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 style={{ fontFamily: serif, fontSize: 18 }}>Upcoming events</h3>
          <div className="space-y-3 mt-3">
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <div className="rounded-lg px-2 py-1 text-center" style={{ background: C.medteal, minWidth: 46 }}>
                  <div style={{ fontFamily: serif, fontSize: 16, lineHeight: 1 }}>{e.date.slice(8)}</div>
                  <div style={{ fontSize: 10, color: C.sub }}>{["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][+e.date.slice(5, 7)]}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{e.name}</div>
                  <div style={{ color: C.sub, fontSize: 12 }}>{e.brand} · {e.location} · {e.headcount} ppl</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 style={{ fontFamily: serif, fontSize: 18, marginBottom: 10 }}>Recent orders</h3>
        <OrdersTable orders={orders.slice(0, 6)} compact />
      </Card>
    </div>
  );
}

/* ---------- Orders table ---------- */
function OrdersTable({ orders, admin, compact, setStatus, approve, toggleInvoiced }) {
  const next = (o) => {
    const i = FLOW.indexOf(o.status);
    return i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : null;
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: C.sub, fontSize: 12, textAlign: "left" }}>
            <th className="py-2 pr-3">Order</th>
            <th className="py-2 pr-3">Brand</th>
            <th className="py-2 pr-3">Item</th>
            <th className="py-2 pr-3 text-right">Qty</th>
            <th className="py-2 pr-3 text-right">Line total</th>
            <th className="py-2 pr-3">Status</th>
            {!compact && <th className="py-2 pr-3">Invoiced</th>}
            {admin && <th className="py-2 pr-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ borderTop: `1px solid ${C.line}` }}>
              <td className="py-2.5 pr-3" style={{ color: C.sub }}>{o.id}</td>
              <td className="py-2.5 pr-3">{o.brand}</td>
              <td className="py-2.5 pr-3">{o.item}{o.event && <span style={{ color: C.sub, fontSize: 11 }}> · {o.event}</span>}</td>
              <td className="py-2.5 pr-3 text-right">{o.qty}</td>
              <td className="py-2.5 pr-3 text-right">{money(lineTotal(o))}</td>
              <td className="py-2.5 pr-3"><Pill status={o.status} /></td>
              {!compact && <td className="py-2.5 pr-3">{o.invoiced ? <span style={{ color: C.teal }}>✓</span> : <span style={{ color: C.line }}>—</span>}</td>}
              {admin && (
                <td className="py-2.5 pr-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {o.status === "Awaiting Approval" && !o.approvals.hazel && (
                      <Btn size="sm" kind="gold" onClick={() => approve(o.id, "hazel")}><Stamp size={13} />Approve (Hazel)</Btn>
                    )}
                    {o.status === "Approved" && (
                      <Btn size="sm" onClick={() => setStatus(o.id, "Ordered")}><Send size={13} />Send to SwagMyBrand</Btn>
                    )}
                    {["Ordered", "In Production", "Shipped"].includes(o.status) && (
                      <Btn size="sm" kind="outline" onClick={() => setStatus(o.id, next(o))}><ChevronRight size={13} />{next(o)}</Btn>
                    )}
                    {COMMITTED.includes(o.status) && (
                      <Btn size="sm" kind="outline" onClick={() => toggleInvoiced(o.id)}><Receipt size={13} />{o.invoiced ? "Un-invoice" : "Mark invoiced"}</Btn>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Budgets ---------- */
function Budgets({ orders }) {
  return (
    <Card className="p-5">
      <h3 style={{ fontFamily: serif, fontSize: 20 }}>Brand budgets · Q3 2026</h3>
      <p style={{ color: C.sub, fontSize: 12, marginBottom: 8 }}>Per-brand pools, reassessed quarterly. Committed vs. invoiced never mix.</p>
      <table className="w-full text-sm mt-2">
        <thead>
          <tr style={{ color: C.sub, fontSize: 12, textAlign: "left" }}>
            <th className="py-2">Brand</th><th className="py-2 text-right">Pool</th>
            <th className="py-2 text-right">Committed</th><th className="py-2 text-right">Invoiced</th>
            <th className="py-2 text-right">Pipeline</th><th className="py-2 text-right">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {BRANDS.map((b) => {
            const bb = brandBudget(orders, b.name);
            return (
              <tr key={b.name} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-2.5">{b.name}</td>
                <td className="py-2.5 text-right">{money(bb.pool)}</td>
                <td className="py-2.5 text-right" style={{ color: C.teal }}>{money(bb.committed)}</td>
                <td className="py-2.5 text-right">{money(bb.invoiced)}</td>
                <td className="py-2.5 text-right" style={{ color: C.gold }}>{money(bb.pipeline)}</td>
                <td className="py-2.5 text-right font-semibold" style={{ color: bb.remaining < 0 ? C.danger : C.ink }}>{money(bb.remaining)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

/* ---------- Catalog ---------- */
function CatalogView() {
  const [cat, setCat] = useState("All");
  const items = CATALOG.filter((i) => cat === "All" || i.cat === cat);
  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {["All", ...CATS].map((c) => (
          <button key={c} onClick={() => setCat(c)} className="rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: cat === c ? C.teal : "#fff", color: cat === c ? "#fff" : C.ink, border: `1px solid ${C.line}` }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((i) => (
          <Card key={i.name} className="p-4">
            <div className="h-20 rounded-xl mb-3 flex items-center justify-center" style={{ background: C.medteal }}>
              <Package size={26} color={C.teal} />
            </div>
            <div className="text-sm font-medium">{i.name}</div>
            <div className="flex justify-between items-baseline mt-1">
              <span style={{ color: C.sub, fontSize: 11 }}>{i.cat}</span>
              <span style={{ fontFamily: serif, color: C.teal }}>${i.price.toFixed(2)}</span>
            </div>
          </Card>
        ))}
      </div>
      <p style={{ color: C.sub, fontSize: 12, marginTop: 12 }}>Pre-approved unit pricing from Jenny at SwagMyBrand. Items are branded per firm at production.</p>
    </div>
  );
}

/* ---------- Approvals (dual sign-off) ---------- */
function Approvals({ orders, who, approve }) {
  const queue = orders.filter((o) => o.status === "Awaiting Approval");
  if (!queue.length) return <Card className="p-8 text-center" style={{ color: C.sub }}>Nothing awaiting sign-off. You're clear.</Card>;
  return (
    <div className="space-y-3">
      <h3 style={{ fontFamily: serif, fontSize: 20 }}>Awaiting dual sign-off</h3>
      {queue.map((o) => (
        <Card key={o.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-medium">{o.item} · {o.qty} <span style={{ color: C.sub, fontWeight: 400 }}>({money(lineTotal(o))})</span></div>
            <div style={{ color: C.sub, fontSize: 12 }}>{o.brand}{o.event && ` · ${o.event}`} · requested by {o.requestedBy}</div>
          </div>
          <div className="flex items-center gap-4">
            <Stamps a={o.approvals} />
            <Btn kind="gold" disabled={o.approvals[who]} onClick={() => approve(o.id, who)}>
              <Stamp size={14} />{o.approvals[who] ? "Signed" : `Approve (${who === "hazel" ? "Hazel" : "Brand Mgr"})`}
            </Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}
function Stamps({ a }) {
  const chip = (ok, label) => (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
      style={{ background: ok ? C.medteal : C.line, color: C.ink, opacity: ok ? 1 : 0.7 }}>
      {ok ? <CheckCircle2 size={12} /> : <Clock size={12} />}{label}
    </span>
  );
  return <div className="flex gap-1.5">{chip(a.hazel, "Hazel")}{chip(a.bm, "Brand Mgr")}</div>;
}

/* ---------- Brand Manager ---------- */
function BrandManager({ brand, by, orders, events, addOrders, approve }) {
  const [cart, setCart] = useState({});
  const [eventTag, setEventTag] = useState("");
  const bb = brandBudget(orders, brand);
  const mine = orders.filter((o) => o.brand === brand);
  const myEvents = events.filter((e) => e.brand === brand);
  const setQty = (name, q) => setCart((c) => ({ ...c, [name]: Math.max(0, q) }));
  const lines = Object.entries(cart).filter(([, q]) => q > 0).map(([name, qty]) => ({ name, qty }));
  const cartTotal = lines.reduce((s, l) => s + l.qty * CATALOG.find((x) => x.name === l.name).price, 0);
  const submit = () => { if (lines.length) { addOrders(brand, by, lines, eventTag || null); setCart({}); setEventTag(""); } };

  return (
    <div className="space-y-5">
      <Card className="p-5" style={{ background: C.teal }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div style={{ color: C.medteal, fontSize: 12 }}>Brand workspace</div>
            <div style={{ fontFamily: serif, fontSize: 24, color: "#fff" }}>{brand}</div>
            <div style={{ color: C.medteal, fontSize: 12 }}>Manager · {by}</div>
          </div>
          <div className="text-right" style={{ color: "#fff" }}>
            <div style={{ fontSize: 12, color: C.medteal }}>Remaining this quarter</div>
            <div style={{ fontFamily: serif, fontSize: 28 }}>{money(bb.remaining)}</div>
          </div>
        </div>
        <div className="mt-4"><Meter b={bb} /></div>
      </Card>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <h3 style={{ fontFamily: serif, fontSize: 18, marginBottom: 10 }}>Order from the approved catalog</h3>
          <div className="grid grid-cols-2 gap-3">
            {CATALOG.map((i) => (
              <Card key={i.name} className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{i.name}</div>
                  <div style={{ color: C.sub, fontSize: 11 }}>{i.cat} · ${i.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setQty(i.name, (cart[i.name] || 0) - 25)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}><Minus size={13} /></button>
                  <input value={cart[i.name] || 0} onChange={(e) => setQty(i.name, parseInt(e.target.value) || 0)} className="w-12 text-center text-sm rounded-md py-1" style={{ border: `1px solid ${C.line}` }} />
                  <button onClick={() => setQty(i.name, (cart[i.name] || 0) + 25)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.teal, color: "#fff" }}><Plus size={13} /></button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="p-4" style={{ position: "sticky", top: 12 }}>
            <h4 style={{ fontFamily: serif, fontSize: 16 }}>Request</h4>
            {lines.length === 0 ? (
              <p style={{ color: C.sub, fontSize: 13, marginTop: 8 }}>Add quantities to build a request. It routes to Jon for design, then to you and Hazel for sign-off.</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {lines.map((l) => (
                  <div key={l.name} className="flex justify-between text-sm">
                    <span>{l.qty} × {l.name}</span>
                    <span style={{ color: C.sub }}>{money(l.qty * CATALOG.find((x) => x.name === l.name).price)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-sm pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                  <span>Total</span><span>{money(cartTotal)}</span>
                </div>
                {cartTotal > bb.remaining && <div style={{ color: C.danger, fontSize: 12 }}>Exceeds remaining budget ({money(bb.remaining)}).</div>}
                <select value={eventTag} onChange={(e) => setEventTag(e.target.value)} className="w-full text-sm rounded-md py-2 px-2 mt-2" style={{ border: `1px solid ${C.line}` }}>
                  <option value="">Tie to an event (optional)</option>
                  {myEvents.map((e) => <option key={e.id} value={e.name}>{e.name} · {e.date}</option>)}
                </select>
                <div className="mt-2"><Btn onClick={submit}><Send size={14} />Submit request</Btn></div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* awaiting my sign-off */}
      {mine.some((o) => o.status === "Awaiting Approval" && !o.approvals.bm) && (
        <div>
          <h3 style={{ fontFamily: serif, fontSize: 18, marginBottom: 8 }}>Your sign-off needed</h3>
          <Approvals orders={mine} who="bm" approve={approve} />
        </div>
      )}

      <div>
        <h3 style={{ fontFamily: serif, fontSize: 18, marginBottom: 8 }}>Your orders</h3>
        <Card className="p-4"><OrdersTable orders={mine} /></Card>
      </div>
    </div>
  );
}

/* ---------- Creative (Jon) ---------- */
function Creative({ orders, setStatus }) {
  const [ctab, setCtab] = useState("tickets");
  const queue = orders.filter((o) => ["Requested", "In Design"].includes(o.status));
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        {[["tickets", "Design tickets", PenTool], ["brandhub", "Brand Hub", BookOpen]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setCtab(id)} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            style={{ background: ctab === id ? C.teal : "#fff", color: ctab === id ? "#fff" : C.ink, border: `1px solid ${C.line}` }}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>
      {ctab === "brandhub" && <BrandHub />}
      {ctab === "tickets" && (
      <>
      <div>
        <h2 style={{ fontFamily: serif, fontSize: 22 }}>Design tickets</h2>
        <p style={{ color: C.sub, fontSize: 13 }}>New requests land here automatically. Claim a ticket, upload the proof in your tool, then send it for sign-off.</p>
      </div>
      {queue.length === 0 && <Card className="p-8 text-center" style={{ color: C.sub }}>No open tickets. Nice.</Card>}
      <div className="grid md:grid-cols-2 gap-3">
        {queue.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{o.item} · {o.qty}</div>
                <div style={{ color: C.sub, fontSize: 12 }}>{o.brand}{o.event && ` · ${o.event}`}</div>
                <div style={{ color: C.sub, fontSize: 12 }}>Requested by {o.requestedBy}</div>
              </div>
              <Pill status={o.status} />
            </div>
            <div className="mt-3 flex gap-2">
              {o.status === "Requested" && <Btn size="sm" kind="outline" onClick={() => setStatus(o.id, "In Design")}><PenTool size={13} />Claim ticket</Btn>}
              {o.status === "In Design" && <Btn size="sm" kind="gold" onClick={() => setStatus(o.id, "Awaiting Approval")}><Send size={13} />Send proof for sign-off</Btn>}
            </div>
          </Card>
        ))}
      </div>
      </>
      )}
    </div>
  );
}

/* ---------- Vendor (Jenny · SwagMyBrand) ---------- */
const SRC = ["Not started", "Sourcing", "In stock", "Backordered"];
function SourcingPill({ status }) {
  const map = {
    "In stock": [C.medteal, C.ink],
    "Sourcing": [C.gold, C.ink],
    "Backordered": ["#F0D3C9", C.danger],
    "Not started": [C.line, C.sub],
  };
  const [bg, fg] = map[status] || [C.mint, C.sub];
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: bg, color: fg }}>{status}</span>;
}

function Vendor({ orders, stock, setStockField, setStatus }) {
  const [vtab, setVtab] = useState("stock");
  const stockOf = (item) => stock[item] || { onHand: 0, status: "Not started" };

  const agg = useMemo(() => {
    const m = {};
    orders.forEach((o) => {
      if (!m[o.item]) m[o.item] = { item: o.item, cat: o.cat, demand: 0, pipeline: 0, brands: new Set() };
      if (COMMITTED.includes(o.status)) { m[o.item].demand += o.qty; m[o.item].brands.add(o.brand); }
      else if (PIPELINE.includes(o.status)) m[o.item].pipeline += o.qty;
    });
    return Object.values(m).filter((r) => r.demand > 0 || r.pipeline > 0).sort((a, b) => b.demand - a.demand);
  }, [orders]);

  const incoming = orders.filter((o) => COMMITTED.includes(o.status) || o.status === "Approved");
  const totalUnits = agg.reduce((s, r) => s + r.demand, 0);
  const short = agg.filter((r) => r.demand - stockOf(r.item).onHand > 0).length;
  const back = agg.filter((r) => stockOf(r.item).status === "Backordered").length;
  const next = (o) => { const i = FLOW.indexOf(o.status); return i < FLOW.length - 1 ? FLOW[i + 1] : null; };

  const kpis = [
    ["Units to source", totalUnits.toLocaleString(), Boxes, C.teal],
    ["SKUs short", short, AlertTriangle, short ? C.danger : C.teal],
    ["Backordered", back, Clock, back ? C.danger : C.teal],
    ["Active orders", incoming.length, Truck, C.teal],
  ];

  return (
    <div className="space-y-5">
      <Card className="p-4 flex items-center gap-3" style={{ background: C.teal }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: grad }}><Store size={20} color={C.ink} /></div>
        <div>
          <div style={{ fontFamily: serif, fontSize: 20, color: "#fff" }}>SwagMyBrand · Vendor console</div>
          <div style={{ color: C.medteal, fontSize: 12 }}>Jenny · everything coming in across all Atticor brands</div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(([l, v, Icon, col]) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between"><span style={{ color: C.sub, fontSize: 12 }}>{l}</span><Icon size={16} color={col} /></div>
            <div style={{ fontFamily: serif, fontSize: 24, color: col, marginTop: 6 }}>{v}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-1.5">
        {[["stock", "Stock overview", Boxes], ["incoming", "Incoming orders", Truck], ["brandhub", "Brand Hub", BookOpen]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setVtab(id)} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            style={{ background: vtab === id ? C.teal : "#fff", color: vtab === id ? "#fff" : C.ink, border: `1px solid ${C.line}` }}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {vtab === "brandhub" && <BrandHub />}

      {vtab === "stock" && (
        <Card className="p-5">
          <h3 style={{ fontFamily: serif, fontSize: 18 }}>Stock &amp; sourcing by item</h3>
          <p style={{ color: C.sub, fontSize: 12, marginBottom: 10 }}>Demand is firm (committed) quantity aggregated across every brand. Pipeline is coming but not yet routed. Edit stock on hand and set sourcing status.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: C.sub, fontSize: 12, textAlign: "left" }}>
                  <th className="py-2 pr-3">Item</th><th className="py-2 pr-3 text-right">Brands</th>
                  <th className="py-2 pr-3 text-right">Demand</th><th className="py-2 pr-3 text-right">Pipeline</th>
                  <th className="py-2 pr-3 text-right">On hand</th><th className="py-2 pr-3 text-right">Shortfall</th>
                  <th className="py-2 pr-3">Sourcing</th>
                </tr>
              </thead>
              <tbody>
                {agg.map((r) => {
                  const st = stockOf(r.item);
                  const shortfall = r.demand - st.onHand;
                  return (
                    <tr key={r.item} style={{ borderTop: `1px solid ${C.line}` }}>
                      <td className="py-2.5 pr-3">{r.item}<div style={{ color: C.sub, fontSize: 11 }}>{r.cat}</div></td>
                      <td className="py-2.5 pr-3 text-right" style={{ color: C.sub }}>{r.brands.size}</td>
                      <td className="py-2.5 pr-3 text-right font-medium">{r.demand}</td>
                      <td className="py-2.5 pr-3 text-right" style={{ color: C.gold }}>{r.pipeline || "—"}</td>
                      <td className="py-2.5 pr-3 text-right">
                        <input type="number" value={st.onHand} onChange={(e) => setStockField(r.item, "onHand", parseInt(e.target.value) || 0)}
                          className="w-20 text-right text-sm rounded-md py-1 px-2" style={{ border: `1px solid ${C.line}` }} />
                      </td>
                      <td className="py-2.5 pr-3 text-right font-semibold" style={{ color: shortfall > 0 ? C.danger : C.teal }}>
                        {shortfall > 0 ? `Short ${shortfall}` : "OK"}
                      </td>
                      <td className="py-2.5 pr-3">
                        <select value={st.status} onChange={(e) => setStockField(r.item, "status", e.target.value)}
                          className="text-xs rounded-md py-1 px-2" style={{ border: `1px solid ${C.line}` }}>
                          {SRC.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {vtab === "incoming" && (
        <Card className="p-5">
          <h3 style={{ fontFamily: serif, fontSize: 18, marginBottom: 10 }}>Incoming from all brands</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: C.sub, fontSize: 12, textAlign: "left" }}>
                  <th className="py-2 pr-3">Order</th><th className="py-2 pr-3">Brand</th><th className="py-2 pr-3">Item</th>
                  <th className="py-2 pr-3 text-right">Qty</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Sourcing</th><th className="py-2 pr-3">Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {incoming.map((o) => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td className="py-2.5 pr-3" style={{ color: C.sub }}>{o.id}</td>
                    <td className="py-2.5 pr-3">{o.brand}</td>
                    <td className="py-2.5 pr-3">{o.item}{o.event && <span style={{ color: C.sub, fontSize: 11 }}> · {o.event}</span>}</td>
                    <td className="py-2.5 pr-3 text-right">{o.qty}</td>
                    <td className="py-2.5 pr-3"><Pill status={o.status} /></td>
                    <td className="py-2.5 pr-3"><SourcingPill status={stockOf(o.item).status} /></td>
                    <td className="py-2.5 pr-3">
                      {o.status === "Approved" && <span style={{ color: C.sub, fontSize: 12 }}>Awaiting routing</span>}
                      {["Ordered", "In Production", "Shipped"].includes(o.status) && (
                        <Btn size="sm" kind="outline" onClick={() => setStatus(o.id, next(o))}><ChevronRight size={13} />{next(o)}</Btn>
                      )}
                      {o.status === "Received" && <span style={{ color: C.teal, fontSize: 12 }}>Delivered ✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------- Event Manager ---------- */
function EventManager({ events, orders, addOrders }) {
  const [openId, setOpenId] = useState(null);
  const created = (name) => orders.filter((o) => o.event === name).length;
  return (
    <div className="space-y-4">
      <div>
        <h2 style={{ fontFamily: serif, fontSize: 22 }}>Upcoming events</h2>
        <p style={{ color: C.sub, fontSize: 13 }}>Estimated merch quantities per event. Turn any estimate into a request for that brand.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {events.map((e) => (
          <Card key={e.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div style={{ fontFamily: serif, fontSize: 18 }}>{e.name}</div>
                  {e.type && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: C.medteal, color: C.ink }}>{e.type}</span>}
                  {e.tbd && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "#FCE0C9", color: C.ink }}>needs detail</span>}
                </div>
                <div className="flex items-center gap-2 mt-1" style={{ color: C.sub, fontSize: 12 }}>
                  <MapPin size={12} />{e.location}<span>·</span><Calendar size={12} />{e.date}<span>·</span><Users size={12} />{e.headcount}
                </div>
                <div className="text-sm mt-1">{e.brand}</div>
              </div>
              {created(e.name) > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: C.medteal }}>{created(e.name)} order(s)</span>}
            </div>
            <div className="mt-3 rounded-xl p-3" style={{ background: C.medteal }}>
              <div style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>ESTIMATED QUANTITIES</div>
              {e.est.map(([item, qty]) => (
                <div key={item} className="flex justify-between text-sm py-0.5"><span>{item}</span><span className="font-medium">{qty}</span></div>
              ))}
            </div>
            <div className="mt-3">
              <Btn size="sm" onClick={() => { addOrders(e.brand, "Event Manager", e.est.map(([name, qty]) => ({ name, qty })), e.name); setOpenId(e.id); }}>
                <ShoppingCart size={13} />Create request from estimates
              </Btn>
              {openId === e.id && <span style={{ color: C.teal, fontSize: 12 }} className="ml-2">Sent to {e.brand}'s pipeline ✓</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Brand Hub (guidelines + palette + past merch + idea decks) ---------- */
function BrandHub() {
  const [b, setB] = useState("Lerner & Rowe");
  const a = assetsFor(b);
  const brandNames = ["Atticor", ...BRANDS.map((x) => x.name)];
  const chip = (s) => {
    const map = { "In stock": [C.medteal, C.ink], "Archived": [C.line, C.sub] };
    const [bg, fg] = map[s] || [C.line, C.sub];
    return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: bg, color: fg }}>{s}</span>;
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 style={{ fontFamily: serif, fontSize: 22 }}>Brand hub</h2>
        <p style={{ color: C.sub, fontSize: 13 }}>Guidelines, palettes, and past merch for every brand — one reference for creative and for sourcing.</p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {brandNames.map((n) => (
          <button key={n} onClick={() => setB(n)} className="rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: b === n ? C.teal : "#fff", color: b === n ? "#fff" : C.ink, border: `1px solid ${C.line}` }}>{n}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><BookOpen size={16} color={C.teal} /><h3 style={{ fontFamily: serif, fontSize: 16 }}>Guidelines</h3></div>
          {a.guidelines.length ? a.guidelines.map((g) => (
            g.url
              ? <a key={g.label} href={g.url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm py-2" style={{ borderTop: `1px solid ${C.line}` }}><span>{g.label}</span><ExternalLink size={14} color={C.teal} /></a>
              : <div key={g.label} className="flex items-center justify-between text-sm py-2" style={{ borderTop: `1px solid ${C.line}`, color: C.sub }}><span>{g.label}</span><span className="text-xs">{g.type}</span></div>
          )) : <button className="text-sm rounded-lg w-full py-2 mt-1" style={{ border: `1px dashed ${C.line}`, color: C.sub }}>+ Upload guidelines</button>}
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-3"><Palette size={16} color={C.teal} /><h3 style={{ fontFamily: serif, fontSize: 16 }}>Palette & type</h3></div>
          {a.palette.length ? (
            <div className="flex flex-wrap gap-3">
              {a.palette.map(([name, hex]) => (
                <div key={hex} className="text-center">
                  <div className="w-16 h-16 rounded-xl" style={{ background: hex, border: `1px solid ${C.line}` }} />
                  <div className="text-xs mt-1">{name}</div>
                  <div className="text-xs" style={{ color: C.sub }}>{hex}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm" style={{ color: C.sub }}>Palette not uploaded for {b} yet.</p>}
          {a.fonts.length > 0 && <div className="mt-4 text-sm" style={{ color: C.sub }}>{a.fonts.map((f) => <div key={f}>{f}</div>)}</div>}
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1"><Package size={16} color={C.teal} /><h3 style={{ fontFamily: serif, fontSize: 16 }}>Past merch & what's in stock</h3></div>
        <p style={{ color: C.sub, fontSize: 12, marginBottom: 12 }}>What's been produced and what's on hand, so nobody reinvents a design that already exists. Add photos as new runs come in.</p>
        {a.merch.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {a.merch.map((m) => (
              <div key={m.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
                <img src={m.thumb} alt={m.name} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                <div className="p-2.5">
                  <div className="text-sm font-medium" style={{ lineHeight: 1.15 }}>{m.name}</div>
                  <div className="mt-1">{chip(m.status)}</div>
                  <div className="text-xs mt-1" style={{ color: C.sub }}>{m.note}</div>
                </div>
              </div>
            ))}
            <button className="rounded-xl flex flex-col items-center justify-center gap-1 text-sm" style={{ border: `1px dashed ${C.line}`, color: C.sub, minHeight: 180 }}><Plus size={18} />Upload merch photo</button>
          </div>
        ) : <button className="text-sm rounded-lg py-3 px-4" style={{ border: `1px dashed ${C.line}`, color: C.sub }}>+ Upload the first merch photo for {b}</button>}
      </Card>

      {a.decks.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><ExternalLink size={16} color={C.teal} /><h3 style={{ fontFamily: serif, fontSize: 16 }}>Vendor idea decks</h3></div>
          <div className="grid md:grid-cols-3 gap-3">
            {a.decks.map((d) => (
              <a key={d.label} href={d.url} target="_blank" rel="noreferrer" className="rounded-xl p-4 flex items-center justify-between text-sm" style={{ border: `1px solid ${C.line}` }}>
                <span className="font-medium">{d.label}</span><ExternalLink size={14} color={C.teal} />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------- Login gate ---------- */
function Login({ onEnter }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const roles = [["bm", "Brand Manager", Building2], ["creative", "Creative", PenTool], ["event", "Event Manager", Calendar], ["vendor", "Vendor", Store]];
  return (
    <div style={{ minHeight: "100vh", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
          <div style={{ height: 4, background: grad }} />
          <div className="p-7">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: grad }}><Package size={20} color={C.ink} /></div>
              <div style={{ fontFamily: serif, fontSize: 22, color: C.ink, letterSpacing: "0.02em" }}>Atticor Merch Hub</div>
            </div>
            <p style={{ color: C.sub, fontSize: 13, marginTop: 10 }}>Sign in to order, approve, and track branded merch across the portfolio.</p>
            <div className="mt-5 space-y-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="w-full rounded-lg px-3 py-2.5 text-sm" style={{ border: `1px solid ${C.line}` }} />
              <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Password" className="w-full rounded-lg px-3 py-2.5 text-sm" style={{ border: `1px solid ${C.line}` }} />
              <button onClick={() => onEnter("admin")} className="w-full rounded-lg py-2.5 text-sm font-medium" style={{ background: C.teal, color: "#fff" }}>Sign in</button>
            </div>
            <div className="flex items-center gap-2 my-4"><div style={{ height: 1, background: C.line, flex: 1 }} /><span style={{ color: C.sub, fontSize: 11 }}>DEMO · continue as</span><div style={{ height: 1, background: C.line, flex: 1 }} /></div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(([id, label, Icon]) => (
                <button key={id} onClick={() => onEnter(id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium" style={{ border: `1px solid ${C.line}`, color: C.ink }}>
                  <Icon size={14} color={C.teal} />{label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p style={{ color: C.medteal, fontSize: 11, textAlign: "center", marginTop: 12 }}>Sourced by SwagMyBrand · Atticor Group</p>
      </div>
    </div>
  );
}
