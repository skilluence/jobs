import { NextResponse } from "next/server";

import { COMPANIES } from "@/lib/companies";
import { sweepAts } from "@/lib/sources/ats";
import { searchLinkedIn } from "@/lib/sources/linkedin";

// Apify is now optional, not required — the free sources below (LinkedIn
// guest search + a curated Greenhouse/Ashby/Lever company sweep) run
// unconditionally. If APIFY_API_TOKEN is set, its results are merged in on
// top rather than being the only source, so this keeps working whether or
// not there's Apify budget available.
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const ACTOR_RUN_URL = "https://api.apify.com/v2/acts/fantastic-jobs~advanced-linkedin-job-search-api/runs";
const DATASET_ITEMS_BASE_URL = "https://api.apify.com/v2/datasets";

async function waitForRun(runId) {
  for (let i = 0; i < 25; i++) {
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    if (!statusRes.ok) {
      throw new Error(`Status check failed (${statusRes.status})`);
    }
    const runInfo = await statusRes.json();
    const status = runInfo?.data?.status;
    if (status === "SUCCEEDED") {
      return runInfo.data.defaultDatasetId;
    }
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
      throw new Error(`Job search run ${status.toLowerCase()}. Please try again.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Search timed out after 50 seconds. Please try again.");
}

async function searchApify(query) {
  const payload = {
    limit: 100,
    includeAi: true,
    descriptionType: "html",
    titleSearch: [query],
    locationSearch: ["United States"],
  };

  const runResponse = await fetch(`${ACTOR_RUN_URL}?token=${APIFY_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!runResponse.ok) {
    throw new Error(`Unable to start search (${runResponse.status}).`);
  }

  const runData = await runResponse.json();
  const runId = runData?.data?.id;
  if (!runId) {
    throw new Error("Could not initialize Apify actor run.");
  }

  const datasetId = await waitForRun(runId);
  const itemsResponse = await fetch(
    `${DATASET_ITEMS_BASE_URL}/${datasetId}/items?token=${APIFY_TOKEN}&clean=true&format=json`
  );
  if (!itemsResponse.ok) {
    throw new Error(`Failed to fetch results (${itemsResponse.status}).`);
  }
  return itemsResponse.json();
}

export async function POST(request) {
  const body = await request.json();
  const query = String(body?.query || "").trim();
  if (!query) {
    return NextResponse.json({ error: "Missing query parameter." }, { status: 400 });
  }

  // Each source fails independently (Promise.allSettled) — one source being
  // down or rate-limited shouldn't take out the whole search the way a
  // single Apify failure used to.
  const [linkedinResult, atsResult, apifyResult] = await Promise.allSettled([
    searchLinkedIn({ query, location: "United States", pages: 3 }),
    sweepAts(COMPANIES, query),
    APIFY_TOKEN ? searchApify(query) : Promise.resolve([]),
  ]);

  const items = [];
  if (linkedinResult.status === "fulfilled") {
    items.push(...linkedinResult.value);
  } else {
    console.error("LinkedIn source failed:", linkedinResult.reason);
  }
  if (atsResult.status === "fulfilled") {
    items.push(...atsResult.value);
  } else {
    console.error("ATS source failed:", atsResult.reason);
  }
  if (apifyResult.status === "fulfilled") {
    items.push(...apifyResult.value);
  } else if (APIFY_TOKEN) {
    console.error("Apify source failed:", apifyResult.reason);
  }

  if (items.length === 0) {
    return NextResponse.json({ error: `No results found for "${query}".`, items: [] });
  }

  return NextResponse.json({ items, meta: { count: items.length } });
}
