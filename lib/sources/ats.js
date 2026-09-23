// Public, unauthenticated job-board APIs used by many companies' own career
// pages. Unlike the LinkedIn scrape (see `linkedin.js`), these are official,
// documented-enough public endpoints — no ToS gray area — but they're
// per-company: there's no "search all of Greenhouse" endpoint, so results
// are limited to whichever companies are listed in `lib/companies.js`.

async function fetchJson(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function sweepGreenhouse(slug) {
  const data = await fetchJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`);
  if (!data?.jobs) return [];
  return data.jobs.map((j) => ({
    id: `gh-${slug}-${j.id}`,
    title: j.title,
    company: j.company_name || slug,
    locations: j.location?.name || "United States",
    date_posted: j.updated_at || j.created_at || new Date().toISOString(),
    url: j.absolute_url,
    description: j.content || null,
    source: "greenhouse",
  }));
}

export async function sweepAshby(slug) {
  const data = await fetchJson(`https://api.ashbyhq.com/posting-api/job-board/${slug}`);
  if (!data?.jobs) return [];
  return data.jobs.map((j) => ({
    id: `ashby-${slug}-${j.id}`,
    title: j.title,
    company: slug,
    locations: j.location || j.address?.postalAddress?.addressLocality || "United States",
    date_posted: j.publishedAt || new Date().toISOString(),
    url: j.jobUrl || j.applyUrl,
    description: j.descriptionHtml || j.description || null,
    source: "ashby",
  }));
}

export async function sweepLever(slug) {
  const data = await fetchJson(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  if (!Array.isArray(data)) return [];
  return data.map((j) => ({
    id: `lever-${slug}-${j.id}`,
    title: j.text,
    company: slug,
    locations: j.categories?.location || "United States",
    date_posted: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString(),
    url: j.hostedUrl,
    description: j.descriptionPlain || j.description || null,
    source: "lever",
  }));
}

const SWEEPERS = { greenhouse: sweepGreenhouse, ashby: sweepAshby, lever: sweepLever };

/**
 * Sweep every configured company's board and keep only postings whose title
 * matches `query` (plain case-insensitive substring — these boards don't
 * support server-side keyword search the way LinkedIn does).
 */
export async function sweepAts(companies, query) {
  const perCompany = await Promise.all(
    companies.map(async (c) => {
      const sweep = SWEEPERS[c.board];
      if (!sweep) return [];
      try {
        return await sweep(c.slug);
      } catch {
        return [];
      }
    })
  );
  const all = perCompany.flat();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter((job) => (job.title || "").toLowerCase().includes(q));
}
