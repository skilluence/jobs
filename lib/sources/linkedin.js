// Data source: LinkedIn's public "jobs-guest" endpoints. No API key, no
// auth, no Apify — the same LinkedIn data the old Apify actor was scraping,
// fetched directly. Search returns an HTML list of job cards which we parse
// with regex (the markup is shallow and stable; pulling in a DOM parser for
// this is unnecessary).
//
// IMPORTANT: this is unauthenticated scraping of LinkedIn's guest UI, which
// is against LinkedIn's Terms of Service for automated/bulk access. This is
// a temporary workaround while the Apify actor's credits are exhausted, not
// a long-term guarantee — LinkedIn can change this markup or start blocking
// this traffic at any time, and doing this at real product volume (as
// opposed to a single personal job search) carries more exposure than the
// upstream reference implementation this was adapted from assumed. Keep
// request volume modest (see `pages` below) and treat this as a stopgap.

const SEARCH_URL = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search";
const UA = "Mozilla/5.0 (compatible; SkilluenceJobsBot/1.0)";

async function htmlFetch(url) {
  const maxRetries = 3;
  let delay = 500;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "X-Requested-With": "XMLHttpRequest",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) return "";
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 2, 4000);
      continue;
    }
    if (!response.ok) return "";
    return response.text();
  }
  return "";
}

function numericEntity(cp) {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function clean(html) {
  return decodeHtmlEntities(stripTags(html));
}

/** Parse the search response: a flat list of job cards, split on the
 * job-posting URN so one malformed card can't break the rest. */
function parseJobCards(html) {
  const results = [];
  const chunks = html.split(/data-entity-urn="urn:li:jobPosting:/).slice(1);

  for (const chunk of chunks) {
    const idMatch = chunk.match(/^(\d+)/);
    if (!idMatch) continue;
    const id = idMatch[1];

    const linkMatch = chunk.match(/class="base-card__full-link[^"]*"[^>]*href="([^"]+)"/i);
    const url = linkMatch ? decodeHtmlEntities(linkMatch[1]).split("?")[0] : "";

    let title = null;
    const h3 = chunk.match(/class="base-search-card__title"[^>]*>([\s\S]*?)<\/h3>/i);
    if (h3) title = clean(h3[1]);
    if (!title) {
      const sr = chunk.match(/class="sr-only"[^>]*>([\s\S]*?)<\/span>/i);
      if (sr) title = clean(sr[1]);
    }
    if (!title) continue;

    let company = null;
    const sub = chunk.match(/class="base-search-card__subtitle"[^>]*>([\s\S]*?)<\/h4>/i);
    if (sub) company = clean(sub[1]) || null;

    const loc = chunk.match(/class="job-search-card__location"[^>]*>([\s\S]*?)<\/span>/i);
    const location = loc ? clean(loc[1]) || null : null;
    const dt = chunk.match(/class="job-search-card__listdate[^"]*"[^>]*datetime="([^"]+)"/i);
    const date = dt ? dt[1] : null;

    results.push({
      id,
      title,
      company,
      location,
      date,
      url: url || `https://www.linkedin.com/jobs/view/${id}`,
    });
  }

  return results;
}

function buildUrl({ query, location, page }) {
  const params = new URLSearchParams();
  if (query) params.set("keywords", query);
  if (location) params.set("location", location);
  params.set("start", String((page - 1) * 10));
  return `${SEARCH_URL}?${params.toString()}`;
}

/**
 * Search LinkedIn's public guest job listings. Returns items already
 * normalized to the shape `app/page.js` expects.
 *
 * @param {{query: string, location?: string, pages?: number}} opts
 *   `pages` caps how many pages of ~10 results to fetch (kept modest per
 *   the ToS note above — this isn't meant to pull thousands of results).
 */
export async function searchLinkedIn({ query, location = "United States", pages = 3 }) {
  const seen = new Set();
  const items = [];

  for (let page = 1; page <= pages; page++) {
    const html = await htmlFetch(buildUrl({ query, location, page }));
    if (!html) break;
    const cards = parseJobCards(html);
    if (cards.length === 0) break;

    for (const card of cards) {
      if (seen.has(card.id)) continue;
      seen.add(card.id);
      items.push({
        id: `li-${card.id}`,
        title: card.title,
        company: card.company || "Company",
        locations: card.location || location,
        date_posted: card.date || new Date().toISOString(),
        url: card.url,
        description: null,
        source: "linkedin",
      });
    }
  }

  return items;
}
