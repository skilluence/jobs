// Starter list of companies to sweep via their public Greenhouse/Ashby/Lever
// board (see `lib/sources/ats.js`). These platforms have no "search every
// company" endpoint, so coverage is limited to whatever's listed here.
//
// To find a company's slug: open their careers page and look at the ATS
// URL it links to —
//   Greenhouse: boards.greenhouse.io/<slug>  (or job-boards.greenhouse.io/<slug>)
//   Ashby:      jobs.ashbyhq.com/<slug>
//   Lever:      jobs.lever.co/<slug>
// A wrong/outdated slug just contributes zero jobs for that company (the
// sweep fails silently per-company) — it won't break the others, so it's
// safe to add speculative entries and prune the ones that come back empty.
//
// This list is intentionally short to start — extend it with whichever
// companies matter most for Skilluence's candidates.
export const COMPANIES = [
  { board: "greenhouse", slug: "stripe" },
  { board: "greenhouse", slug: "airbnb" },
  { board: "greenhouse", slug: "doordash" },
  { board: "greenhouse", slug: "pinterest" },
  { board: "greenhouse", slug: "discord" },
  { board: "ashby", slug: "ramp" },
  { board: "ashby", slug: "notion" },
  { board: "ashby", slug: "linear" },
  { board: "ashby", slug: "vercel" },
  { board: "lever", slug: "attentive" },
];
